 - We need `gcloud` (Google Cloud CLI) 
   https://cloud.google.com/sdk/docs/install?hl=es-419
   ```
   curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-454.0.0-linux-x86_64.tar.gz
   tar -xf google-cloud-cli-454.0.0-linux-x86_64.tar.gz
   ./google-cloud-sdk/install.sh
   ```
- `gcloud auth application-default login` > esto genera el archivo `~/.config/gcloud/application_default_credentials.json`
- Habilitar las API
  - Network Management API 
  - Compute Engine API