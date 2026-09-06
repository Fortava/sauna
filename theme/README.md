# BÖRN Shopify theme

Online Store 2.0 theme for [bornsauna.com.au](https://bornsauna.com.au).  
Everything on-storefront is editable in **Customize** — no code required for copy, images, menus, or product.

## Upload

1. Admin → **Online Store → Themes → Add theme → Upload zip** (`born-shopify-theme.zip`)
2. **Customize** (do not publish yet)

## First-time setup (5 minutes)

| Step | Where |
| --- | --- |
| Pick product | Homepage → **Hero product** → Featured product → **Premium Wool Sauna Hat** |
| Nav links | Header group → **Header** → link blocks (or assign a Menu) |
| Contact | Theme settings → Contact page |
| Instagram | Theme settings → Instagram URL |
| SEO | Theme settings → SEO defaults |
| Guides blog | Homepage → **Sauna guides** → select `info` blog if needed |

Price, colours, and stock always come from **Products** in Admin.

## What Wayne can edit

- Homepage sections: hero, performance, why wool, details, FAQ, guides, newsletter  
- Header / announcement / footer / cart drawer  
- Product, blog, article, collection, page templates  
- Brand name (**BÖRN**), colours, SEO title/description, share image  

## Develop

```sh
cd theme
npm exec -- @shopify/cli@latest theme check
npm exec -- @shopify/cli@latest theme dev --store YOURSTORE.myshopify.com
```
