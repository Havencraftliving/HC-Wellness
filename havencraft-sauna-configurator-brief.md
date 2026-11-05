# HavenCraft Sauna Configurator — Build Brief for Qusai

**Reference site:** leisurecraft.com (Pure Cube Outdoor Sauna product page)
**Goal:** Replicate the option/add-on configurator pattern from LeisureCraft's product pages, rebuilt entirely in HavenCraft branding.
**Where this lives:** a genuinely **separate website** — its own codebase, own hosting, own domain, own cart, own checkout. It doesn't run through Shopify at all. But its backend connects into **Odoo**, HavenCraft's central operations platform, the same way the Shopify store already does — so orders, customers, and inventory from this second site land in the one system the team actually works from, instead of creating an island no one checks.

---

## 1. What we're copying from LeisureCraft

Looked at their Pure Cube Outdoor Sauna page directly. Their site is a custom-built (non-Shopify) storefront, so we won't copy their code — just the UX pattern, which is fully reproducible on any stack:

- A stack of **option groups** sits above the price/CTA: Wood Type, Size, Shower (add/no add), Porch (add/no add).
- Each group is a row of selectable pills/buttons — not a dropdown. One selection per group, selected state is visually obvious (border/fill change).
- Choosing an option updates the page's state (and in their case, price) live — no page reload.
- Their CTA is "Request Price" (a quote-driven flow). Ours will be a real Add to Cart → our own checkout, since Michael wants this site to sell directly.
- Below the configurator: a standard description, features list, and specs section.
- They also link out to a separate **3D drag-and-drop builder** (a much bigger, standalone tool). Flag this as a **phase 2, not part of this build** — don't let it block shipping the option/add-on selector.

**What to build for phase 1:** the option-group selector + live-updating summary + a working cart and checkout, with the finished order flowing into Odoo.

---

## 2. Architecture: a standalone store, feeding the same Odoo backend as Shopify

This is the piece worth being precise about, because it's the part that makes "totally separate website" actually work for the business rather than create a second silo:

- **Front end:** its own app — any modern framework Qusai likes in Cursor (Next.js is the common default), own domain (not a subdomain of havencraftliving.com), own hosting (Vercel/Netlify or similar). Doesn't touch the Monochrome theme or Shopify at any point.
- **Source of truth for products, pricing, and inventory:** Odoo, not a separate database built for this site. HavenCraft's Shopify store presumably already syncs sauna products, prices, and stock levels into (or out of) Odoo through some existing connector — that's the pattern to mirror, not reinvent. The new site should read its catalog and option/add-on data from Odoo via Odoo's API, so a price change in Odoo shows up correctly on both storefronts without anyone updating two places.
- **Checkout and payment:** since this site doesn't use Shopify's checkout, it needs its own payment processing — Stripe is the standard choice here (handles PCI compliance, has a mature Checkout flow). The app charges the card directly through Stripe.
- **Order sync into Odoo:** the moment a payment succeeds, the app creates the corresponding record in Odoo (a Sales Order, or however the existing Shopify-Odoo connector represents an order) via Odoo's API — same customer, line items, add-ons, and total that Shopify orders already produce, so Odoo doesn't end up with two differently-shaped order types.
- **Odoo API access:** Odoo exposes an external API (XML-RPC/JSON-RPC, or REST depending on the Odoo version/setup) that this app authenticates against with an API key or service-account credentials. Getting this set up is not a decision Qusai can make alone — it needs Michael to provision access and confirm what the existing Shopify connector actually syncs, so the new site's integration matches it rather than drifting into its own format.

---

## 3. Step-by-step for Cursor

1. **Scaffold the app.** New Next.js (or similar) project in Cursor, deployed early to a preview URL so there's a working pipeline from day one.
2. **Get Odoo API access and understand the existing Shopify↔Odoo sync** (coordinate directly with Michael before building the data layer, so the new integration matches the existing pattern rather than inventing a second one).
3. **Set up the Stripe account and API keys** (needs Michael or whoever manages HavenCraft's financial accounts).
4. **Build the product/add-on data layer**: pull sauna models, option groups, and add-on pricing from Odoo via its API (start with a scheduled sync if live is too heavy for v1).
5. **Build the option-group UI**: one block per group, rendered as pill/button rows matching the LeisureCraft interaction pattern.
6. **Wire selection state in JS/React**: clicking a pill marks it selected, deselects siblings in that group, updates a running price summary — no page reload.
7. **Build the cart and Stripe checkout**: selections populate a cart, checkout runs through Stripe Checkout (fastest) or Stripe Elements (more custom-styled).
8. **Build the Odoo order push**: on successful payment, create the order record in Odoo with the same shape as a Shopify-originated order, plus a confirmation email to the customer and a notification to HavenCraft's team.
9. **Apply HavenCraft branding** (see §4).
10. **Responsive pass**: option rows need to wrap/stack cleanly on mobile.
11. **Point the new domain at it**, test end to end (configure → Stripe checkout → payment succeeds → order appears correctly in Odoo), get Michael's sign-off.
12. **Cross-link the two sites**: a link from the relevant sauna pages on havencraftliving.com over to the new store, and back.

---

## 4. HavenCraft branding to apply

- **Colors:** deep forest green `#162114` (primary/dark), warm cream `#F6EBDA` (background/light), orange-red `#EB3D00` (accent — selected-state highlight and CTA button), mid-green `#294122` (secondary).
- **Voice:** premium, aspirational — match the tone already used on the main site, not LeisureCraft's more utilitarian wording.
- **Open item to confirm before Qusai starts:** saunas are sold under the **HC Wellness** sub-brand — check whether it has its own logo/color treatment distinct from the core HavenCraft palette above, or inherits it directly. Confirm with Michael rather than guessing.

---

## 5. Decisions to lock before build starts

Hand these to Michael/Qusai as open questions, not assumptions:

- **How the existing Shopify↔Odoo connection actually works** — which module/connector, what syncs (products, prices, inventory, orders, customers), and in which direction. This is the reference spec for the new integration; Michael to confirm this with Qusai before he starts building against assumptions.
- **The new domain name** — needs its own name since it's a standalone store.
- Exact list of upgrades/add-ons to offer per sauna model
- Whether product/price sync from Odoo is live or on a schedule for v1
- Payment processor: Stripe is the default recommendation, but confirm HavenCraft doesn't already have a preferred processor
- Sales tax handling across provinces/states (Stripe Tax or similar — needs explicit configuration)
- Whether this covers all sauna SKUs at launch or starts with one model (Ember 1) as the pilot

## 6. QA checklist before publish

- All option combinations selectable/deselectable, no dead states
- Price/summary on the configurator matches what's actually charged at checkout
- Mobile layout doesn't break (pill rows wrap, no horizontal scroll)
- Full path works end to end: configure → cart → Stripe checkout → payment succeeds → order appears correctly in Odoo → confirmation email sent → team notified
- Order in Odoo matches the shape/fields of a Shopify-originated order (so reporting/accounting doesn't need special-case handling for this channel)
- Inventory in Odoo reflects sales from this site (no overselling once both channels are live)
- Tax calculated correctly for at least BC and any other regions HavenCraft ships to
- Branding matches HavenCraft — colors, type, button states, spacing
- New domain's SSL/DNS confirmed working before sharing the link externally
- Cross-links between the two sites both work
