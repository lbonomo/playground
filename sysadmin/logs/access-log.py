from collections import Counter
import re

# Función para procesar logs y extraer información clave
def process_logs(file_path):
    logs = {
        "total_lines": 0,
        "http_statuses": Counter(),
        "resources": Counter(),
        "ips": Counter(),
        "timestamps": Counter(),
    }
    
    # Patrón regex para capturar componentes del log
    log_pattern = re.compile(
        r'(?P<ip>\S+) - - \[(?P<datetime>[^\]]+)\] "(?P<method>\S+) (?P<resource>\S+) \S+" (?P<status>\d+)'
    )
    
    with open(file_path, 'r') as file:
        for line in file:
            logs["total_lines"] += 1
            match = log_pattern.search(line)
            if match:
                data = match.groupdict()
                logs["http_statuses"][data["status"]] += 1
                logs["resources"][data["resource"]] += 1
                logs["ips"][data["ip"]] += 1
                timestamp = data["datetime"].split(':')[0]  # Extraer solo la fecha
                logs["timestamps"][timestamp] += 1
                
    return logs

# Procesar ambos archivos
logs_file1 = process_logs(file1_path)
logs_file2 = process_logs(file2_path)

logs_file1, logs_file2

