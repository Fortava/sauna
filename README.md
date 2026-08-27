# Ember West

A fast, dependency-light storefront for a Western Australian wool sauna-hat business. Static assets are hosted on Cloudflare Workers; checkout is designed to hand off to Square Payment Links.

## Customise before launch

1. Update the placeholder brand, email, product names, copy and prices in `public/index.html`.
2. Create a Square Payment Link for each product.
3. Paste those URLs into `CHECKOUT_LINKS` at the top of `public/app.js`.
4. Connect the newsletter form to your email platform; it currently shows a local success message only.
5. Replace generated concept photography with final product photography when available.

## Run and deploy

```sh
npm install
npm run dev
npm run deploy:check
npm run deploy
```

The first live deploy may ask you to authenticate with Cloudflare. Once deployed, add a custom domain in Workers & Pages → your Worker → Settings → Domains & Routes.
