# BÖRN Shopify theme

Custom Online Store 2.0 theme for [bornsauna.com.au](https://bornsauna.com.au).

**Design:** refined laptop storefront layout (cream / ember / split hero).  
**Content:** live Shopify copy, product photos, variants/pricing, and Sauna Guides blog.  
**Privacy:** no personal names or emails are published on the storefront — contact goes through a Contact page.

## What to edit in Shopify Admin

| What | Where |
| --- | --- |
| Price, colours, stock | **Products → Premium Wool Sauna Hat** |
| Homepage copy & images | **Online Store → Themes → Customize** |
| Announcement / header / footer | Theme editor → matching sections |
| Blog posts | **Online Store → Blog posts** (Sauna Guides / `info`) |
| SEO titles & descriptions | Product / page / blog “Search engine listing” + Theme settings → SEO defaults |
| Brand colours, Instagram, contact page | Theme settings (Customize sidebar) |

## First publish checklist

1. Upload `born-shopify-theme.zip` as an unpublished theme.
2. **Customize → Hero product** → select **Premium Wool Sauna Hat**.
3. **Sauna guides** → select the **info** blog if needed.
4. Theme settings → set Instagram URL and Contact page (no email on-site).
5. Confirm homepage SEO title/description under Theme settings → SEO defaults.
6. Preview mobile + desktop, test checkout, then publish.

## SEO included

- Homepage title + meta description defaults (editable)
- Canonical URLs, Open Graph, Twitter cards, `og:locale`
- Robots rules: index public pages; noindex cart, search, account, paginated/tag filters
- JSON-LD: Organization, WebSite, BreadcrumbList, Product offers, CollectionPage, Blog, BlogPosting
- Blog authors attributed to the brand Organization (not personal names)
- CDN preconnect + preloaded stylesheet

## Develop locally

```sh
cd theme
npm exec -- @shopify/cli@latest theme dev --store YOURSTORE.myshopify.com
```
