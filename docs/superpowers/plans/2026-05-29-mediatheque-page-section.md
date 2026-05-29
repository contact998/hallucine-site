# Restructuration média page/section — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Faire de `media_library` la source unique des photos du site, organisée par `page`/`section`, et supprimer les ~170 URLs R2 codées en dur.

**Architecture:** Un registre partagé (`shared/mediaPages.ts`) définit pages et sections. Colonnes additives `page`/`section` sur `media_library`. Migration idempotente backfill + réconciliation des URLs hardcodées. Hook `useMediaByPage`. Pages câblées par lots avec vérif visuelle. Médiathèque admin regroupée par page→section.

**Tech Stack:** React 18 + Vite + wouter, tRPC v11, Drizzle ORM + MySQL (Railway), R2, sharp. Vérification = `tsc --noEmit` + aperçu local (preview_start + bypass rideau `sessionStorage curtain_seen`).

**Vérification dans ce codebase :** pas de tests unitaires sur les pages ; la vérification se fait par typecheck + rendu réel dans l'aperçu (DOM/console/capture). Les tâches utilisent donc « vérifier en aperçu » comme équivalent du test, conformément aux pratiques du projet.

---

## Phase 0 — Préparation

### Task 0: Branche de travail

**Files:** —

- [ ] **Step 1: Créer une branche dédiée**

```bash
cd /Users/chesneaudanielmarcel/hallucine-site
git checkout -b restructure-media-page-section
```

- [ ] **Step 2: Sauvegarde de la table média (sécurité avant migration prod)**

```bash
# Dump de media_library uniquement, daté, hors repo
node scripts/dump-media.mjs > "/tmp/media_library-backup-$(git rev-parse --short HEAD).json" 2>/dev/null || \
  echo "dump-media.mjs indisponible — voir Task 3 pour un dump SQL avant migration réelle"
```

---

## Phase 1 — Fondations (aucun changement visible sur le site)

### Task 1: Registre des pages et sections

**Files:**
- Create: `shared/mediaPages.ts`

- [ ] **Step 1: Écrire le registre**

Source de vérité commune (site + admin + migration). Chaque page = un slug stable, un libellé FR, et ses sections ordonnées.

```ts
// shared/mediaPages.ts
export interface MediaSection { key: string; label: string }
export interface MediaPage { key: string; label: string; sections: MediaSection[] }

export const MEDIA_PAGES: MediaPage[] = [
  { key: "accueil", label: "Accueil", sections: [
    { key: "produits", label: "Produits en vedette" },
    { key: "realisations", label: "Réalisations" },
    { key: "histoire", label: "Notre histoire" },
    { key: "cinema", label: "Cinéma / ambiance" },
    { key: "techno", label: "Technologie" },
  ]},
  { key: "ecran-geant",      label: "Écran Géant",        sections: [{ key: "galerie", label: "Galerie" }, { key: "bandeau", label: "Bandeau" }] },
  { key: "ecran-etanche",    label: "Écran Étanche",      sections: [{ key: "galerie", label: "Galerie" }, { key: "bandeau", label: "Bandeau" }] },
  { key: "ecran-economique", label: "Écran Économique",   sections: [{ key: "galerie", label: "Galerie" }, { key: "bandeau", label: "Bandeau" }] },
  { key: "ecrans-led",       label: "Écrans LED",         sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "arches",           label: "Arches gonflables",  sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "mobilier",         label: "Mobilier",           sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "accessoires",      label: "Accessoires",        sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "tente-x",          label: "Tente X",            sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "tente-n",          label: "Tente N",            sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "tente-v",          label: "Tente V",            sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "tente-araignee",   label: "Tente Araignée",     sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "galerie",          label: "Galerie",            sections: [{ key: "principale", label: "Galerie principale" }] },
  { key: "histoire",         label: "Histoire",           sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "mode-emploi",      label: "Mode d'emploi",      sections: [{ key: "etapes", label: "Étapes" }] },
  { key: "cas-velodrome",    label: "Cas — Vélodrome",    sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "cas-oran",         label: "Cas — Oran",         sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "drive-in",         label: "Drive-in",           sections: [{ key: "galerie", label: "Galerie" }] },
  { key: "a-propos",         label: "À propos",           sections: [{ key: "galerie", label: "Galerie" }] },
];

export const MEDIA_PAGE_KEYS = MEDIA_PAGES.map(p => p.key);
export function pageLabel(key: string) { return MEDIA_PAGES.find(p => p.key === key)?.label ?? key; }
```

