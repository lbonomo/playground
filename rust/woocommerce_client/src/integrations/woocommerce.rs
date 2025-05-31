use reqwest::blocking::Client;
use config::Config;
use xlsxwriter::*;
use chrono::Local;
use url::Url;
use serde::Deserialize;
use std::fs;
use dirs::home_dir;

#[derive(Deserialize)]
struct Product {
    name: String,
    sku: Option<String>,
    permalink: Option<String>,
    price: Option<String>,
    images: Option<Vec<ProductImage>>,
    description: Option<String>,
}

#[derive(Deserialize)]
struct ProductImage {
    src: String,
    // puedes agregar otros campos si los necesitas
}

pub fn get_orders(config: &Config) {
    let url = config.get_string("WOOCOMMERCE_URL").expect("Falta WOOCOMMERCE_URL");
    let ck = config.get_string("WOOCOMMERCE_CONSUMER_KEY").expect("Falta WOOCOMMERCE_CONSUMER_KEY");
    let cs = config.get_string("WOOCOMMERCE_CONSUMER_SECRET").expect("Falta WOOCOMMERCE_CONSUMER_SECRET");

    let client = Client::new();
    let endpoint = format!("{}/wp-json/wc/v3/orders", url);

    let res = client
        .get(&endpoint)
        .basic_auth(ck, Some(cs))
        .send();

    match res {
        Ok(r) => {
            let body = r.text().unwrap();
            println!("{}", body);
        }
        Err(e) => {
            eprintln!("Error al obtener órdenes: {}", e);
        }
    }
}

pub fn get_products(config: &Config) {
    let url = config.get_string("WOOCOMMERCE_URL").expect("Falta WOOCOMMERCE_URL");
    let ck = config.get_string("WOOCOMMERCE_CONSUMER_KEY").expect("Falta WOOCOMMERCE_CONSUMER_KEY");
    let cs = config.get_string("WOOCOMMERCE_CONSUMER_SECRET").expect("Falta WOOCOMMERCE_CONSUMER_SECRET");

    let client = Client::new();
    let endpoint = format!("{}/wp-json/wc/v3/products", url);

    let res = client
        .get(&endpoint)
        .basic_auth(ck, Some(cs))
        .send();

    match res {
        Ok(r) => {
            let body = r.text().unwrap();
            println!("{}", body);
        }
        Err(e) => {
            eprintln!("Error al obtener productos: {}", e);
        }
    }
}

pub fn get_product(config: &Config, id: Option<u64>, sku: Option<&str>) {
    let url = config.get_string("WOOCOMMERCE_URL").expect("Falta WOOCOMMERCE_URL");
    let ck = config.get_string("WOOCOMMERCE_CONSUMER_KEY").expect("Falta WOOCOMMERCE_CONSUMER_KEY");
    let cs = config.get_string("WOOCOMMERCE_CONSUMER_SECRET").expect("Falta WOOCOMMERCE_CONSUMER_SECRET");

    let client = Client::new();
    let endpoint = if let Some(id) = id {
        format!("{}/wp-json/wc/v3/products/{}", url, id)
    } else if let Some(sku) = sku {
        format!("{}/wp-json/wc/v3/products?sku={}", url, sku)
    } else {
        eprintln!("Debe proporcionar un ID o SKU");
        return;
    };

    let res = client
        .get(&endpoint)
        .basic_auth(ck, Some(cs))
        .send();

    match res {
        Ok(r) => {
            let body = r.text().unwrap();
            println!("{}", body);
        }
        Err(e) => {
            eprintln!("Error al obtener producto: {}", e);
        }
    }
}

