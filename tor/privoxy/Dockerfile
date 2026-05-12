FROM debian:stable-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends privoxy && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

EXPOSE 8118

# Ejecutar privoxy en primer plano
CMD ["privoxy", "--no-daemon", "/etc/privoxy/config"]