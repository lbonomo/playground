use reqwest::blocking::Client;
use config::Config;
use xlsxwriter::*;
use chrono::Local;
use url::Url;
use serde::Deserialize;

#[derive(Deserialize)]
struct Product {
    id: u64,
    name: String,
    sku: Option<String>,
    price: Option<String>,
    // agrega más campos si lo necesitas
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
    sheet.write_string(0, 0, "ID", None).unwrap();
    sheet.write_string(0, 1, "Nombre", None).unwrap();
    sheet.write_string(0, 2, "SKU", None).unwrap();
    sheet.write_string(0, 3, "Precio", None).unwrap();

    // Escribir productos
    for (i, p) in products.iter().enumerate() {
        sheet.write_number((i + 1) as u32, 0, p.id as f64, None).unwrap();
        sheet.write_string((i + 1) as u32, 1, &p.name, None).unwrap();
        sheet.write_string((i + 1) as u32, 2, p.sku.as_deref().unwrap_or(""), None).unwrap();
        sheet.write_string((i + 1) as u32, 3, p.price.as_deref().unwrap_or(""), None).unwrap();
    }

    workbook.close().unwrap();
    println!("Archivo exportado: {}", filename);
}

