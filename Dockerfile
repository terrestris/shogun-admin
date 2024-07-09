# build environment
FROM node:20.12.2-alpine3.19 AS build

WORKDIR /app

COPY . .
RUN npm ci
RUN npm run build

# production environment
FROM nginx:1.25.5-alpine-slim

COPY --from=build /app/dist /var/www/html
COPY --from=build /app/nginx/templates /etc/nginx/templates
