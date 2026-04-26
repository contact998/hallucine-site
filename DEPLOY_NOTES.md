# Règles de déploiement — hallucine-site

## ⚠️ RÈGLE CRITIQUE — À RESPECTER À CHAQUE SESSION

**Après chaque correction ou checkpoint Manus, TOUJOURS exécuter :**

```bash
git push github main
```

### Pourquoi c'est obligatoire

- Le checkpoint Manus pousse vers `origin` (stockage S3 interne Manus)
- Railway est connecté à **GitHub** (`github` remote), pas à Manus S3
- Sans ce push, Railway ne voit pas les nouvelles corrections et continue de tourner sur l'ancien code
- Ce problème a causé le noindex persistant en production (avril 2026)

### Remotes configurés

| Remote | URL | Usage |
|---|---|---|
| `origin` | s3://vida-prod-gitrepo/... | Stockage Manus (checkpoints) |
| `github` | https://github.com/contact998/hallucine-site.git | Railway autodeploy |

### Workflow complet à chaque fin de session

1. `webdev_save_checkpoint` → pousse vers Manus S3
2. `git push github main` → déclenche Railway autodeploy
3. Vérifier dans Railway Dashboard que le build démarre

## Architecture Railway

- Builder : Railpack (Node.js détecté via package.json + pnpm-lock.yaml)
- Build command : `pnpm build` (build:client + build:server + build:ssr)
- Start command : `node dist/index.js` (Express)
- **ATTENTION** : si Railway bascule en mode SPA/Caddy, ajouter `RAILPACK_NO_SPA=1` en variable d'env
