# WonderAlbania Design System

## Purpose

This document is the design source of truth for WonderAlbania. It gives future pages and features one coherent visual language, interaction model, and content structure while keeping the experience warm, clear, and travel-led.

It applies to public discovery pages, search, tours, booking, support, and future account experiences. It documents product intent; backend integrations and payment collection are intentionally deferred.

## Design principles

1. **Inspire, then guide.** Large, authentic photography and evocative editorial content should make Albania feel tangible. Every immersive moment needs an obvious next action.
2. **Make travel choices calm.** Show the most useful information first: destination, duration, availability, price context, and what happens next. Break complex tasks into focused steps.
3. **Trust is designed.** Surface local expertise, inclusions, policies, confirmation states, and practical contact routes where a traveller needs them.
4. **Be consistent, not repetitive.** Reuse shared components and interaction rules across every page. Let imagery, content, and page hierarchy create variety.
5. **Design inclusively by default.** Every journey must work with keyboard, screen reader, touch, zoom, reduced motion, and narrow screens.
6. **Leave room to grow.** Build patterns that accommodate French, more currencies, additional destinations, live availability, payments, and customer accounts without redesigning the foundation.

## Brand foundation

### Logo

- `public/weblogo.png` is the canonical WonderAlbania logo asset.
- Use it in the header and footer with `alt="WonderAlbania"`; it should link to the homepage when used in navigation.
- Preserve the original aspect ratio. Do not crop, stretch, recolour, outline, shadow, or place it on a low-contrast background.
- The supplied blue logo is for white or very light surfaces. A dark-background logo variant requires explicit brand approval before use.

### Tokens

| Role | Token/value | Usage |
| --- | --- | --- |
| Brand | `#434DFF` | Primary actions, active states, links, key emphasis |
| Brand soft | `#E6E8FF` | Gentle panels, selected chips, hover surfaces |
| Background | `#FFFFFF` | Primary canvas and logo surfaces |
| Foreground | `#0A0A0A` | Main text and high-emphasis icons |
| Muted | `#F4F4F5` | Quiet fills, skeletons, disabled backgrounds |
| Muted text | `#6B7280` | Supporting copy and metadata |
| Border | `#E5E7EB` | Dividers and low-emphasis field boundaries |

- Use Inter for interface and body copy. Use the existing medium italic treatment sparingly to add warmth to editorial headings.
- Favour generous whitespace, simple grids, soft 16–24 px corner radii, restrained borders, and image-led cards.
- Keep animations short and purposeful. Respect `prefers-reduced-motion`; no interaction may rely on motion alone.

## Shared application shell

### Header and navigation

- **Desktop:** a utility contact bar; primary links for discovery; centred logo; language, search, and menu utilities. Use a mega-menu only when a section needs grouped links, destination imagery, or featured tours.
- **Mobile:** retain the logo and essential utilities, then open navigation in a focus-managed drawer. Keep touch controls at least 44 × 44 px.
- Navigation must expose the current section, have visible focus states, and close with Escape, an explicit close control, or outside interaction where appropriate.
- The language selector starts with English and French. Persist the chosen language, expose the current language in text, and never represent language by flag alone.

### Search

- Search is global and returns all site content: tours, destinations, collections, editorial content, FAQs, and support content.
- Open search from the header as a keyboard-accessible modal on small screens and an anchored dialog/panel on large screens. Offer recent or popular suggestions before a query.
- Results group content by type, state the result count and active query, and offer relevant filters and sorting. Design explicit loading, no-results, and error states with a clear recovery action.

### Footer

- Use `public/weblogo.png` on the white footer background, alongside a concise brand statement, contact details, navigation groups, legal links, social links, and newsletter signup.
- Newsletter signup needs an email label, validation feedback, consent copy where required, success/error feedback, and no promise of an integration until one is selected.

### Layout and responsiveness

- Use one max-width page container with consistent horizontal insets; content panels may be narrower for readability.
- Start from the mobile layout, then introduce multi-column grids only when content remains legible and usable. Horizontal carousels must remain swipeable and have non-touch controls on desktop.
- Prefer persistent context (breadcrumbs, titles, selected filters, booking progress) over forcing a user to remember a previous screen.

## Component system

Use the existing Radix/shadcn primitives as the accessible implementation base. Components must share the tokens, focus treatment, disabled behaviour, error messaging, and responsive rules defined here.

| Family | Required patterns |
| --- | --- |
| Actions | Primary, secondary, tertiary, destructive, icon-only, loading, disabled, and link actions |
| Forms | Text/email/telephone fields, textarea, checkbox, radio, switch, select, date picker, traveller/guest stepper, validation, help text, and required indicators |
| Discovery | Tour, destination, collection, editorial, testimonial, offer, and experience cards; badges/ribbons; filter chips; tabs; pagination; carousels |
| Navigation | Header, footer, breadcrumbs, pagination, language selector, navigation menu, mega-menu, mobile drawer, dropdown menu, and contextual menu |
| Feedback | Inline validation, alert, toast, progress indicator, skeleton, empty state, error state, success state, and confirmation panel |
| Overlays | Modal/dialog, alert dialog, popover, tooltip, dropdown, drawer, cookie/consent notice, and email-code resend dialog/state |
| Content | Accordion/FAQ, tables, inclusions lists, itinerary timeline, price summary, image gallery, map placeholder, and callout panels |

