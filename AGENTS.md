# AGENTS - App-ShinedeHub

Projet courant: **ShinedeHub**, frontend principal servi sur
`https://shinederu.ch/`.

Avant toute modification:

1. Lire `P:\AGENTS.md`, `P:\ECOSYSTEM.md`, puis ce README.
2. Lire `REPRISE.md` si la tache touche l'auth, `/users`, `/permissions`, les
   annonces ou le deploiement.
3. Travailler dans `P:\DEV\GitHub\App-ShinedeHub` et pousser sur `main`.

Regles locales:

- Garder le nom projet `ShinedeHub`.
- Garder le runtime public `P:\PROD\ShinedeHub`.
- Utiliser les variables `VITE_SHINEDEHUB_*`; les anciens `VITE_SHINEDERU_*`
  ne sont que des fallbacks de transition.
- Ne jamais deployer `.git`, `node_modules`, sources TS, configs dev, docs,
  caches, tests ou secrets vers `P:\PROD\ShinedeHub`.
- Deployer uniquement le contenu de `dist/` apres `npm run build`.
- Les commandes metier passent par les APIs proprietaires sous
  `https://api.shinederu.ch/`.
