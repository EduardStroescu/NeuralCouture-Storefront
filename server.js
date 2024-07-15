// Virtual entry point for the app
const remixBuild = require('@remix-run/dev/server-build');
const {createRequestHandler} = require('@remix-run/server-runtime');
const {
  cartGetIdDefault,
  cartSetIdDefault,
  createCartHandler,
  createStorefrontClient,
  storefrontRedirect,
} = require('@shopify/hydrogen');

const {HydrogenSession} = require('~/lib/session.server');
const {getLocaleFromRequest} = require('~/lib/utils');

/**
 * Export a fetch handler in module format.
 */
module.exports = async function (request) {
  try {
    /**
     * This has to be done so messy because process.env can't be destructured
     * and only variables explicitly named are present inside a Vercel Edge Function.
     * See https://github.com/vercel/next.js/pull/31237/files
     */
    const env = {
      SESSION_SECRET: '',
      PUBLIC_STOREFRONT_API_TOKEN: '',
      PRIVATE_STOREFRONT_API_TOKEN: '',
      PUBLIC_STORE_DOMAIN: '',
      PUBLIC_EMAILJS_SERVICE_ID: '',
      PUBLIC_EMAILJS_TEMPLATE_ID: '',
      PUBLIC_EMAILJS_PUBLIC_KEY: '',
    };
    env.SESSION_SECRET = process.env.SESSION_SECRET;
    env.PUBLIC_STOREFRONT_API_TOKEN = process.env.PUBLIC_STOREFRONT_API_TOKEN;
    env.PRIVATE_STOREFRONT_API_TOKEN = process.env.PRIVATE_STOREFRONT_API_TOKEN;
    env.PUBLIC_STORE_DOMAIN = process.env.PUBLIC_STORE_DOMAIN;
    env.PUBLIC_EMAILJS_SERVICE_ID = process.env.PUBLIC_EMAILJS_SERVICE_ID;
    env.PUBLIC_EMAILJS_TEMPLATE_ID = process.env.PUBLIC_EMAILJS_TEMPLATE_ID;
    env.PUBLIC_EMAILJS_PUBLIC_KEY = process.env.PUBLIC_EMAILJS_PUBLIC_KEY;

    /**
     * Open a cache instance in the worker and a custom session instance.
     */
    if (!env.SESSION_SECRET) {
      throw new Error('SESSION_SECRET process.environment variable is not set');
    }

    const [session] = await Promise.all([
      HydrogenSession.init(request, [process.env.SESSION_SECRET]),
    ]);

    /**
     * Create Hydrogen's Storefront client.
     */
    const {storefront} = createStorefrontClient({
      buyerIp: request.headers.get('x-forwarded-for') || undefined,
      i18n: getLocaleFromRequest(request),
      publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
      storeDomain: env.PUBLIC_STORE_DOMAIN,
      storefrontId: process.env.PUBLIC_STOREFRONT_ID,
      requestGroupId: request.headers.get('request-id'),
    });

    const cart = createCartHandler({
      storefront,
      getCartId: cartGetIdDefault(request.headers),
      setCartId: cartSetIdDefault(),
    });

    const handleRequest = createRequestHandler(remixBuild, 'production');

    const response = await handleRequest(request, {
      session,
      storefront,
      cart,
      env,
      waitUntil: () => Promise.resolve(),
    });

    if (response.status === 404) {
      /**
       * Check for redirects only when there's a 404 from the app.
       * If the redirect doesn't exist, then `storefrontRedirect`
       * will pass through the 404 response.
       */
      return storefrontRedirect({request, response, storefront});
    }

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return new Response('An unexpected error occurred', {status: 500});
  }
};
