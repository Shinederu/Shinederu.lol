# Site Principal - Shinederu

Application front-end React/Vite principale du projet.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Configuration

Variables attendues dans `.env` / `.env.production`:

- `VITE_DEV_MODE`
- `VITE_SHINEDERU_VERSION`
- `VITE_SHINEDERU_API_AUTH_URL`
- `VITE_TWITCH_CHANNEL_LINK`
- `VITE_YOUTUBE_CHANNEL_LINK`
- `VITE_DISCORD_INVITE`

## Note

La logique d'authentification est en cours d'externalisation vers:

- `@shinederu/auth-core`
- `@shinederu/auth-react`
