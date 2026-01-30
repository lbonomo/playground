FROM node:20-slim

ENV NODE_ENV=production

# Paquetes mínimos para compilar dependencias de n8n
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Instalar n8n global sin Chromium ni extras
RUN npm install -g n8n --omit=optional

# Limpiar build tools para reducir tamaño final
RUN apt-get purge -y build-essential && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

# Variables recomendadas
ENV N8N_DISABLE_UI=true \
    N8N_TEMPLATES_ENABLED=false \
    N8N_COMMUNITY_NODES_DISABLED=true \
    N8N_DIAGNOSTICS_ENABLED=false \
    N8N_HIRING_BANNER_ENABLED=false \
    N8N_PERSONALIZATION_ENABLED=false

CMD ["n8n"]
