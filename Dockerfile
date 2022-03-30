# build environment
FROM node:16.14.0-alpine3.15 AS build

WORKDIR /app

COPY . .
RUN npm ci
RUN npm run build

# production environment
FROM nginx:1.21.6-alpine

COPY --from=build /app/dist /var/www/html
COPY --from=build /app/nginx/templates /etc/nginx/templates
