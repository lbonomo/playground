use attohttpc;
use gio::prelude::*;
use gtk::prelude::*;
use serde::Deserialize;
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;

#[derive(Deserialize)]
struct CoinGeckoResponse {
    ethereum: EthereumPrice,
}

#[derive(Deserialize)]
struct EthereumPrice {
    usd: f64,
}

struct AppState {
    last_price: Option<f64>,
    last_color_state: String,
    countdown_seconds: i32,
    last_status_text: String,
}

enum Message {
    Update(UpdateMessage),
    Tick,
}

struct UpdateMessage {
    text: Option<String>,
    status_text: String,
    current_price: Option<f64>,
}

const REFRESH_INTERVAL: i32 = 60;

fn main() {
    let application = gtk::Application::new(
        Some("com.example.ethereum_price"),
        Default::default(),
    );

    application.connect_activate(|app| {
        build_ui(app);
    });

    application.run();
}

fn build_ui(app: &gtk::Application) {
    let window = gtk::ApplicationWindow::new(app);
    window.set_title("Precio Ethereum");
    window.set_default_size(300, 150);
    window.set_resizable(false);

    let css_provider = gtk::CssProvider::new();
    let css_data = r#"
        .title-1 { font-size: 12px; }
        .title-2 { font-size: 24px; }
        .price-green { color: #0a8f08; }
        .price-light-green { color: #81c784; }
        .price-red { color: #c62828; }
        .price-light-red { color: #e57373; }
        .price-neutral { color: #000000; }
    "#;
    css_provider.load_from_data(css_data.as_bytes()).expect("Failed to load CSS");
    
    if let Some(screen) = gdk::Screen::default() {
        gtk::StyleContext::add_provider_for_screen(
            &screen,
            &css_provider,
            gtk::STYLE_PROVIDER_PRIORITY_APPLICATION,
        );
    }

    let box_layout = gtk::Box::new(gtk::Orientation::Vertical, 10);
    box_layout.set_margin_top(5);
    box_layout.set_margin_bottom(5);
    box_layout.set_margin_start(5);
    box_layout.set_margin_end(5);
    box_layout.set_halign(gtk::Align::Center);
    box_layout.set_valign(gtk::Align::Center);
    window.add(&box_layout);

    let title_label = gtk::Label::new(Some("ETH / USDT"));
    title_label.style_context().add_class("title-1");
    box_layout.pack_start(&title_label, false, false, 0);

    let price_label = gtk::Label::new(Some("Cargando..."));
    price_label.set_use_markup(true);
    price_label.style_context().add_class("title-2");
    price_label.style_context().add_class("price-neutral");
    box_layout.pack_start(&price_label, false, false, 0);

    let time_label = gtk::Label::new(Some(""));
    time_label.style_context().add_class("caption");
    box_layout.pack_start(&time_label, false, false, 0);

    window.show_all();

    let state = Arc::new(Mutex::new(AppState {
        last_price: None,
        last_color_state: "neutral".to_string(),
        countdown_seconds: REFRESH_INTERVAL,
        last_status_text: "".to_string(),
    }));

    // Setup channel for background updates
    let (tx, rx) = async_channel::unbounded();
    
    let price_label_c = price_label.clone();
    let time_label_c = time_label.clone();
    let state_c = state.clone();
    let tx_for_refresh = tx.clone();
    
    glib::MainContext::default().spawn_local(async move {
        while let Ok(msg) = rx.recv().await {
            match msg {
                Message::Update(update) => {
                    update_ui(&price_label_c, &time_label_c, &state_c, update.text, update.status_text, update.current_price);
                }
                Message::Tick => {
                    let mut s = state_c.lock().unwrap();
                    if s.countdown_seconds > 0 {
                        s.countdown_seconds -= 1;
                    } else {
                        s.countdown_seconds = REFRESH_INTERVAL;
                        // Trigger refresh
                        fetch_price(tx_for_refresh.clone());
                    }
                    let text = if !s.last_status_text.is_empty() {
                        format!("{} ({}s)", s.last_status_text, s.countdown_seconds)
                    } else {
                        format!("({}s)", s.countdown_seconds)
                    };
                    time_label_c.set_text(&text);
                }
            }
        }
    });

    // Initial fetch
    fetch_price(tx.clone());

    // Timer for ticks
    let tx_tick = tx.clone();
    glib::timeout_add_seconds(1, move || {
        let _ = tx_tick.send_blocking(Message::Tick);
        glib::ControlFlow::Continue
    });
}

fn fetch_price(tx: async_channel::Sender<Message>) {
    thread::spawn(move || {
        let result = attohttpc::get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
            .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
            .timeout(Duration::from_secs(10))
            .send();

        let (text, status_text, current_price) = match result {
            Ok(response) => {
                if response.is_success() {
                    match response.json::<CoinGeckoResponse>() {
                        Ok(data) => {
                            let price = data.ethereum.usd;
                            let now = chrono::Local::now();
                            let time_str = now.format("%H:%M:%S").to_string();
                            (None, format!("Actualizado: {}", time_str), Some(price))
                        }
                        Err(_) => (Some("Error JSON".to_string()), "Error en la respuesta".to_string(), None),
                    }
                } else {
                    (Some("Error API".to_string()), format!("HTTP {}", response.status()), None)
                }
            }
            Err(_) => (Some("Error".to_string()), "Sin conexión".to_string(), None),
        };

        let _ = tx.send_blocking(Message::Update(UpdateMessage { text, status_text, current_price }));
    });
}

fn update_ui(
    price_label: &gtk::Label,
    time_label: &gtk::Label,
    state: &Arc<Mutex<AppState>>,
    text: Option<String>,
    status_text: String,
    current_price: Option<f64>,
) {
    let mut s = state.lock().unwrap();
    s.last_status_text = status_text;
    
    let countdown_text = format!("{} ({}s)", s.last_status_text, s.countdown_seconds);
    time_label.set_text(&countdown_text);

    if let Some(price) = current_price {
        price_label.set_markup(&format_price_markup(price));
        update_price_color(price_label, &mut s, Some(price));
    } else if let Some(t) = text {
        let markup = format!("<span size='200%'>{}</span>", t);
        price_label.set_markup(&markup);
        update_price_color(price_label, &mut s, None);
    }
}

fn format_price_markup(price: f64) -> String {
    let s = format!("{:.2}", price);
    let parts: Vec<&str> = s.split('.').collect();
    
    let integer_part = parts[0];
    let decimal_part = parts[1];
    
    let mut result = String::new();
    let chars: Vec<char> = integer_part.chars().rev().collect();
    for (i, c) in chars.iter().enumerate() {
        if i > 0 && i % 3 == 0 {
            result.push('.');
        }
        result.push(*c);
    }
    let reversed: String = result.chars().rev().collect();
    
    format!("<span size='200%'>{}<span size='80%'>,{}</span> USDT</span>", reversed, decimal_part)
}

fn update_price_color(price_label: &gtk::Label, state: &mut AppState, current_price: Option<f64>) {
    let context = price_label.style_context();
    context.remove_class("price-green");
    context.remove_class("price-light-green");
    context.remove_class("price-red");
    context.remove_class("price-light-red");
    context.remove_class("price-neutral");

    match current_price {
        Some(price) => {
            if let Some(last) = state.last_price {
                if price > last {
                    context.add_class("price-green");
                    state.last_color_state = "green".to_string();
                } else if price < last {
                    context.add_class("price-red");
                    state.last_color_state = "red".to_string();
                } else {
                    if state.last_color_state == "green" {
                        context.add_class("price-light-green");
                    } else if state.last_color_state == "red" {
                        context.add_class("price-light-red");
                    } else {
                        context.add_class("price-neutral");
                    }
                }
            } else {
                context.add_class("price-neutral");
            }
            state.last_price = Some(price);
        }
        None => {
            context.add_class("price-neutral");
        }
    }
}
