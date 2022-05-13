# shogun-admin

## An UI for handling SHOGun entities like users, applications, and layers
### …easily extendable to manage your project entities, too.

# Docker

`shogun-admin` should be used in a Docker environment. The easiest way to do this is to use [shogun-docker](https://github.com/terrestris/shogun-docker) which includes the image.

# Development

Assuming the following directory structure

```
shogun-directory/
├── shogun-docker (https://github.com/terrestris/shogun-docker)
├── shogun-admin (this repository)
└── …
```

you can simply mount the `shogun-admin` into your docker-compose environment:

```yml
shogun-admin:
  build:
    context: ../shogun-admin
    dockerfile: Dockerfile.dev
  ports:
    - 9090:9090
  volumes:
    - ../shogun-admin:/app
```

# Semantic release
Allowed Tags for semantic release:

- Breaking changes: `breaking`
- Features: `feat`
- Bugfixes: `fix`,
- Package updates: `chore`
- Changes in configuration: `ci`, `config`
- `docs`, `refactor`, `test`, `norelease`
