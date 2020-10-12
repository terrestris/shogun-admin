# shogun-admin

## A UI for handling SHOGun entities like users, applications, and layers
### …easily extendable to manage your project entities, too.

# Keycloak-Setup

# Setup

Requirements:

- A runnning shogun instance
- Keycloak-Preparation
  - The user you use to login needs the role `admin`
  - The path of the `shogun-admin` needs to be added to `Valid Redirect URIs` and `Web Origins`

To start the admin run:

```bash
npm i && npm start
```

The `shogun-admin` expects shogun itself to serve a `client-config.js` file which configures the admin client. If this file is not found, the `fallbackConfig.js` from the assets folder is loaded. You can use this as a starting point for your own `client-config.js`.
