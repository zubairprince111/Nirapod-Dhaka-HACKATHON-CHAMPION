# Nirapod Dhaka

Nirapod Dhaka is a community-driven public safety and hazard-reporting platform for Bangladesh.
Build a full-stack, mobile-first web app called [App Name] — a community-driven public safety and hazard-reporting platform for Bangladesh. Citizens report crime hotspots, infrastructure hazards (open manholes, damaged drains, broken roads), and accidents on a live interactive map, tagged with GPS and photo proof. Reports route automatically to the correct authority — City Corporation, Disaster Management Board, or Police — with no confirmation step needed from the user. Citizens track their own reports from Sent to Received to Resolved. The app also includes a one-tap Emergency SOS and a no-login "lost phone" locator.

Primary users are everyday commuters — including many older and low-literacy users — plus three authority roles (Police, Disaster Management Board, City Corporation) who each get their own dashboard. Tone throughout: calm, official clarity. This is a civic safety tool, not a consumer social app — never alarmist, never playful for its own sake. Urgency should come from clear visual hierarchy and color, not noisy language.

Design system

Light mode only, everywhere — no dark backgrounds or navy anywhere, including on the three authority dashboards.

Background: a cool, slightly gray-toned off-white (#F4F6F5) — not stark white, not warm cream.

Body text / ink: near-black charcoal (#1A1D1E), not pure black.

Primary accent (trust, primary buttons, links): deep teal (#0E9C8C).

Danger/urgent accent (hazard pins, SOS, urgent badges): deep coral-red (#E23350).

Pending/in-progress accent: amber (#E8A33D).

Resolved/positive accent: clear green (#2E9E5B).

Headings: Space Grotesk, bold, slightly wide tracking, for a confident and technical feel.

Body text: Inter.

For Bangla-language text specifically, pair both with a Bengali-script font such as Hind Siliguri or Noto Sans Bengali — Space Grotesk and Inter have no Bengali glyphs.

Cards: white fill, soft shadow or thin border, with a colored left-edge accent bar showing category (red = crime, amber = infrastructure, teal = accident).

Status shown as pill badges: a pale tint of the color as background, with a deeper shade of the same color as the text.

Large, thumb-friendly tap targets everywhere (44px minimum) — many users are older or reporting one-handed while walking.

Icon-led navigation: every primary action gets its own distinct icon plus a text label, never text alone, so low-literacy users can navigate by shape and color.

Tech & data foundations

Frontend: React + Tailwind + shadcn/ui, fully responsive, mobile-first.

Backend: Supabase for authentication, database, and photo storage.

Map: Leaflet.js with OpenStreetMap tiles (no paid API key required), plus the Leaflet.markercluster plugin so nearby pins collapse into a numbered cluster badge at low zoom and separate into individual pins on zoom-in.

Auth: email + password to start, so login works immediately with no extra setup. Structure the profiles table with a phone field so phone-based OTP login can be added later without a schema change.

Roles: one profiles table with a role column (citizen, police, dmb, city_corp). After login, route each role straight to its own dashboard.

Tables to create:

profiles: id, full_name, phone, role, emergency_contact_name, emergency_contact_phone

reports: id, reporter_id, type (crime | infrastructure | accident), subtype (manhole, drain, road, snatching, robbery, etc.), photo_url, description, lat, lng, status (sent | received | resolved), created_at

report_votes: id, report_id, user_id, vote (confirm | dispute)

sos_alerts: id, user_id, lat, lng, status, created_at, nearest_station_id

police_stations (seed data): id, name, lat, lng

hospitals (seed data): id, name, lat, lng, beds_available, icu_available — seed with a few real Dhaka hospitals (e.g. Square Hospital, Dhaka Medical College Hospital, United Hospital) and mock counts

Auto-flag a hotspot when three or more crime reports land within a small radius within 48 hours

Pages & flows

1. Landing page

Full-bleed hero with a live-feeling animated map preview — pins dropping in with a soft pulse, a translucent red-orange wash over one hotzone — before any heavy text loads. Below it: three entry points — "Log in," "Create account," and a quieter "Browse the map" that lets a visitor view (not submit or vote on) reports without an account. Include small trust mentions for City Corporation, Disaster Management Board, and Police. A short three-icon strip beneath explains the core loop: view hazards → report one → emergency SOS. Also link, in the footer, to a separate "Find a lost phone" page that needs no login (see section 7).

2. Sign up / log in

Email + password form. Collect full name and one emergency contact (name + phone) at sign-up, since that powers the SOS flow. A visible language toggle (Bangla / English) sits in the header on every screen, defaulting to Bangla.

3. Main map (citizen home)

After login, land directly on a full-screen Leaflet map — no dashboard screen first. Pins are shaped and colored by category (crime = red, infrastructure = amber, accident = teal), with a subtle pulse on anything reported in the last hour. Floating filter chips over the map ("All," "Crime," "Infrastructure," "Resolved") toggle visibility. A translucent red-orange overlay shades hotzone areas. Tapping a single pin opens a bottom sheet (never a separate page) with photo, description, timestamp, a status pill, and confirm/dispute buttons with live counts. A floating "+" button starts the report flow. A separate, fixed, high-contrast SOS button stays in a thumb-reachable corner regardless of zoom or scroll.

4. Report a hazard

Tapping "+" drops a draggable pin at the user's current GPS location by default. The user picks a type (Crime, Infrastructure, Accident), adds a photo, and writes a short description. On submit, route automatically with no confirmation step: infrastructure reports go to both City Corporation and Disaster Management Board; crime reports go to City Corporation and Police; accident reports go to the flow in section 5. Show a brief "Report sent" toast and return to the map with the new pin visible.

5. Accident + ambulance

When the type is "Accident," after submission show a panel led by two large actions — "Call nearest ambulance" and a short list of nearby hospitals. Each hospital row shows name, distance, and a simple traffic-light dot for bed availability and ICU availability (green = available, red = full), rather than raw numbers, so it reads instantly under stress.

6. Emergency SOS

The persistent SOS button opens a full-screen confirmation ("Send SOS with your live location?") to prevent accidental triggers, then shares live location with the nearest police station (nearest by straight-line distance against the seeded police_stations table) and alerts the user's listed emergency contact in-app. Show a live status screen ("Police station notified · your contact has been alerted") with location still visibly updating.

7. Lost device finder

Lives outside the logged-in app, linked from the landing page as "Find a lost phone," reachable without an account — the use case is someone using a stranger's borrowed phone. One screen only: enter the phone number tied to the lost device, generate a unique link, and show it ready to copy/share. For this build, simulate the "send via SMS/WhatsApp" step with a simple shareable link rather than wiring real telecom APIs. Opening that link (e.g. in a second browser tab, to simulate the emergency contact's view) shows the device's last-known location on a small map, pulled from the browser's Geolocation API.

8. Profile & my reports

A profile page listing the user's own submitted reports, each with the Sent → Received → Resolved tracker and its confirmed/disputed vote counts. Include emergency contact management (edit name/phone) here too.

9. Authority dashboards

Three dashboard views, shown based on the logged-in user's role — all in the same light design system, no exceptions:

Police: active SOS alerts at the top (with live location links), a crime reports feed, and auto-flagged hotspots. Actions: Mark received, Resolve, View on map.

Disaster Management Board: infrastructure reports only (manhole, drain, road), each with photo, GPS, description, and upvote count. Actions: Mark received, Resolve — status changes must update the citizen's own tracker automatically.

City Corporation: full admin view combining every stream (police, DMB, accidents), with the ability to override any status, plus a simple analytics summary (total open, active SOS, resolved this month).

Accessibility requirements

Bangla as the default language everywhere, with a one-tap toggle to English.

Every icon paired with a text label; never use color alone to signal severity — pair it with a distinct icon shape too.

A settings screen with text-size and high-contrast toggles.

Images and map tiles load progressively rather than all at once, to stay usable on slower connections.

Build order

Design system + landing page

Auth (sign up/login) + profiles table

Main map with Leaflet + clustering + a few seeded sample reports

Report creation flow + bottom sheet detail/voting

Accident/ambulance panel + SOS flow

Lost device finder (standalone flow)

Profile & my reports page

Three authority dashboards + role-based routing

Ask me any clarifying questions you need before building each section, and use realistic Bangladeshi place names and sample data throughout rather than placeholder or lorem ipsum content.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
