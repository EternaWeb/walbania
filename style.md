# Wonder Albania — Section Design Principles

This guide captures the shared visual language established by the homepage, tour listing, and tour detail pages. New sections should feel editorial, image-led, calm, and unmistakably part of the same travel brand.

## 1. Core visual idea

Wonder Albania combines two moods:

- **Immersive travel editorial:** large authentic photography, generous composition, serif headlines, and clear narrative pacing.
- **Confident travel service:** compact utility labels, structured facts, direct actions, and restrained interface controls.

Every section should inspire first, then make the next action obvious.

## 2. Foundations

### Color

- Charcoal `#1F2528`: primary brand field, dark hero panels, strong buttons, and high-contrast text.
- Soft green `#CCDAB8`: signature accent, section transitions, labels, action chips, and map backgrounds.
- White `#FFFFFF`: primary content surface.
- Ink `#0A0A0A`: body and heading text on light surfaces.
- Muted gray `#6B7280`: supporting copy only.
- Divider `#E5E7EB`: quiet structure for lists, FAQs, and form fields.

Use charcoal and soft green as large compositional blocks, not scattered decoration.

### Typography

- **Season Mix:** page titles and major section headlines. Use tight leading around `0.95–1.05` and slightly negative tracking.
- **Anton:** short action labels, hero tags, and editorial eyebrows. Keep uppercase and concise.
- **Inter:** body copy, navigation, card text, and readable UI content.
- **Geist Mono:** metadata, counts, filters, facts, and compact utility labels.

Do not use the display faces for long paragraphs.

### Shape

- Media radius: `10px`.
- Structural surface radius: `2px`.
- Circular controls: arrows, icon buttons, and compact actions.
- Avoid soft, generic “app card” styling and excessive shadow. Structure should come from color, spacing, typography, and imagery.

## 3. Layout and spacing

- Maximum content width: `1440px`.
- Standard outer gutter: `12px` minimum, increasing only where a component needs breathing room.
- Major sections: normally `72–112px` vertical spacing on desktop and `56–72px` on mobile.
- Prefer two strong columns over many small panels.
- Full-width color bands should contain an aligned inner grid.
- Section headings should rarely exceed `660px`; supporting copy should normally stay below `620px`.

Keep the page rhythm varied: immersive hero, calm content field, strong color transition, then image-led content.

## 4. Page anatomy

### Heroes

- Use full-bleed photography or video.
- Add the shared dark film treatment so text remains legible and imagery feels consistent.
- Place the headline near the lower-left edge.
- Pair the headline with a soft-green Anton action label and circular arrow.
- Use one clear H1 and one short supporting paragraph.
- Avoid centered generic hero copy or icons floating above oversized titles.

### Section introductions

- Use a soft-green or charcoal band to transition out of the hero.
- Combine a small mono eyebrow, a large Season Mix statement, and one short explanatory paragraph.
- The statement should express a point of view, not repeat the page title.

### Cards

- Photography is the primary surface.
- Use `4:5` or `3:4` media ratios; keep a consistent ratio within a grid.
- Apply a dark lower gradient for white text.
- Place category/location metadata above the title.
- Use a circular soft-green arrow to signal navigation.
- Hover motion should be restrained: image scale around `1.03` and a small diagonal arrow shift.

### Maps and data-rich sections

- Put maps inside a soft-green editorial band.
- Keep the heading beside the map on large screens and above it on smaller screens.
- Use mono labels and compact controls.
- Let the map remain the dominant visual; avoid surrounding it with unrelated cards.

### FAQ

- Always use the shared FAQ component.
- Desktop layout: one strong image on the left, accordion content on the right.
- Mobile layout: remove the image entirely and give the accordion the full width.
- Open the first answer by default.
- Separate questions with thin dividers and use a rotating chevron.
- Keep answers concise and readable; do not nest cards inside accordion rows.

## 5. Responsive behavior

- At tablet widths, simplify multi-column compositions before shrinking typography aggressively.
- At `720px` and below, remove decorative FAQ imagery.
- Collection grids move from four columns to three, two, then one.
- Preserve generous image ratios on mobile; do not turn editorial cards into short horizontal rows.
- Keep tap targets at least `44px`.
- Headlines may wrap, but action labels should remain short enough to fit without truncation.

## 6. Motion and interaction

- Use `200–600ms` transitions with smooth ease-out curves.
- Animate image scale, arrow position, accordion chevrons, and small color changes only.
- Respect reduced-motion preferences.
- Every interactive element needs a visible keyboard focus state.
- Do not add motion that competes with travel photography or delays access to content.

## 7. Content principles

- Lead with a sense of place, then explain the practical value.
- Prefer specific Albanian locations, landscapes, and travel moments over generic tourism language.
- Eyebrows should be two to four words.
- Section headings should be editorial and concise.
- Body copy should normally be one short paragraph.
- Calls to action should use direct verbs: Explore, View, Choose, Check, Plan.

## 8. Reuse rules

- Reuse the shared header, footer, FAQ, hero action, section-heading, card, and map patterns.
- Extend existing tokens before introducing new colors, fonts, radii, or spacing systems.
- Destinations and attractions share one collection-page composition.
- Tour-specific content may vary, but its typography, spacing, controls, and FAQ behavior must remain consistent.

## 9. Avoid

- Generic dashboard grids.
- Large blank dark areas without useful imagery or content.
- Centered icon-plus-title templates.
- Mixed border radii.
- Multiple competing accent colors.
- Dense rows of small cards.
- Decorative imagery on mobile when it displaces useful content.
- Separate one-off FAQ implementations.
