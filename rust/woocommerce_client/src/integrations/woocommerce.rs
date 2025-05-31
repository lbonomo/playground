use reqwest::blocking::Client;
use config::Config;

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

