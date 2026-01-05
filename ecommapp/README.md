# ecommapp — Simple README

Minimal React app built with Vite. This README shows how to run locally, build for production, and deploy to Vercel.

## Quick start

Install dependencies and run the dev server:

```bash
cd ecommapp
npm install
npm run dev
```

Open http://localhost:5173

## Useful scripts

- `npm run dev` — start dev server
- `npm run build` — build production files into `dist`
- `npm run preview` — preview the built app locally

## Build & serve locally

```bash
cd ecommapp
npm run build
npx serve dist
# open http://localhost:3000
```

## Vercel deployment (recommended settings)

If your Vercel deployment returns 404 pages, ensure the Vercel project is configured to build the `ecommapp` folder and serve the `dist` output.

- **Root Directory**: `ecommapp`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

Notes:
- This project uses client-side routing. A safe in-app fallback (already applied) is to use `HashRouter` in `src/App.jsx`, which avoids server rewrite issues. If you keep `BrowserRouter`, make sure Vercel rewrites all routes to `index.html` or use `vercel.json`/redirects.

## Where to look

- Main entry: `src/main.jsx`
- App router: `src/App.jsx`
- Components: `src/components/`

---
If you'd like, I can revert to `BrowserRouter` after you confirm Vercel is pointed at `ecommapp`, or I can add a short deploy checklist file for Vercel.

## Vercel deployment (recommended settings)

If you deploy this project to Vercel and you see a 404, ensure Vercel builds the `ecommapp` subfolder and serves the `dist` output. Use these settings in the Vercel project configuration:

- **Root Directory**: `ecommapp`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

To validate locally:
```bash
cd ecommapp
npm install
npm run build
npx serve dist
# then open http://localhost:3000
```

If you prefer not to change Vercel settings, a fallback in-app fix is to use `HashRouter` instead of `BrowserRouter` in `src/App.jsx` (already applied in this repo). `HashRouter` avoids server-side rewrites by keeping routes after `#` in the client.
