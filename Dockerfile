# build environment
FROM node:23.3.0-alpine3.19 AS build

WORKDIR /app

COPY . .
RUN npm ci
RUN npm run build

# production environment
FROM nginx:1.27.1-alpine-slim

COPY --from=build /app/dist /var/www/html
COPY --from=build /app/nginx/templates /etc/nginx/templates
