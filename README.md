# Talk & Learn — Screen 1: Course list / home (prototype)

A standalone, high-fidelity React prototype of the redesigned Talk & Learn
list / home screen. This is the entry point students land on after signing in,
where they find and launch all learning. It presents short courses, in-depth
courses, and case studies as first-class items in one coherent layout.

This is a prototype for review and as a spec for engineering, not the final
integration. All data is in-memory; there is no backend.

## Run

```bash
npm install
npm run dev      # start the dev server (Vite)
npm run build    # type-check and build for production
npm run preview  # preview the production build
```

## What is in scope

- One responsive list / home holding all three learning types equally.
- Cards with a shared status model: Not Started, In Progress, Completed.
- Case study cards are visually distinct (badge, tertiary gradient strip,
  coloured border) and carry a subject tag, a difficulty chip, and an
  approximate duration chip.
- Course cards carry their own metadata (chapter progress, audience), no
  difficulty or duration.
- Card primary actions: "View Case" for case studies and an open / continue /
  review action for courses. Actions are stubbed (`console.log`) because the
  pre-session modal and downstream screens are separate, not-yet-built briefs.
- Optional filter by type and sort, since it fit naturally.
- All screen states built in: Loading (skeleton), Empty, Error (with retry),
  and a first-class mobile / tablet layout.

## Reviewing the states

A prototype-only "Preview" control is pinned to the bottom of the screen.
Use it to switch between Ready, Loading, Empty, and Error without editing code.
It is not part of the production screen.

## Theme and fonts

The design tokens in `src/index.css` (`:root`) are the live Talk & Learn
tokens, wired into Tailwind via `tailwind.config.js`. Primary action colour is
turquoise; destructive actions use the destructive red.

Headings use Montserrat and body text uses Open Sans, both from Google Fonts.
Proxima Nova is a paid font and is not loaded here; body text falls back to
Open Sans. In the real repo Proxima Nova is licensed and loaded.

## Notes

- British English spelling, Indian context throughout, no em-dashes.
- Sample content uses the real GSL catalogue. A couple of items are clearly
  flagged as placeholders, only to round out the grid.

## Out of scope

The pre-session modal, the reading / discussion / evaluation session, the
report, the dashboard, and all backend (auth, persistence, voice, the AI
moderator).