- [ ] **Step 2: Vérifier le typecheck**

Run: `npx tsc --noEmit`
Expected: EXIT 0

- [ ] **Step 3: Commit**

```bash
git add shared/mediaPages.ts
git commit -m "feat(media): registre partagé pages/sections"
```

---

### Task 2: Colonnes `page`/`section` sur `media_library`

**Files:**
- Modify: `drizzle/schema.ts` (table `mediaLibrary`)
- Create: migration Drizzle (via `drizzle-kit generate`)

- [ ] **Step 1: Ajouter les colonnes au schéma Drizzle**

Dans `drizzle/schema.ts`, table `mediaLibrary`, ajouter après `subcategory` :

```ts
page:    varchar("page", { length: 40 }),
section: varchar("section", { length: 40 }),
```

- [ ] **Step 2: Générer la migration**

Run: `npx drizzle-kit generate`
Expected: un fichier SQL `ALTER TABLE media_library ADD COLUMN page ...` dans `drizzle/`

- [ ] **Step 3: Appliquer en base (dry d'abord via lecture du SQL généré)**

Lire le SQL généré, vérifier qu'il est purement additif (ADD COLUMN, nullable). Puis :
Run: `npx drizzle-kit migrate`
Expected: colonnes ajoutées, aucune donnée touchée.

- [ ] **Step 4: Vérifier**

```bash
node -e "import('mysql2/promise').then(async m=>{const {readFileSync}=await import('fs');for(const l of readFileSync('.env.local','utf8').split('\n')){const i=l.indexOf('=');if(i>0)process.env[l.slice(0,i).trim()]??=l.slice(i+1).trim().replace(/^[\"']|[\"']$/g,'')}const d=await m.createConnection({uri:process.env.DATABASE_URL});const[r]=await d.execute(\"SHOW COLUMNS FROM media_library LIKE 'page'\");console.log(r);await d.end()})"
```
Expected: la colonne `page` existe.

- [ ] **Step 5: Commit**

```bash
git add drizzle/schema.ts drizzle/
git commit -m "feat(media): colonnes page/section (additif)"
```

---

### Task 3: Migration des données (backfill + réconciliation)

**Files:**
- Create: `scripts/migrate-media-pages.mjs`

- [ ] **Step 1: Écrire le script de backfill `(category,subcategory) → (page,section)`**

Le script charge `.env.local`, supporte `--dry-run`, et applique le mapping ci-dessous. Mapping (à inscrire en dur dans le script, dérivé de l'inventaire réel) :

```
realisations/*                  -> accueil / realisations
produits/home                   -> accueil / produits
ui/story                        -> accueil / histoire
ui/cinema                       -> accueil / cinema
ui/technology                   -> accueil / techno
ui/histoire                     -> histoire / galerie
ui/mode-emploi                  -> mode-emploi / etapes
galerie/*                       -> galerie / principale
produits/ecran-geant            -> ecran-geant / galerie
produits/ecran-etanche          -> ecran-etanche / galerie
produits/ecran-economique       -> ecran-economique / galerie
produits/ecrans-led             -> ecrans-led / galerie
produits/arches-gonflables      -> arches / galerie
produits/mobilier               -> mobilier / galerie
produits/accessoires            -> accessoires / galerie
produits/tente-x|n|v|araignee   -> tente-x|n|v|araignee / galerie
```
Les lignes non mappées (`produits` sans sous-cat, `produits/tentes`, `autre`, `ui/related`, `og/home`) → `page = NULL` (groupe « À ranger » en admin).

- [ ] **Step 2: Dry-run et audit**

Run: `node scripts/migrate-media-pages.mjs --dry-run`
Expected: liste « id → (page,section) » pour chaque ligne ; compter combien restent `NULL`. Vérifier qu'aucune page attendue n'est vide.

- [ ] **Step 3: Migration réelle**

Run: `node scripts/migrate-media-pages.mjs`
Expected: toutes les lignes mappées ont `page`/`section` ; le reste en `NULL`.

- [ ] **Step 4: Réconciliation des URLs hardcodées (audit séparé)**

Écrire dans le même script un mode `--audit-hardcoded` qui lit les URLs `r2.dev/assets/` présentes dans `client/src/pages/*.tsx` et liste celles **absentes** de `media_library`. Sortie = liste à insérer (URL + alt extrait du code + page déduite du fichier). Ne PAS insérer automatiquement en Phase 1 ; l'insertion se fait page par page en Phase 2 (l'alt du code fait foi).

Run: `node scripts/migrate-media-pages.mjs --audit-hardcoded`
Expected: tableau par page des URLs manquantes en base.

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate-media-pages.mjs
git commit -m "feat(media): script migration page/section + audit hardcodé"
```

---

### Task 4: Hook `useMediaByPage`

**Files:**
- Modify: `client/src/hooks/useMediaByCategory.ts` (ajouter `useMediaByPage`)
- Modify: `server/routers/adminMedia.ts` (procédure publique `byPage`)
- Modify: `server/.../media router` (exposer `byPage`)

- [ ] **Step 1: Ajouter la procédure tRPC `media.byPage`**

Sur le modèle de `byCategory`, une procédure publique `byPage` qui prend `{ page: string, section?: string }` et renvoie les lignes `active` triées `sortOrder asc`, via une fonction `getMediaByPage(page, section)` (calquée sur `getMediaByCategory`).

- [ ] **Step 2: Ajouter le hook `useMediaByPage(page, section?, fallback)`**

Calqué sur `useMediaByCategory` (même mécanisme SSR-baké/fallback). Signature :
```ts
export function useMediaByPage(page: string, section: string | undefined, fallback: MediaImage[]): MediaImage[]
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: EXIT 0

- [ ] **Step 4: Vérifier en aperçu que `byPage` répond**

Démarrer l'aperçu (preview_start `hallucine-site`), puis :
`curl 'http://localhost:3000/api/trpc/media.byPage?input=%7B%22json%22%3A%7B%22page%22%3A%22ecran-geant%22%2C%22section%22%3A%22galerie%22%7D%7D'`
Expected: JSON avec les photos de la page.

- [ ] **Step 5: Commit**

```bash
git add client/src/hooks/useMediaByCategory.ts server/routers/adminMedia.ts server/routers/*.ts
git commit -m "feat(media): hook et endpoint byPage"
```

---

### Task 5: Médiathèque admin regroupée par page → section

**Files:**
- Modify: `client/src/pages/AdminMedia.tsx`

- [ ] **Step 1: Remplacer le filtre par catégorie par un regroupement par page**

Utiliser `MEDIA_PAGES` pour afficher des groupes repliables (page → sections). La requête existante `media.list` (activeOnly:false) est conservée ; le regroupement se fait côté client sur `item.page`/`item.section`. Les items `page = NULL` vont dans un groupe « À ranger ».

- [ ] **Step 2: Édition d'un média = champs `page`/`section`**

Dans le panneau d'édition, remplacer (ou compléter) catégorie/sous-catégorie par deux sélecteurs `page` (liste `MEDIA_PAGES`) et `section` (sections de la page choisie). La mutation `media.update` doit accepter `page`/`section`.

- [ ] **Step 3: Typecheck + aperçu**

Run: `npx tsc --noEmit` (EXIT 0). Puis ouvrir `/admin/media` en aperçu : vérifier les groupes par page, le groupe « À ranger », et qu'un changement de page/section déplace bien la photo de groupe.

- [ ] **Step 4: Commit**

```bash
git add client/src/pages/AdminMedia.tsx server/routers/adminMedia.ts
git commit -m "feat(admin): médiathèque regroupée par page/section"
```

**Fin de Phase 1 : le site est inchangé visuellement, l'admin est désormais lisible par page.**

---

## Phase 2 — Câblage des pages (par lots, vérif visuelle de chacune)

**Recette commune (à appliquer à chaque page) :**
1. Repérer le tableau d'URLs R2 en dur de la page.
2. Lancer `node scripts/migrate-media-pages.mjs --audit-hardcoded` : pour chaque URL absente de la base, l'insérer avec `(page,section)` correct et l'`alt` repris du code.
3. Remplacer le tableau en dur par `const photos = useMediaByPage("<page>", "<section>", FALLBACK)` (le `FALLBACK` = l'ancien tableau, conservé comme filet).
4. `npx tsc --noEmit` (EXIT 0).
5. Aperçu de la page (bypass rideau) : comparer visuellement à l'avant — mêmes photos, même ordre, 0 erreur console.
6. Commit `feat(<page>): photos pilotées par la médiathèque`.

**Lot A — Pages produits :**
- [ ] Task 6: `EcranGeant.tsx` (page `ecran-geant`, section `galerie`, 15 URLs)
- [ ] Task 7: `EcranEconomique.tsx` (page `ecran-economique`, 17 URLs)
- [ ] Task 8: `EcranEtanche.tsx` (page `ecran-etanche`)
- [ ] Task 9: `EcransLED.tsx` (page `ecrans-led`)
- [ ] Task 10: `Mobilier.tsx` (page `mobilier`)
- [ ] Task 11: `Accessoires.tsx` (page `accessoires`)
- [ ] Task 12: `ProductsSection.tsx` (page `accueil`, section `produits`)

**Lot B — Tentes :**
- [ ] Task 13: `TentesX.tsx` / `TentesN.tsx` / `TentesV.tsx` / `TentesAraignees.tsx`

**Lot C — Éditoriales :**
- [ ] Task 14: `ModeEmploi.tsx` (page `mode-emploi`, 13 URLs)
- [ ] Task 15: `Histoire.tsx` (page `histoire`, 9 URLs)
- [ ] Task 16: `CasVelodrome.tsx`, `CasOran.tsx`, `DriveIn.tsx`, `Ecrans.tsx`, `EtudesCas.tsx`
- [ ] Task 17: `Galerie.tsx` — migrer son `useMediaByCategory("galerie")` vers `useMediaByPage("galerie","principale")`

Après chaque lot : déploiement possible (le prerender re-bake la base) + vérif prod.

---

## Phase 3 — Nettoyage

- [ ] Task 18: Supprimer les tableaux d'URLs morts devenus inutiles dans les pages migrées (garder uniquement les `FALLBACK` réduits si nécessaires).
- [ ] Task 19: Une fois toutes les pages migrées et vérifiées en prod, déprécier `category`/`subcategory` : d'abord cesser de les lire, puis (étape finale, séparée) supprimer les colonnes via une migration Drizzle dédiée.
- [ ] Task 20: Merge de la branche `restructure-media-page-section` vers `main` une fois la Phase 2 validée.

---

## Self-review (couverture spec)

- Modèle page/section → Task 1 (registre), Task 2 (schéma). ✓
- Migration backfill + réconciliation hardcodé → Task 3. ✓
- Hook lecture site → Task 4. ✓
- Médiathèque par page → Task 5. ✓
- Câblage des ~25 pages, fallback conservé, vérif par page → Phase 2. ✓
- Nettoyage + suppression colonnes en fin → Phase 3. ✓
- Risque site live → bascule par lots + vérif visuelle + fallback (Phase 2). ✓
