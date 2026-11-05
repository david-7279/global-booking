ARG NGINX_VERSION=1.27-alpine

FROM nginxinc/nginx-unprivileged:${NGINX_VERSION}

COPY nginx/proxy.conf /etc/nginx/snippets/proxy.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/health || exit 1
