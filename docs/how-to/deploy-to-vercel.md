# How to deploy to Vercel

*The site is a static single-page app; nothing here needs a server.*

## Prerequisites

- The project builds locally: `npm run build` produces `dist/`.
- A free Vercel account.

## Option A — Git integration (recommended)

1. Push the project to a Git repository (GitHub, GitLab or Bitbucket).
2. In Vercel: **Add New → Project**, import the repository.
3. Vercel auto-detects Vite. Confirm the defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy. Every push to the default branch redeploys automatically.

## Option B — CLI, no repository

```bash
npm install -g vercel
vercel          # first run: link/create the project, accept the Vite defaults
vercel --prod   # promote to production
```

## The SPA fallback

Client-side routing means `/tutorial` must serve `index.html`. The repo's `vercel.json`
handles it:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Keep this file at the project root. Without it, deep links and refreshes on `/tutorial`
return 404.

## Verify the deployment

- `https://<your-app>.vercel.app/` — the report renders, opening on Email Overview.
- `https://<your-app>.vercel.app/tutorial` — loads **directly** (this proves the fallback
  works), starting blank with the coach card visible.
- Save a bookmark, refresh — it persists (localStorage is per-browser; there's no account).

## Other static hosts

Anything that serves `dist/` with an SPA fallback works the same way — for example,
Netlify expects a `_redirects` file containing `/* /index.html 200`.
