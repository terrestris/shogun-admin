# build environment
FROM node:26-alpine@sha256:c6ad9e9c1d80f6eb607c26b4b0a132ff7a2344fad1c78ea3baa2a7d4c8de6d94 AS build

RUN apk update && apk upgrade --no-cache

WORKDIR /app

COPY . .
RUN npm ci
RUN npm run build

# production environment
FROM ghcr.io/nginx/nginx-unprivileged:1.31-alpine-perl@sha256:51ff7c6bf702b9909ec57d394bdec39c515b57555d4960cf443c8213afbef596 AS app
ENV SHOGUN_ADMIN_HOST=shogun-admin

ARG GIT_COMMIT
ARG APP_VERSION

COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx/templates /etc/nginx/templates

# Metadata according to OCI Image Spec
LABEL org.opencontainers.image.authors="info@terrestris.de"
LABEL org.opencontainers.image.created="$(date -u +%Y-%m-%dT%H:%M:%S%z)"
LABEL org.opencontainers.image.source="https://github.com/terrestris/shogun-admin"
LABEL org.opencontainers.image.title="The SHOGun WebGIS Admin web application"
LABEL org.opencontainers.image.description="Docker image for SHOGun Ammin"
LABEL org.opencontainers.image.url=hub.terrestris.de/shogun/shogun-admin
LABEL org.opencontainers.image.vendor="terrestris GmbH & Co. KG"
LABEL org.opencontainers.image.licenses="Apache License"
LABEL org.opencontainers.image.revision=$GIT_COMMIT
LABEL org.opencontainers.image.version=$APP_VERSION

HEALTHCHECK --timeout=5s --start-period=5s --retries=3 CMD curl -f http://localhost:8080/health || exit 1