### Interaction rules

- Buttons state their outcome and show a progress state while an action is pending; prevent duplicate booking submissions.
- Inputs have persistent labels, programmatic error descriptions, and validation that is clear without colour alone.
- Dropdowns and modals trap focus where necessary, restore it to the trigger when closed, and offer Escape dismissal unless the task is truly blocking.
- Use confirmations for irreversible or consequential actions. Use toasts only for brief, non-critical feedback; critical booking information belongs in the page itself.
- Do not hide essential information solely in hover states. All controls require keyboard and touch equivalents.

## Page patterns

### Discovery

- **Home:** brand introduction, curated collections, offers, experiences, trust evidence, newsletter, and clear paths to search or tours.
- **Tour listing:** destination/editorial context, search and filter controls, result count, sort order, tour cards, pagination or deliberate progressive loading, and no-results guidance.
- **Tour detail:** gallery, title, destination, duration, price context in EUR, availability entry point, highlights, inclusions/exclusions, itinerary, practical details, FAQs, policy links, and related tours.
- **Destinations and collections:** editorial overview, relevant tours, seasonal or practical guidance, and links onward to search.
- **Editorial and support:** readable article/help layouts, related content, search path, contact options, and last-updated information where relevant.

### Utility and resilience pages

- **Contact:** contact routes, expected response times, accessible form, success/error state, and local practical information.
- **Legal:** readable policy templates for terms, privacy, cookies, booking conditions, cancellation, and accessibility.
- **404/error:** explain what happened in plain language and provide a route home, search, and appropriate recovery action.

## Search and booking journeys

### Full-site search

1. The traveller opens search from the header and enters a query.
2. Suggestions help them discover destinations, tours, and guides before or while typing.
3. Results are grouped by content type, filterable where useful, and link to the relevant detail page.
4. Empty, loading, and failure states preserve the query and offer useful next steps.

### Payment-free booking

1. The traveller chooses a tour, date/availability, traveller count, and applicable extras.
2. A clear price summary presents EUR amounts and distinguishes included items, optional extras, taxes/fees when known, and the fact that payment is not collected in this release.
3. Guest checkout collects traveller details and consent, then verifies the email address with a one-time code. The code flow provides expiry guidance, an accessible resend action, and a resend cooldown.
4. The traveller reviews the reservation and accepts required booking terms before submitting once.
5. The reservation is instantly confirmed without payment. The confirmation page shows a reference number, tour summary, next steps, contact support, and a resend-confirmation-email action.
6. A transactional confirmation email repeats the essential reservation details. Future payment instructions must be clearly separated from confirmation until a payment provider is approved.

### Future account experience

Guest checkout is the first-release default. Future accounts may provide trip management, traveller profiles, saved tours, documents, support messages, and payment history. Do not require an account before that experience is designed and implemented.

## Accessibility, quality, and content guidance

- Meet WCAG 2.2 AA contrast, focus, keyboard, form-label, error-identification, and reflow expectations.
- Use meaningful headings, landmarks, alt text that describes informative images, and empty alt text for purely decorative imagery.
- Keep language content separate from UI strings so English and French translations can be complete and consistent. EUR formatting follows the active locale.
- Optimise responsive images, avoid layout shift, and provide meaningful loading states for dynamic data.
- Write concise, reassuring, action-oriented travel copy. Never invent availability, protection/accreditation, prices, policies, or confirmation facts.

## Confirmed decisions

| Decision | Status |
| --- | --- |
| Design document role | Living design system and product reference |
| Initial languages | English and French |
| Initial currency | EUR |
| Search scope | Tours, destinations, editorial, FAQs, and support content |
| Booking model | End-to-end reservation journey without payment collection |
| Reservation result | Instant confirmation |
| Email behaviour | Verify email with code; allow resending booking confirmation email |
| Customer access | Guest checkout; future account experience reserved |
| Brand direction | Retain existing blue/white/lavender, Inter, rounded travel-editorial system |
| Logo | Use `public/weblogo.png` in header and footer on white/light surfaces |

## Confirm before implementation

- [ ] Select the inventory/availability source and define its update cadence, failure behaviour, and reservation hold rules.
- [ ] Confirm the tour content model: destinations, dates, capacity, travellers, extras, imagery, inclusions, exclusions, and related content.
- [ ] Define pricing, tax/fee, discount, deposit, cancellation, amendment, and refund policies.
- [ ] Select transactional email and email-verification providers, templates, sender domain, expiry, rate limits, and support escalation.
- [ ] Approve the legal copy, privacy basis, cookie/analytics consent, marketing consent, data-retention policy, and accessibility statement.
- [ ] Define staff/admin responsibilities for confirmed reservations, availability exceptions, customer contact, and manual changes.
- [ ] Approve future payment-provider requirements, payment timing, supported methods, and any handoff or post-confirmation payment flow.
- [ ] Confirm translation ownership and editorial governance for English and French content.
- [ ] Agree analytics events and success measures for search, tour discovery, email verification, checkout completion, and booking confirmation.
