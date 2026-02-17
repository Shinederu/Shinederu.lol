# Site Principal - Shinederu

Frontend principal (React 18 + TypeScript + Vite + Tailwind).

## Prerequis

- Node.js 20+
- npm 10+

## Installation

```bash
npm install
```

## Lancement

```bash
npm run dev
```

## Build production

```bash
npm run build
npm run preview
```

## Variables d'environnement

Fichier: `.env` (dev) et `.env.production` (prod)

- `VITE_DEV_MODE`
- `VITE_SHINEDERU_VERSION`
- `VITE_SHINEDERU_API_AUTH_URL`
- `VITE_TWITCH_CHANNEL_LINK`
- `VITE_YOUTUBE_CHANNEL_LINK`
- `VITE_DISCORD_INVITE`

## Authentification

Le site utilise maintenant la nouvelle couche partagee:

- `@shinederu/auth-core`
- `@shinederu/auth-react`

Avec une integration locale workspace via:

- `src/shared/auth/client.ts`
- `src/shared/context/AuthContext.tsx`

## Notes

- Le design est optimise desktop/mobile.
- Les modales globales restent gerees localement (`ModalContext`).
