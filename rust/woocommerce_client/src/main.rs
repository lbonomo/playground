use clap::Parser;
use clap::CommandFactory;
use config;
use dirs::home_dir;

mod integrations;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Acción a ejecutar: getOrders, getProducts, etc.
    #[arg(long)]
    action: Option<String>,

    #[arg(long)]
    sku: Option<String>,
}

fn load_config() -> config::Config {
    let mut config_path = home_dir().expect("No se pudo encontrar el directorio home");
    config_path.push(".config/wctools/config.ini");
    config::Config::builder()
        .add_source(config::File::with_name(config_path.to_str().unwrap()))
        .build()
        .expect("No se pudo cargar el archivo de configuración")
}

fn main() {
    let _config = load_config();
    let args = Args::parse();

    match args.action.as_deref() {
        Some("getOrders") => {
            integrations::woocommerce::get_orders(&_config);
        }
        Some("getProducts") => {
            integrations::woocommerce::get_products(&_config);
        }
        Some("getProductBySKU") => {
            let sku = args.sku.as_deref().expect("Debe proporcionar --sku <valor>");
            integrations::woocommerce::get_product(&_config, None, Some(sku));
        }
        Some("exportProducts") => {
            integrations::woocommerce::export_products(&_config);
        }
        _ => {
            Args::command().print_help().unwrap();
            std::process::exit(1);
        }
    }
}