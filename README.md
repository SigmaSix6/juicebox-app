# Juicebox — Frontend Developer Assessment

A four-screen onboarding flow built from the Juicebox Figma design:

1. **Home**: the brand's hexagon Lottie blooms into the orb, then industry opinions float in around it.
2. **Walkthrough**: three Swiper slides whose copy brightens word by word, ending in **Get started**.
3. **Multistep form**: a chat-style first name step, then an email step, both validated.
4. **Result**: a personalised confirmation, a summary of the answers, and the looping hexagon Lottie.

Built with **Next.js 16 (App Router) + TypeScript**, **CSS Modules + CSS variables**, **GSAP**, **Lottie**, **Lenis** and **Swiper**.

## Running locally

Requirements: Node.js 20.9+ and npm.

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (all routes prerender as static)
npm run start      # serve the production build
npm run lint       # ESLint
```

The design is mobile-first (390 × 665 viewport, iPhone 12 Pro minus browser chrome). For the pixel-accurate view, open your browser's device toolbar at 390 px wide. On desktop the same column is centred.

## Project structure

```
app/
  layout.tsx            fonts, metadata, skip link, <AppShell>
  page.tsx              /            → HomeScreen
  walkthrough/page.tsx  /walkthrough → WalkthroughScreen
  form/page.tsx         /form        → AboutYouForm
  result/page.tsx       /result      → ResultScreen
  fonts/                Bagoss (Standard Regular) + Söhne Buch, self-hosted
components/
  ui/        Button, IconButton, Logo, PaginationDots
  form/      TextInput, MultiStepForm, steps config, AboutYouForm
  layout/    AppShell, Screen, Header, SkipLink
  orb/       OrbStage, OrbSlot, OrbContext   (the shared orb, see below)
  motion/    SmoothScroll (Lenis), RevealText, useLottie, tweenLottie
  screens/   HomeScreen, WalkthroughScreen, ResultScreen
lib/         flow-context (form state), validation, motion helpers
styles/      tokens.css (design tokens as CSS variables)
public/
  figma/     assets exported from Figma (logo, orb, icons)
  lottie/    hexagon.json (supplied JB2G Lottie)
scripts/     fetch-figma-assets.mjs (one-off asset export, already run)
```

## How it works

### Design tokens and CSS variables

Every colour, type size, letter-spacing, spacing value, radius, shadow and easing curve lives in `styles/tokens.css`. The names mirror the Figma variable collections (`background/*`, `type/*`, `brand-colours/*`, `module-spacing/*` and so on). Components use CSS Modules and only reference tokens, so the theme is changed in one place.

### Reusable components

- `Button`: the three button styles in the design (`primary` lavender, `outline`, `light` with an outer ring). It renders a `<Link>` when given an `href`, otherwise a `<button>`.
- `TextInput`: the chat-style field with an inline send button. It has a visually hidden `<label>`, plus `aria-invalid` and `aria-describedby` wired to the prompt and to the error message. It works with any input `type`.
- `MultiStepForm`: takes a list of step configs (`components/form/steps.ts`), so adding a question means adding one object with its label, input type, autocomplete hint and validator.
- `Screen` and `Header`: the shared page frame (header, content, bottom action) and the back / start-over bar.

### One orb, many screens

The orb is rendered once in the root layout (`OrbStage`). Each page places an `<OrbSlot variant="lg" | "md" | "sm">` where the orb should sit. The stage measures the slot and GSAP tweens the orb there. It glides from the large homepage orb to the walkthrough orb, then shrinks into the small hexagon on the form and result screens, where it cross-fades into the hexagon Lottie.

### Animation

- **GSAP** drives everything: page entrances (`useGSAP` with `gsap.matchMedia`), the word-by-word reveal on the walkthrough, the orb's travel and float, and the Lottie playback itself.
- **Lottie** (`lottie-web`, light SVG build) is loaded with `autoplay: false`. `tweenLottie()` moves its playhead with a GSAP tween, so it shares GSAP's easing, timelines and ticker. It plays as the homepage intro, once on each form step, and on a loop on the result screen.
- **Lenis** smooth scrolling runs on GSAP's ticker, so scroll and animation share one requestAnimationFrame loop.
- Elements that animate in are hidden from first paint with `@media (scripting: enabled)`, so nothing flashes before the scripts load.

### Form state and validation

`FlowProvider` keeps the answers in React context, mirrored to `sessionStorage` so they survive reloads and back-navigation. Validation is plain TypeScript in `lib/validation.ts`:

- **First name**: required, 2–50 characters, letters plus spaces, hyphens and apostrophes. Any language's letters are accepted.
- **Email**: required, and must have the format `name@domain.tld`.

Visiting `/result` without answers redirects to `/form`. **Start over** (the refresh icon) clears the answers and returns home.

## Accessibility

- Semantic landmarks and one `<h1>` per screen (visually hidden where the design has no visible heading), plus a skip-to-content link.
- Every control can be reached and used from the keyboard. Visible `:focus-visible` rings are offset clear of the white button's ring.
- Icon buttons have `aria-label`s ("Go back", "Previous question", "Start over").
- Each form field has a label. Errors use `role="alert"`, are tied to the field with `aria-describedby`, and send focus back to the field. Every new question takes focus, like a chat.
- The walkthrough uses Swiper's A11y and Keyboard modules (slides are labelled "1 of 3", and the arrow keys navigate). The dots are decorative and hidden from screen readers.
- Inputs use `autocomplete`, `inputmode` and `enterkeyhint` hints for mobile keyboards.
- `prefers-reduced-motion` skips the intro, the drifting, the reveal and the orb travel. Content is shown in its final state.
- Page titles change per route, so the Next.js route announcer reads each new screen.
- Checked with axe-core (WCAG 2.1 AA and best-practice rules): no violations on any screen, including the error state.

## Design decisions and deviations

- **Desktop**: the 390 px column is centred, and the call to action follows the content instead of being pinned to the bottom of the window.
- **Walkthrough copy** ends fully white. The design's half-grey text is shown as a mid-point of the word-by-word reveal.
- **Copy**: "AI cant replace creativity" was corrected to "AI can't replace creativity".
- **Fonts**: Bagoss is supplied as a trial variable font. It was cut to the single _Standard Regular_ instance that the design uses, and served alongside Söhne Buch as WOFF files.
- **Swiper** mounts after hydration because it reads the clock while rendering, which this project's `cacheComponents` prerendering does not allow. The first slide is server-rendered with an identical layout, so nothing shifts.
