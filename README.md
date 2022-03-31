# shogun-admin

## A UI for handling SHOGun entities like users, applications, and layers
### …easily extendable to manage your project entities, too.

# Docker

`shogun-admin` should be used in a Docker environment. The easiest way to do this is to use [shogun-docker](https://github.com/terrestris/shogun-docker) which includes the image.

# Development

The webpack dev server is configured to generate output into `dist_dev`.

So to work on the `shogun-admin` you can mount this folder into your docker-compose environment:

```yml
  shogun-admin:
    image: nexus.terrestris.de/repository/terrestris-public/shogun-admin:latest
    ports:
      - 8005:80
    volumes:
      - ../../shogun-admin/dist_dev:/var/www/html
```
> ⚠️ Currently the dev server will spam your console with websocket warnings as hot reloading is not
properly configured for the docker scenario.
