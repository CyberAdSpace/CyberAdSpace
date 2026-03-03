# CyberAdSpace - Curated Multi-Brand Marketplace

A curated marketplace of founder-led brands, powered by a wrapped Cybertruck discovery engine.

**Live site:** https://cyberadspace.com (Netlify)

---

## How to Add a New Brand

All brands are configured in a single file:

**`src/config/brands.ts`**

To add a new brand, add an object to the `brands` array:

```ts
{
  id: 'your-brand-slug',
  slug: 'your-brand-slug',
  name: 'Your Brand Name',
  tagline: 'Short tagline here',
  description: 'One-paragraph description for brand cards.',
  longDescription: 'Longer description shown on the brand detail page.',
  email: 'yourbrand@cyberadspace.com',
  image: null,
  icon: 'Coffee',  // Any lucide-react icon name: Sparkles, Home, Music, ShoppingCart, Cookie, Coffee
  color: 'from-blue-500/20 to-cyan-500/20',  // Tailwind gradient for brand card background
  ctaButtons: [
    { label: 'Shop Now', href: '/brands/your-brand-slug', variant: 'primary' },
    { label: 'Learn More', href: '/brands/your-brand-slug', variant: 'secondary' },
  ],
  featured: true,  // Show on homepage featured grid
  category: 'Your Category',
}
```

### Adding a new icon

If you need an icon not already imported, edit `src/components/BrandCard.tsx` and `src/pages/BrandDetail.tsx` to import it from `lucide-react` and add it to the `iconComponents` map.

---

## How to Edit CTAs and Emails

Each brand's CTAs and contact email are in the same `src/config/brands.ts` file:

- **CTAs:** Edit the `ctaButtons` array for each brand. Each CTA has a `label`, `href` (route path), and `variant` ('primary' or 'secondary').
- **Emails:** Edit the `email` field for each brand. This shows on the brand detail page as a clickable mailto link.

---

## Rewards / Cyber Points (Token-Ready)

The rewards system lives in:

**`src/services/rewards.ts`**

### Current implementation
- Uses localStorage to track points balance and transactions
- Implements `IRewardsService` interface with methods: `getBalance()`, `addPoints()`, `getTransactions()`, `reset()`
- Points rules defined in `REWARDS_RULES` constant

### Future XPR Network + BlastPad Integration
When ready to integrate blockchain tokens:

1. Create a new class (e.g. `XPRRewardsService`) that implements `IRewardsService`
2. Use `@proton/web-sdk` to connect WebAuth wallets and read on-chain token balances
3. Replace the singleton export at the bottom of the file:
   ```ts
   // Change from:
   export const rewardsService: IRewardsService = new LocalRewardsService()
   // To:
   export const rewardsService: IRewardsService = new XPRRewardsService()
   ```
4. No UI components need to change -- they all read from the `rewardsService` interface.

---

## Analytics Events

Event tracking hooks are in **`src/utils/analytics.ts`**.

Currently logs to console in development mode. To connect a real analytics provider (GA4, Mixpanel, etc.), update the `trackEvent` function.

Tracked events:
- `explore_brands_click` -- user clicks "Explore Brands"
- `brand_card_click` -- user clicks a brand card (includes brand slug)
- `join_marketplace_submit` -- partner brand application submitted
- `create_song_submit` -- custom song form submitted
- `kids_song_submit` -- kids song form submitted
- `request_service_submit` -- service request form submitted
- `email_contact_click` -- user clicks a brand's email link
- `rewards_view` -- user views the rewards section

---

## Pages / Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, How it Works, Featured Brands, Rewards, Cybertruck, Join Marketplace |
| `/brands` | Brands Index | All brands with search/filter |
| `/brands/:slug` | Brand Detail | Individual brand page with CTAs, email, brand-specific sections |
| `/create-song` | Create Song | Elevated Remedies song request form |
| `/kids-song` | Kids Song | Antria's Academy kids song request form |
| `/request-service` | Request Service | BAM Casas property service request form |

---

## Development

```bash
npm install
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Build for production (output in dist/)
```

## Deploying to Netlify

1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist` folder into the drop zone
4. Your site is live!

The `_redirects` file in `public/` ensures client-side routing works on Netlify.

---

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router v7
- lucide-react icons
