# Ruta del archivo subido
file_path = '/var/log/auth.log'

# Leer el contenido del archivo
with open(file_path, 'r') as file:
    auth_log = file.readlines()

# Resumen inicial: contadores de eventos relevantes
summary = {
    'successful_logins': 0,
    'failed_logins': 0,
    'brute_force_attempts': 0,
    'other_events': 0,
    'unique_ips_failed': set(),
    'unique_ips_successful': set(),
}

# Procesar el archivo línea por línea
failed_keywords = ["Failed password", "Invalid user"]
successful_keywords = ["Accepted password", "Accepted publickey"]
brute_force_indicator = "POSSIBLE BREAK-IN ATTEMPT"

for line in auth_log:
    # Detectar inicios de sesión fallidos
    if any(keyword in line for keyword in failed_keywords):
        summary['failed_logins'] += 1
        # Extraer IP
        ip = line.split()[-4] if "from" in line else None
        if ip:
            summary['unique_ips_failed'].add(ip)

    # Detectar inicios de sesión exitosos
    elif any(keyword in line for keyword in successful_keywords):
        summary['successful_logins'] += 1
        # Extraer IP
        ip = line.split()[-4] if "from" in line else None
        if ip:
            summary['unique_ips_successful'].add(ip)

    # Detectar posibles intentos de fuerza bruta
    elif brute_force_indicator in line:
        summary['brute_force_attempts'] += 1

    # Contar otros eventos
    else:
        summary['other_events'] += 1

# Finalizar el resumen
summary['unique_ips_failed'] = len(summary['unique_ips_failed'])
summary['unique_ips_successful'] = len(summary['unique_ips_successful'])
summary

