# Ucchas: company website

Website for Ucchas, an IT company. Its main services are Shopify, e-commerce and remote hiring;
it also builds websites, apps and custom software. Next.js 16 (App Router) + Lenis smooth scrolling. One page with section
navigation, on a static gradient backdrop. Animations are scroll-driven CSS, with no animation
library.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Sections

| Section | File | Notes |
| --- | --- | --- |
| Navigation | `components/Nav.tsx` | Fixed bar with scroll progress, the current section underlined, and a blurred background once the page scrolls; full-screen menu below 1080 px. |
| Hero | `components/About.tsx` | Headline, two buttons and stats (`Counter.tsx`). |
| Hero 3D | `components/hero3d/*.jsx` | An exploded-view processor (circuit board, chrome core, glass top) on the right of the hero. See below. |
| About & why | `components/Story.tsx`, `components/WhyUs.tsx` | Word-by-word "About Ucchas" statement, then four short reasons (`WHY`). |
| Services | `components/Services.tsx`, `components/ServiceArt.tsx`, `components/Spotlight.tsx` | Bento grid from `SERVICES`. Services with `main` set (Shopify, e-commerce, web, remote hiring) get large tiles with a small animated mock-up (`ServiceArt.tsx`); the rest are compact tiles. Tile borders glow near the pointer (`Spotlight.tsx`). |
| Work | `components/Work.tsx`, `assets/projects/` | Pinned, looping 3D gallery of case studies with photos. Edit `PROJECTS`; photo credits are in `assets/projects/CREDITS.md`. |
| Testimonials | `components/Testimonials.tsx` | Hidden until `TESTIMONIALS` has real quotes. |
| Hire talent | `components/Hiring.tsx` | Two ways to hire, the roles, and a call to action (`HIRING`). |
| Process | `components/Process.tsx` | Four steps on a line that draws itself as you scroll (`PROCESS`). |
| Team | `components/Team.tsx` | Role cards (`TEAM`); add a name, photo and LinkedIn to show a real person. |
| Technologies | `components/Technologies.tsx`, `components/StackTabs.tsx` | Marquee (`Marquee.tsx`) that reacts to scroll speed, then four tabs with logo tiles (logos from the `simple-icons` package). Edit `STACK`. |
| FAQ | `components/Faq.tsx` | Five questions (`FAQ`) in native `<details>` elements. |
| Contact | `components/Contact.tsx`, `components/ContactForm.tsx`, `app/actions.ts` | Name, email and message, handled by a Server Action, plus the footer bar. |

All text lives in `lib/site.ts`. Lines marked `// CONFIRM` are claims (numbers, timings,
guarantees) to check before the site goes live.

## How it works

| File | What it does |
| --- | --- |
| `lib/engine.ts` | One `requestAnimationFrame` loop for everything. Steps Lenis, measures sections only on resize, and writes a `--p` (0 to 1) CSS variable on every tracked section. |
| `components/Track.tsx` | Wrap any section to give it a live `--p`. Modes: `view`, `pin` (sticky sections), `enter`, `exit`. |
| `app/globals.css` | Nearly all animation is plain CSS `calc()` on `--p`. Add `.rise` inside a `<Track mode="enter">` to make something rise into view (`--i` staggers siblings). |

## Contact form

The form is validated in the browser and again on the server (`app/actions.ts`), and has a hidden
spam-trap field. Submissions are sent as a JSON POST to the URL in `CONTACT_WEBHOOK_URL`: your own
backend, Zapier / Make / n8n, or a Slack incoming webhook (the payload includes a `text` summary).

```bash
# .env.local
CONTACT_WEBHOOK_URL=https://your-backend.example.com/contact
CONTACT_WEBHOOK_TOKEN=optional-secret   # sent as "Authorization: Bearer ..."
```

Without `CONTACT_WEBHOOK_URL`, `npm run dev` logs submissions to the terminal, and a production
build asks visitors to email the address in `lib/site.ts` instead.

## SEO

Everything search engines and social networks read is set up; the settings live in `lib/seo.ts`.

| What | Where |
| --- | --- |
| Title, description, keywords, canonical URL, Open Graph and X (Twitter) tags, robots rules | `metadata` in `app/layout.tsx`, text in `lib/seo.ts` |
| Share image (1200×630, made at build time) | `app/opengraph-image.tsx` |
| `/sitemap.xml` and `/robots.txt` | `app/sitemap.ts`, `app/robots.ts` |
| Icons: favicon, SVG icon, Apple icon, app manifest | `app/favicon.ico`, `app/icon.svg`, `app/apple-icon.png`, `app/manifest.ts`, `public/icon-*.png` |
| Structured data (Organization, WebSite, WebPage, services and FAQ) | `jsonLd()` in `lib/seo.ts`, added in `app/page.tsx` |
| Logo for search results | `public/logo.png` |
| 404 page (not indexed) | `app/not-found.tsx` |

Before going live, set these where you deploy (on Vercel: Project Settings, Environment Variables):

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com     # canonical URL, sitemap and share links
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=xxxxxxxx   # optional: the code from Google Search Console
```

Then add your social profiles to `SOCIAL_PROFILES` in `lib/seo.ts`, submit `/sitemap.xml` in Google
Search Console, and check the page with Google's Rich Results Test.

## Customise

- **Copy and company details**: `lib/site.ts`, plus the text inside each section component
- **Colours**: `:root` and `.backdrop` in `app/globals.css`
- **Project gallery speed**: the `.work` height in `globals.css`. Taller means slower.

## Hero 3D (components/hero3d)

Written in JavaScript/JSX with three.js, @react-three/fiber and @react-three/drei
(`allowJs` is on in `tsconfig.json` so the TypeScript pages can import it).

| File | What it does |
| --- | --- |
| `Hero3D.jsx` | The box on the right of the hero. Loads the scene only once the page is idle, skips it without WebGL or with Data Saver, and fades it in on its first frame. |
| `Scene.jsx` | Canvas, camera rig, cursor light, studio lighting (built in code, no HDR download), shared motion state, background shader compile, pause when off screen. |
| `ChipCore.jsx` | The processor: board with a generated circuit (pulses run in to the core), pins, iridescent chrome core with etched marking, glass top, light links between the layers. |
| `LightFibres.jsx` | Data cables with travelling light pulses. |
| `Dust.jsx` | Atmospheric particles. |

Motion: the layers assemble on load, breathe when idle, tilt and spread toward the cursor, and
fly apart as the hero scrolls away. Reduced motion shows one still frame; touch screens and
narrow windows get a lighter version (no glass top, fewer particles, lower resolution).
