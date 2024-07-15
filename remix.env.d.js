const {HydrogenCart} = require('@shopify/hydrogen');
const {Storefront} = require('~/lib/type');
const {HydrogenSession} = require('~/lib/session.server');

/**
 * A global `process` object is only available during build to access NODE_ENV.
 */
const process = {env: {NODE_ENV: 'production'}};

/**
 * Declare expected Env parameter in fetch handler.
 */
const env = {
  SESSION_SECRET: '',
  PUBLIC_STOREFRONT_API_TOKEN: '',
  PRIVATE_STOREFRONT_API_TOKEN: '',
  PUBLIC_STORE_DOMAIN: '',
  PUBLIC_STOREFRONT_ID: '',
  PUBLIC_EMAILJS_SERVICE_ID: '',
  PUBLIC_EMAILJS_TEMPLATE_ID: '',
  PUBLIC_EMAILJS_PUBLIC_KEY: '',
};

/**
 * Declare local additions to `AppLoadContext` to include the session utilities we injected in `server.js`.
 */
const AppLoadContext = {
  waitUntil: ExecutionContext.waitUntil,
  session: HydrogenSession,
  storefront: Storefront,
  cart: HydrogenCart,
  env: env,
};
