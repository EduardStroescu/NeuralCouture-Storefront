# NeuralCouture Store

# Introduction

Headless Shopify store using the _Shopify Storefront Api_ as backend and _React-Three-Fiber_ on the frontend.

## Overview

The aim of this project is to create a fully functional and interactive shopping experience with the possibility of updating products/content on the fly using Shopify's backend.

React-Three-Fiber was used as a background to display collections and products in the form of a carousel, while the product details and the rest of the pages are using classical web interfaces.

The choice to use a carousel instead of a grid for the products and collections came due to the usage of threejs, as a simple grid would defeat the purpose of adding a 3D environment.

The usage of 3D was also determined by the client I've build the website for. Although, the implications of performance, SEO and accessibility were made clear from the start. The accessibility downsides could be solved by using [react-three-a11y](https://github.com/pmndrs/react-three-a11y) from pmndrs, but I have yet to experiment with the library, SEO is partly managed by Shopify, and the 3D resources have been compressed and optimized as per possibility.

The store won't be officially up until the customer finishes all the legal procedures and other managerial issues.

## Technologies Used

- [Remix/React](https://github.com/remix-run/remix)
- [Hydrogen](https://github.com/Shopify/hydrogen)
- [Shopify CLI](https://github.com/Shopify/cli)
- [Tailwind](https://tailwindcss.com/)
- [threeJS](https://github.com/mrdoob/three.js)
- [react-three/fiber](https://github.com/pmndrs/react-three-fiber)
- [react-three/drei](https://github.com/pmndrs/drei)
- [react-three/postprocessing](https://github.com/pmndrs/react-postprocessing)
- [react-spring/web](https://github.com/pmndrs/react-spring)
- [react-router-dom](https://github.com/remix-run/react-router)
- [studio-freight/lenis](https://github.com/studio-freight/lenis)
- [emailjs/browser](https://github.com/emailjs-com/emailjs-sdk)
- [formik](https://github.com/jaredpalmer/formik)
- [yup](https://github.com/jquense/yup)
- [clsx](https://github.com/lukeed/clsx)
- [react-intersection-observer](https://github.com/thebuilder/react-intersection-observer)
- [tiny-invariant](https://github.com/alexreardon/tiny-invariant)

```
Remember to update `.env` with your shop's domain, Storefront API's and EmailJS's tokens!

Example:

        _Provided by Shopify_

SESSION_SECRET=""
PUBLIC_STOREFRONT_API_TOKEN=""
PUBLIC_STORE_DOMAIN=""

        _Provided by EmailJS_

PUBLIC_EMAILJS_SERVICE_ID=""
PUBLIC_EMAILJS_TEMPLATE_ID=""
PUBLIC_EMAILJS_PUBLIC_KEY=""
```

## Local development

```bash
git clone https://github.com/EduardStroescu/R3F-ES-Portfolio.git
npm install
npm run dev
```

## Building for production

```bash
npm run build
```

## Troubleshooting Note:

In case of console errors regarding analytics or switching to client side rendering, I've researched the Shopify reported issues and it's coming from their side. At the time of writing it has not been fixed and can be also observed on their [Hydrogen Demo Store](https://hydrogen.shop/). To bypass the issue please disable all adBlockers.
