# MatPort (Next.js migration)

This folder is a Next.js **App Router** version of your Vite project.

## Routes migrated 1:1
- `/` (Home)
- `/search`
- `/product`
- `/list-item`
- `/dashboard`
- `/login`
- `/register`

## Run locally
```bash
npm install
npm run dev
```

## Notes
- React Router was removed; Next file-based routing is used.
- Header/Footer live in `src/app/layout.tsx` so pages don't duplicate them.
- Tailwind is installed normally (not via CDN). Your colors/fonts from the old `index.html` Tailwind config are in `tailwind.config.ts`.
- Google Fonts + Material Symbols are included in `src/app/layout.tsx`.
