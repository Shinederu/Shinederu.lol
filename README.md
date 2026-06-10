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
- `VITE_SHINEDERU_API_MAIN_SITE_URL`
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

Le modal Connexion/Inscription soumet les formulaires au clavier: appuyer sur `Enter` dans les champs login/password ou inscription declenche le meme traitement que le bouton correspondant.
Les pseudos doivent faire entre 4 et 24 caracteres. La limite est appliquee dans le formulaire d'inscription, la page Profil et l'API Auth.

## Dashboard admin

Le dashboard expose des tuiles selon les droits renvoyes par `auth?action=me`:

- `Utilisateurs`: visible avec le droit backend `auth.users.manage` expose au frontend via `auth.users_manage`, ou super-admin global. La page `/users` sert d'annuaire des comptes: recherche, etat de verification email, compteurs et apercu des roles projets centralises. Les modifications de roles se font dans `/permissions`.
- `Annonces`: visible avec le droit backend `main.announcements.manage` expose au frontend via `main.announcements_manage`, ou super-admin global.
- `Permissions`: visible uniquement pour les super-admins, route `/permissions`.
- `MelodyQuest`: tuile active vers `https://melodyquest.shinederu.ch/#/main`.
- `ShinedeWake`: tuile active vers `https://wake.shinederu.ch/`.

Le panneau `/permissions` administre les tables `core_*`: projets, roles, permissions, liens role-permission et assignations utilisateur.
Les routes projet conservent `/core-access` comme redirection de compatibilite vers `/permissions`.

## Notes

- Le design est optimise desktop/mobile.
- Les modales globales restent gerees localement (`ModalContext`).
