# shogun-admin

## A UI for handling SHOGun entities like users, applications, and layers
### …easily extendable to manage your project entities, too.

# Keycloak-Setup

# Setup

Requirements:

- A runnning shogun instance with nginx proxy setup like seen in the shogun-docker repository
- Keycloak-Preparation
  - The user you use to login needs the role `admin`
  - The path of the `shogun-admin` (e.g. `https://localhost:9090/*` needs to be added to `Valid Redirect URIs` and `Web Origins` in keycloak via `clients` -> `shogun-app`
- Configure the credentials on top of the file `webpack.de.config.js`

To start the admin run:

```bash
npm i && npm start
```

The app will be available via https://localhost:9090/admin/

The `shogun-admin` expects shogun itself to serve a `client-config.js` file which configures the admin client. If this file is not found, the `fallbackConfig.js` from the assets folder is loaded. You can use this as a starting point for your own `client-config.js`.
