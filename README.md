# GoEats - Chennai Cloud Kitchen (Vite + React + Netlify Functions)

This repository is a minimal Cloud Kitchen demo focused on Chennai delivery. It uses a React frontend (Vite) and Node-based Netlify Functions for backend APIs. The project is scaffolded to deploy easily to a free Netlify account.

Structure
- `frontend/` - Vite + React app (pages: Home, Menu, Cart, Checkout)
- `functions/` - Netlify Functions (menu and orders)
- `netlify.toml` - Netlify build/deploy config

Quick local dev
1. Install Node 18+ and npm.
2. From project root, install dependencies for frontend and functions:

```powershell
cd frontend; npm install
cd ../functions; npm install
```

3. Run the frontend dev server:

```powershell
cd frontend
npm run dev
```

4. Optionally install and run Netlify CLI to run functions locally:

```powershell
npm i -g netlify-cli
netlify dev
```

Deploy to Netlify (free account)
1. Create a new site on Netlify and connect your git repository (GitHub/GitLab/Bitbucket).
2. Set the build command to `npm run build --prefix frontend`, publish directory to `frontend/dist` and functions directory to `functions` (these are set in `netlify.toml`).
3. Trigger a deploy. Netlify will run installs and build the Vite app and deploy functions automatically.

Netlify UI checklist (use exactly these settings if Netlify doesn't auto-detect):
- Build command: npm run install:all && npm run build --prefix frontend
- Publish directory: frontend/dist
- Functions directory: functions
- Environment (optional): set NODE_VERSION = 18 in Site settings > Environment variables if you want to pin Node.

Troubleshooting
- Build fails with "command not found" for 'vite' or similar: ensure you ran `npm run install:all` locally or let Netlify install by connecting the repo. Netlify runs the build command from the repo root — our build command installs frontend and functions deps first.
- CSS/Tailwind not applied: confirm `tailwindcss`, `postcss`, and `autoprefixer` are installed in `frontend/` (they're declared in `frontend/package.json`) and that `index.css` includes the `@tailwind` directives.
- Functions returning 500 or unable to write to `orders.json`: Netlify function instances have ephemeral filesystems. The demo writes to `functions/data/orders.json` for local testing only. For production persistence, use a hosted DB (Supabase, Firebase, etc.).
- If the menu doesn't load in the deployed site, open browser DevTools and check the network request to `/.netlify/functions/menu` — Netlify proxies functions under `/.netlify/functions/*`.

Quick deploy steps (recap)
1. Push this repository to GitHub (or other supported Git provider).
2. In Netlify, choose "Import from Git" and select this repo.
3. Confirm the Build command and Publish directory match the Netlify UI checklist above.
4. Deploy and open the site URL Netlify provides.

Notes
- This demo uses a simple JSON file for orders persistence inside `functions/data` — this is fine for demo but not for production.
- The APIs enforce Chennai-only orders (city must be `Chennai`).

Next steps / Improvements
- Add a persistent DB (Supabase / Firebase) for orders and menu.
- Add payment gateway integration.
- Add authentication and admin dashboard for managing menu and orders.
