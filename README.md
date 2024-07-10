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

You can simply mount the `shogun-admin` into your docker-compose environment.

```yml
shogun-admin:
  build:
    context: ../shogun-admin
    dockerfile: Dockerfile.dev
  volumes:
    - ../shogun-admin:/app
```

# Semantic release

Allowed Tags for semantic release (see the [FAQs](https://github.com/semantic-release/semantic-release/blob/master/docs/support/FAQ.md) for more information about this):

- Breaking changes: `breaking`
- Features: `feat`
- Bugfixes: `fix`,
- Package updates: `chore`
- Style: `style`
- Changes in configuration: `ci`, `config`
- `docs`, `refactor`, `test`, `norelease`
