use default_net::get_default_gateway;
use pnet::datalink;
use serde::Serialize;
use std::fs;
use sys_info;
use warp::Filter;

#[tokio::main]
async fn main() {
    // Ruta principal
    let hello = warp::path::end()
        .map(|| "Hola, mundo!");

    // Ruta /systeminfo
    let systeminfo = warp::path("systeminfo")
        .map(|| {
            let os = sys_info::os_type().unwrap_or_else(|_| "Unknown".to_string());
            let release = sys_info::os_release().unwrap_or_else(|_| "Unknown".to_string());
            let hostname = sys_info::hostname().unwrap_or_else(|_| "Unknown".to_string());
            let cpu_num = sys_info::cpu_num().unwrap_or(0);
            let mem = sys_info::mem_info().map(|m| m.total).unwrap_or(0);
            let loadavg = sys_info::loadavg()
                .map(|l| format!("{:.2} {:.2} {:.2}", l.one, l.five, l.fifteen))
                .unwrap_or_else(|_| "Unknown".to_string());
            let proc_total = sys_info::proc_total().unwrap_or(0);

            // Convertir memoria y disco a GB
            let mem_gb = mem as f64 / 1_048_576.0;
            let disk = sys_info::disk_info().ok();
            let disk_total_gb = disk.as_ref().map(|d| d.total as f64 / 1_048_576.0).unwrap_or(0.0);
            let disk_free_gb = disk.as_ref().map(|d| d.free as f64 / 1_048_576.0).unwrap_or(0.0);
            let cpu_speed = sys_info::cpu_speed().unwrap_or(0);

            // Obtener IPs y MACs
            let mut ips = Vec::new();
            let mut macs = Vec::new();
            for iface in datalink::interfaces() {
                // MAC
                if let Some(mac) = iface.mac {
                    macs.push(mac.to_string());
                }
                // IPs
                for ip in iface.ips {
                    ips.push(ip.ip().to_string());
                }
            }

            // Gateway por defecto (IPv4)
            let gateway = get_default_gateway()
                .ok()
                .map(|gw| gw.ip_addr.to_string())
                .unwrap_or_else(|| "Unknown".to_string());

            // Servidores DNS (solo Linux, leyendo /etc/resolv.conf)
            let mut dns_servers = Vec::new();
            if let Ok(resolv) = fs::read_to_string("/etc/resolv.conf") {
                for line in resolv.lines() {
                    if let Some(addr) = line.strip_prefix("nameserver ") {
                        dns_servers.push(addr.trim().to_string());
                    }
                }
            }

            // Formatear información
            let disk_total_gb = format!("{:.2}", disk_total_gb);
            let disk_free_gb = format!("{:.2}", disk_free_gb);
            let disk_info = format!("{} GB (total), {} GB (free)", disk_total_gb, disk_free_gb);
            let mem_gb = format!("{:.2}", mem_gb);
            let mem = format!("{} GB", mem_gb);

            #[derive(Serialize)]
            struct SystemInfo {
                os: String,
                release: String,
                hostname: String,
                cpus: u32,
                total_memory_gb: String,
                load_avg: String,
                total_processes: u32,
                disk: String,
                cpu_speed_mhz: u64,
                ips: Vec<String>,
                macs: Vec<String>,
                gateway: String,
                dns_servers: Vec<String>,
            }

            let info = SystemInfo {
                os,
                release,
                hostname,
                cpus: cpu_num as u32,
                total_memory_gb: mem,
                load_avg: loadavg,
                total_processes: proc_total as u32,
                disk: disk_info,
                cpu_speed_mhz: cpu_speed as u64,
                ips,
                macs,
                gateway,
                dns_servers,
            };

            warp::reply::with_header(warp::reply::json(&info), "content-type", "application/json")
        });

    let routes = hello.or(systeminfo);

    // Ejecuta el servidor en 0.0.0.0:5555
    warp::serve(routes)
        .run(([0, 0, 0, 0], 5555))
        .await;
}