# ShinedeHub

Frontend principal de l'ecosysteme Shinede, expose sur `https://shinederu.ch/`.
Le projet a ete renomme **ShinedeHub**; le chemin runtime de production est
`P:\PROD\ShinedeHub`.

## Role

ShinedeHub sert de portail public et d'interface admin:

- accueil, chaines, communaute et page "A propos";
- authentification commune via `Module-Auth-API`;
- dashboard utilisateur/admin;
- annuaire et management leger des comptes;
- gestion des annonces;
- gestion des permissions centralisees via `/permissions`;
- tuiles vers MelodyQuest et ShinedeWake.

## Repo et deploiement

- Source: `P:\DEV\GitHub\App-ShinedeHub`
- Remote: `https://github.com/Shinederu/App-ShinedeHub.git`
- Build local: `P:\DEV\GitHub\App-ShinedeHub\dist`
- Runtime production: `P:\PROD\ShinedeHub`
- URL publique: `https://shinederu.ch/`

La production ne doit recevoir que le contenu de `dist/`: `index.html`, `assets/`
et les ressources publiques necessaires. Ne pas copier `.git`, `node_modules`,
sources TypeScript, fichiers de config dev, caches, tests, brouillons ou secrets.

## Endpoints

Le frontend consomme uniquement les APIs publiques sous `api.shinederu.ch`:

- Auth: `https://api.shinederu.ch/auth/`
- Site principal: `https://api.shinederu.ch/main-site/`

Les endpoints backend sont documentes dans:

- `P:\DEV\GitHub\Module-Auth-API\README.md`
- `P:\DEV\GitHub\App-ShinedeHub-API\README.md`
- `P:\DEV\GitHub\Module-ShinedeCore-PHP\README.md`

## Authentification et permissions

Le site utilise les modules partages:

- `@shinederu/auth-core`
- `@shinederu/auth-react`

Aliases locaux dans `vite.config.ts`:

- `@shinederu/auth-core` -> `../Module-Auth-Core/src/index.ts`
- `@shinederu/auth-react` -> `../Module-Auth-React/src/index.ts`

Permissions stables utilisees:

- `auth.users.manage`: acces `/users` et actions admin utilisateurs;
- `main.announcements.manage`: acces `/announcements`;
- `core.super_admin`: acces `/permissions`.

Les roles se gerent dans `/permissions`; la page `/users` ne modifie que le
pseudo, l'avatar et le blocage/deblocage d'un compte.

## Base de donnees

Le frontend n'accede jamais directement a la base. Les tables concernees cote API
sont documentees dans les repos backend:

- `users`, `auth_*` via `Module-Auth-API`;
- `core_*` via `Module-ShinedeCore-PHP`;
- `main_announcements` via `App-ShinedeHub-API`.

Schema partage: `ShinedeCore`.

## Dossiers runtime et fichiers partages

ShinedeHub n'a pas de stockage persistant propre. Les avatars, sessions,
annonces et permissions passent par les APIs proprietaires.

Le dossier `P:\PROD\ShinedeHub` est public et ne doit contenir aucun secret ni
source de developpement.

## Temps reel et evenements

Aucun flux Mercure n'est consomme ou publie par ShinedeHub actuellement.
Si un futur panneau temps reel est ajoute, la commande metier doit passer par
l'API proprietaire, et Mercure ne doit servir qu'aux evenements/snapshots avec
resynchronisation HTTP possible.

## Dependances inter-projets

- `Module-Auth-API`: login/register/session/profil/utilisateurs/permissions;
- `Module-ShinedeCore-PHP`: modele de droits `core_*`;
- `App-ShinedeHub-API`: annonces du site principal;
- `Module-Auth-Core` et `Module-Auth-React`: client auth frontend;
- MelodyQuest et ShinedeWake sont uniquement lies par tuiles externes.

## Configuration

Fichiers suivis: `.env` et `.env.production`, uniquement avec des valeurs Vite
publiques. Ne pas y ajouter de secret.

Variables principales:

- `VITE_DEV_MODE`
- `VITE_SHINEDEHUB_VERSION`
- `VITE_SHINEDEHUB_API_AUTH_URL`
- `VITE_SHINEDEHUB_API_MAIN_SITE_URL`
- `VITE_TWITCH_CHANNEL_LINK`
- `VITE_YOUTUBE_CHANNEL_LINK`
- `VITE_YOUTUBE_CHANNEL_ID`
- `VITE_YOUTUBE_API_KEY` (cle publique embarquee cote navigateur)
- `VITE_DISCORD_INVITE`

Les anciens noms `VITE_SHINEDERU_*` restent lus en fallback par compatibilite,
mais les nouvelles configurations doivent utiliser `VITE_SHINEDEHUB_*`.

## Verifications

```powershell
cd P:\DEV\GitHub\App-ShinedeHub
npm run build
npm run lint
```

`npm run lint` doit passer sans erreur ni warning bloquant.

Smoke public apres deploiement:

```powershell
Invoke-WebRequest -Uri 'https://shinederu.ch/' -UseBasicParsing -TimeoutSec 20
Invoke-WebRequest -Uri 'https://api.shinederu.ch/auth/?action=listUsers' -UseBasicParsing -TimeoutSec 20
Invoke-WebRequest -Uri 'https://api.shinederu.ch/main-site/?action=listPublicAnnouncements' -UseBasicParsing -TimeoutSec 20
```

## Deploiement

```powershell
cd P:\DEV\GitHub\App-ShinedeHub
npm run build
Copy-Item -LiteralPath 'P:\DEV\GitHub\App-ShinedeHub\dist\index.html' -Destination 'P:\PROD\ShinedeHub\index.html' -Force
Copy-Item -LiteralPath 'P:\DEV\GitHub\App-ShinedeHub\dist\assets' -Destination 'P:\PROD\ShinedeHub' -Recurse -Force
Copy-Item -LiteralPath 'P:\DEV\GitHub\App-ShinedeHub\dist\img' -Destination 'P:\PROD\ShinedeHub' -Recurse -Force
```

Avant tout nettoyage d'anciens assets dans `P:\PROD\ShinedeHub\assets`, verifier
ce que reference le `index.html` deploye.

## Notes de reprise

Lire `REPRISE.md` avant une reprise froide. Il contient l'historique fonctionnel,
les scenarios manuels, les migrations appliquees et les limites connues.
