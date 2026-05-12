FROM debian:stable-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends tor && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Exponemos el puerto SOCKS
EXPOSE 9050

CMD ["tor", "-f", "/etc/tor/torrc"]