FROM tiangolo/nginx-rtmp

RUN apt-get update && \
    apt-get install -y ffmpeg jq gettext && \
    rm -rf /var/lib/apt/lists/*

# COPY nginx.conf /etc/nginx/nginx.conf
COPY entrypoint.sh /etc/nginx/entrypoint.sh
COPY scripts /etc/nginx/scripts
COPY www /var/www