# build environment
FROM node:23.3.0-alpine3.19 AS build

RUN apk update && apk upgrade --no-cache

WORKDIR /app

COPY . .
RUN npm ci
RUN npm run build

# production environment
FROM nginx:1.29.1-alpine-slim

RUN apk update && apk upgrade --no-cache

COPY --from=build /app/dist /var/www/html
COPY --from=build /app/nginx/templates /etc/nginx/templates
