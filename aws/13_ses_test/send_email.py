import os
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Cargar variables de entorno desde el archivo .env
load_dotenv()

# Obtener configuración desde variables de entorno
SMTP_SERVER = os.getenv("SMTP_SERVER")
try:
    SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
except ValueError:
    SMTP_PORT = 587

SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
RECIPIENT_EMAIL = os.getenv("RECIPIENT_EMAIL")

def send_test_email():
    if not all([SMTP_SERVER, SMTP_USERNAME, SMTP_PASSWORD, SENDER_EMAIL, RECIPIENT_EMAIL]):
        print("Error: Faltan variables de configuración en el archivo .env")
        return

    # Crear el mensaje
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = RECIPIENT_EMAIL
    msg['Subject'] = "Correo de prueba desde AWS SES (TLS)"

    body = "Este es un correo de prueba enviado usando Python y AWS SES SMTP con configuración TLS segura."
    msg.attach(MIMEText(body, 'plain'))

    # Crear contexto SSL seguro por defecto (verifica certificados, hostname, etc.)
    context = ssl.create_default_context()

    try:
        print(f"Conectando a {SMTP_SERVER}:{SMTP_PORT}...")
        
        # Selección inteligente de método de conexión según el puerto
        if SMTP_PORT == 465:
            # Puerto 465 usa SSL/TLS implícito desde el inicio
            with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, msg.as_string())
        else:
            # Puerto 587 (u otros) usa conexión normal + STARTTLS
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                # Opcional: imprimir logs de depuración del servidor
                # server.set_debuglevel(1)
                
                server.ehlo() # Identificarse ante el servidor
                if server.has_extn('STARTTLS'):
                    print("Iniciando STARTTLS...")
                    server.starttls(context=context) # Actualizar a conexión segura
                    server.ehlo() # Re-identificarse tras cifrar la conexión
                
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, msg.as_string())
        
        print(f"Correo enviado exitosamente a {RECIPIENT_EMAIL}")
        
    except Exception as e:
        print(f"Error al enviar el correo: {e}")

if __name__ == "__main__":
    send_test_email()
