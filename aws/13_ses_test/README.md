# Envío de Correo con AWS SES (con TLS)

Este script permite enviar un correo de prueba utilizando AWS SES y Python con una implementación robusta de seguridad TLS.

**Características:**
- Soporte automático para puerto **465** (TLS implícito) usando `smtplib.SMTP_SSL`.
- Soporte para puerto **587** (STARTTLS) usando `smtplib.SMTP` + `starttls`.
- Verificación de certificados SSL usando `ssl.create_default_context()`.

## Requisitos

- Python 3.x (recomendado > 3.10 para soporte SSL moderno).
- Credenciales de AWS SES SMTP (Servidor, Puerto, Usuario, Contraseña).

## Configuración

1.  Crea un entorno virtual con el python del sistema (asegura soporte SSL):
    ```bash
    /usr/bin/python3 -m venv venv
    source venv/bin/activate
    ```

2.  Instala las dependencias:
    ```bash
    pip install -r requirements.txt
    ```

3.  Configura tus credenciales en el archivo `.env`:
    ```env
    SMTP_SERVER=email-smtp.us-east-1.amazonaws.com
    SMTP_PORT=587  # Usa 587 para STARTTLS o 465 para TLS implícito
    SMTP_USERNAME=tu_usuario_smtp
    SMTP_PASSWORD=tu_contraseña_smtp
    SENDER_EMAIL=remitente@ejemplo.com
    RECIPIENT_EMAIL=destinatario@ejemplo.com
    ```

## Ejecución

Ejecuta el script usando el entorno virtual:
```bash
./venv/bin/python send_email.py
```