pub fn export_products(config: &Config) {
    let url = config.get_string("WOOCOMMERCE_URL").expect("Falta WOOCOMMERCE_URL");
    let ck = config.get_string("WOOCOMMERCE_CONSUMER_KEY").expect("Falta WOOCOMMERCE_CONSUMER_KEY");
    let cs = config.get_string("WOOCOMMERCE_CONSUMER_SECRET").expect("Falta WOOCOMMERCE_CONSUMER_SECRET");

    let client = reqwest::blocking::Client::new();
    let endpoint = format!("{}/wp-json/wc/v3/products?per_page=100", url);

    let res = client
        .get(&endpoint)
        .basic_auth(ck, Some(cs))
        .send();

    let products: Vec<Product> = match res {
        Ok(r) => r.json().unwrap_or_else(|_| {
            eprintln!("No se pudo parsear la respuesta de productos");
            vec![]
        }),
        Err(e) => {
            eprintln!("Error al obtener productos: {}", e);
            return;
        }
    };

    // Obtener fecha y dominio
    let fecha = Local::now().format("%Y-%m-%d").to_string();
    let dominio = Url::parse(&url)
        .ok()
        .and_then(|u| u.host_str().map(|h| h.to_string()))
        .unwrap_or_else(|| "dominio".to_string());
    let filename = format!("{}_{}_products.xlsx", fecha, dominio);

    let workbook = Workbook::new(&filename).expect("Failed to create workbook");
    let mut sheet = workbook.add_worksheet(None).unwrap();

    // Escribir encabezados
    sheet.write_string(0, 1, "Nombre", None).unwrap();
    sheet.write_string(0, 2, "SKU", None).unwrap();
    sheet.write_string(0, 3, "Precio", None).unwrap();
    sheet.write_string(0, 4, "Enlace", None).unwrap();
    sheet.write_string(0, 5, "Imagen", None).unwrap();

    let mut currency_format = Format::new();
    currency_format.set_num_format("$#,##0.00");

    // Escribir productos
    for (i, p) in products.iter().enumerate() {
        sheet.write_string((i + 1) as u32, 1, &p.name, None).unwrap();
        sheet.write_string((i + 1) as u32, 2, p.sku.as_deref().unwrap_or(""), None).unwrap();
        let url = p.permalink.as_deref().unwrap_or("");
        sheet.write_url((i + 1) as u32, 4, url, None).unwrap();
        let price = p.price.as_deref().unwrap_or("0").parse::<f64>().unwrap_or(0.0);
        sheet.write_number((i + 1) as u32, 3, price, Some(&currency_format)).unwrap();

        // Imagen principal
        let img_url = p.images.as_ref()
            .and_then(|imgs| imgs.get(0))
            .map(|img| img.src.as_str())
            .unwrap_or("");
        sheet.write_string((i + 1) as u32, 5, img_url, None).unwrap();
    }

    workbook.close().unwrap();
    println!("Archivo exportado: {}", filename);
}

pub fn export_products_html(config: &Config) {
    let url = config.get_string("WOOCOMMERCE_URL").expect("Falta WOOCOMMERCE_URL");
    let ck = config.get_string("WOOCOMMERCE_CONSUMER_KEY").expect("Falta WOOCOMMERCE_CONSUMER_KEY");
    let cs = config.get_string("WOOCOMMERCE_CONSUMER_SECRET").expect("Falta WOOCOMMERCE_CONSUMER_SECRET");

    let client = reqwest::blocking::Client::new();
    let endpoint = format!("{}/wp-json/wc/v3/products?per_page=100", url);

    let res = client
        .get(&endpoint)
        .basic_auth(ck, Some(cs))
        .send();

    let products: Vec<Product> = match res {
        Ok(r) => r.json().unwrap_or_else(|_| {
            eprintln!("No se pudo parsear la respuesta de productos");
            vec![]
        }),
        Err(e) => {
            eprintln!("Error al obtener productos: {}", e);
            return;
        }
    };

    let fecha = chrono::Local::now().format("%Y-%m-%d").to_string();
    let dominio = url::Url::parse(&url)
        .ok()
        .and_then(|u| u.host_str().map(|h| h.to_string()))
        .unwrap_or_else(|| "dominio".to_string());
    let filename = format!("{}_{}_products.html", fecha, dominio);

    // Lee el template
    let mut template_path = home_dir().expect("No se pudo encontrar el directorio home");
    template_path.push(".config/wctools/templates/products.html");

    let template = fs::read_to_string(&template_path)
        .expect("No se pudo leer el template HTML");

    // Genera el HTML de las cards
    let mut cards = String::new();
    for p in &products {
        let name = &p.name;
        let link = p.permalink.as_deref().unwrap_or("#");
        let img_url = p.images.as_ref()
            .and_then(|imgs| imgs.get(0))
            .map(|img| img.src.as_str())
            .unwrap_or("");
        let sku = p.sku.as_deref().unwrap_or("");
        let price = p.price.as_deref().unwrap_or("0").to_string();
        let description = p.description.as_deref().unwrap_or("");
        cards.push_str(&format!(
            r#"<div class="card">
    <a href="{link}" target="_blank">
        <img src="{img_url}" alt="{name}">
    </a>
    <div class="card-content">
        <a href="{link}" target="_blank">{name}</a>
        <span class="sku">SKU: {sku}</span>
        <span class="price">Precio: ${price}</span>
        <div class="description">{description}</div>
    </div>
</div>"#,
            link = link,
            name = name,
            img_url = img_url,
            sku = sku,
            price = price,
            description = description
        ));
    }

    // Inserta las cards en el template
    let html = template.replace("{{cards}}", &cards);

    fs::write(&filename, html).expect("No se pudo escribir el archivo HTML");
    println!("Archivo exportado: {}", filename);
}

