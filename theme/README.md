# BÖRN Shopify theme

Custom Online Store 2.0 theme for [bornsauna.com.au](https://bornsauna.com.au).

**Design:** the refined laptop storefront layout (cream / ember / split hero).  
**Content:** Wayne’s live Shopify copy, product photos, variants/pricing, and Sauna Guides blog.  
**Not included:** shirtless model photography from the local static prototype.

## What Wayne edits in Shopify Admin

| What | Where |
| --- | --- |
| Price, colours, stock | **Products → Premium Wool Sauna Hat** |
| Homepage copy & images | **Online Store → Themes → Customize** |
| Announcement / header / footer | Theme editor → matching sections |
| Blog posts | **Online Store → Blog posts** (Sauna Guides / `info`) |
| SEO titles & descriptions | Product / page / blog “Search engine listing” panels |
| Brand colours, email, Instagram | Theme settings (left sidebar in Customize) |

Nothing critical is hardcoded: price and variants come from the product; section text and images are Theme Editor settings.

## First publish checklist

1. Upload / push this `theme/` folder as an unpublished theme.
2. **Customize → Hero product** → select **Premium Wool Sauna Hat** (handle fallback is already `premium-wool-sauna-hat`).
3. **Sauna guides** section → select the **info** blog if it does not auto-detect.
4. Theme settings → set Instagram URL and confirm contact email.
5. Preview on mobile + desktop, add Natural Oat and Charcoal to bag, run a test checkout.
6. Publish when happy.

## Develop locally

```sh
cd theme
npm exec -- @shopify/cli@latest theme dev --store YOURSTORE.myshopify.com
```

Or zip the `theme` folder and upload via **Online Store → Themes → Add theme → Upload zip**.

## SEO included

- Canonical URLs, Open Graph / Twitter cards
- Organization, WebSite, Product, and BlogPosting JSON-LD
- Homepage meta description fallback in theme settings (override per page in Admin)
- Semantic landmarks, image alts from settings / media
