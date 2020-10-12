# shogun-admin

## A UI for handling SHOGun entities like users, applications, and layers
### …easy extendable to manage your project entities, too.

# Keylcoak-Setup

# Setup

Requirements:
- A runnning shogun instance
- Keycloak-Preparation
  - The user you use to login need the role 'admin'
  - The Path of the `shogun-admin` needs to be added to `Valid Redirect URIs` and `Web Origins`

To Start the admin run:
```
npm i && npm start
```

The `shogun-admin` expects shogun itself to serve a `client-config.js` file which configures the admin client. If this file is not found the `fallbackConfig.js` from the assets folder is loaded. You can use this as a starting point for your own `client-config.js`
