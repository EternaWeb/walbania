# WonderAlbania tour admin setup

## 1. Create the Supabase data model

Open the Supabase SQL Editor for the production project and run
[`supabase/wonderalbania.sql`](./supabase/wonderalbania.sql) once. It creates the tour CMS
tables, row-level security policies, indexes, admin rate-limit storage, geocoding cache, and the
public `tour-media` bucket.

Use a fresh project or review table-name conflicts before running the file in an existing schema.

## 2. Configure server environment variables

Copy the names from [`.env.example`](./.env.example) into the local `.env` file and the Vercel
project environment:

- `SITE_URL`: the production origin, with no trailing slash.
- `SUPABASE_URL`: the Supabase project URL.
- `SUPABASE_PUBLISHABLE_KEY`: the project's publishable public key.
- `SUPABASE_SECRET_KEY`: the server-only secret key. Never prefix it with `VITE_`.
- `ADMIN_PASSWORD`: the password used at `/admin/login`.
- `ADMIN_SESSION_SECRET`: a random value of at least 32 characters.
- `GEOCODER_USER_AGENT`: a descriptive Nominatim user agent with the website and contact address.

Redeploy after changing production environment variables.

## 3. Start using the admin

1. Open `/admin/login` and enter `ADMIN_PASSWORD`.
2. Create the categories, tour types, and difficulties needed by the first tour.
3. Add reusable traveller reviews.
4. Create a tour, fill both language tabs, upload the hero and gallery images, confirm every
   itinerary location, and add date exceptions as needed.
5. Save the draft, use Preview for each language, and publish.

Publishing returns and displays both live URLs. `/tour` and `/fr/tour` redirect to the featured
published tour, or to the newest published tour when none is featured. Draft and archived records
remain inaccessible to the public key because of row-level security.

## Availability behavior

`Default availability` controls every future date. A date exception can make one date unavailable
or replace the base price for that date. The booking controls are deliberately disabled until a
booking backend is added.
