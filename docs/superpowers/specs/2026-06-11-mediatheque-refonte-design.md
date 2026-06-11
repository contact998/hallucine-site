# Refonte complète de la médiathèque — Bibliothèque + Emplacements

Date : 2026-06-11
Statut : spec à valider
Nature : **refonte entière**, pas une migration incrémentale. Les trois systèmes média actuels sont supprimés et remplacés par un seul.

## Ce qu'on jette

1. **`media_library` avec `page`/`section`/`category`/`subcategory` dessus** : l'image et son emplacement sont la même ligne → une image ne vit qu'à un endroit, impossible à réutiliser, « déplacer » = éditer la fiche.
2. **L'admin média actuel** (`AdminMedia.tsx` + l'ébauche `AdminMediaV2`) rangé selon l'arbre page→section : aucun « fond » lisible.
3. **Le blog en URL-texte** : `blog_posts.imageUrl` est une chaîne libre, déconnectée de la médiathèque.
4. **Les ~170 URLs R2 codées en dur** dans les pages + les `FALLBACK_PHOTOS`, et les hooks `useMediaByPage` / `useMediaByCategory`.

Rien de tout ça ne survit à la refonte.

## Principe unique

Deux notions, séparées proprement :

- **La Bibliothèque** = le **fond d'images** unique, alimenté par upload. Une image = un fichier + ses métadonnées (alt, titre, tags, dimensions). Elle ne « sait » pas où elle est utilisée.
- **Les Emplacements** = les endroits du site qui **affichent** des images. Un emplacement pioche dans le fond. Deux types : *simple* (1 image : bandeau, couverture d'article) ou *galerie* (N images ordonnées).

Une même image est réutilisable dans plusieurs emplacements sans duplication. Changer une image = re-piocher. Déplacer dans une galerie = réordonner.

## Modèle de données (nouveau, propre)

### `assets` (le fond) — table réécrite
`id`, `r2_key`, `url`, `filename`, `alt`, `title`, `tags` (json), `width`, `height`, `filesize`, `mime`, `source`, `created_at`, `active`.
→ C'est l'ancien `media_library` **débarrassé** de `page`, `section`, `category`, `subcategory`, `sort_order`.

### `slots` — registre en code (`shared/slots.ts`), pas une table
Source de vérité unique listant **tous** les emplacements nommés du site, typés et groupés par page :
```
{ key: "accueil:bandeau",      kind: "single",  label: "Accueil — bandeau" }
{ key: "ecran-geant:galerie",  kind: "gallery", label: "Écran géant — galerie" }
{ key: "blog:cover",           kind: "single",  label: "Blog — couverture (par article)", perEntity: true }
```
Remplace `shared/mediaPages.ts`. C'est ce registre qui pilote l'écran « Emplacements » de l'admin et la lecture côté site — donc plus rien n'est implicite.

### `placements` (DB) — **la seule table nouvelle**
`id`, `slot_key`, `entity_id` (null sauf slots `perEntity`, ex. id d'article blog), `asset_id`, `sort_order`.
- emplacement simple → au plus 1 ligne pour `(slot_key, entity_id)`.
- galerie → N lignes ordonnées par `sort_order`.
- une image (`asset_id`) peut apparaître dans plusieurs placements → réutilisation native.

## Lecture côté site

- Nouveaux hooks : `useSlot(key, entityId?)` → 1 asset ; `useGallery(key)` → asset[] ordonné. Même mécanisme SSR-baké qu'aujourd'hui (le prerender lit les placements).
- **Suppression** de `useMediaByPage`, `useMediaByCategory`, de tous les tableaux d'URLs en dur et des `FALLBACK_PHOTOS` pilotes. Chaque endroit du site lit son `slot_key`.
- Objectif tenu : **zéro URL R2 en dur** pilotant un rendu.

## Admin (reconstruit dans `admin-v2` / Refine)

Un seul module média, deux écrans, qui remplacent `AdminMedia.tsx` **et** `AdminMediaV2` :

1. **Bibliothèque** : grille à plat de tous les `assets`. Upload (compression à l'upload), recherche, édition alt/titre/tags, suppression. Modèle calqué sur la médiathèque unifiée du CRM (`media_files`).
2. **Emplacements** : liste des slots/galeries depuis le registre `shared/slots.ts`, groupés par page, + la liste des articles de blog (slot `blog:cover` par article). Pour chaque emplacement : images placées, **piocher dans la Bibliothèque** (fenêtre de sélection), **glisser pour réordonner**, retirer (le fichier reste dans le fond).

La fenêtre « piocher dans la Bibliothèque » est le composant de sélection réutilisé partout (pages, galeries, blog) — un seul picker.

## Blog unifié

`blog_posts.imageUrl` est supprimé. La couverture d'un article = placement `slot_key="blog:cover", entity_id=<id article>`. La règle actuelle « les traductions héritent de la couverture du parent FR » est conservée (le placement du parent fait foi). Changer la couverture du 3e article = liste blog → clic vignette → picker → fini.

## Reprise des données (one-shot, pas de phases molles)

Script idempotent, lancé via Railway sur la base prod, `--dry-run` d'abord, puis réel. **Filet = snapshot DB** avant exécution (pas un long plan multi-semaines).

1. `assets` ← lignes `media_library` (on garde id/url/fichier/alt/titre/dimensions).
2. `placements` ← pour chaque ligne ayant `(page, section)`, créer un placement sur le `slot_key` correspondant (mapping ancien `(page, section)` → clé du registre), `sort_order` repris.
3. `placements` blog ← pour chaque article, `blog:cover` depuis `imageUrl` (rapprochement par URL ; si l'URL n'est pas un asset, l'importer comme asset — le fichier est déjà sur R2).
4. **URLs en dur** ← importées comme `assets` + `placements` pour atteindre « zéro URL en dur » (audit via l'outil de scan d'usage existant).

## Suppression de l'ancien (fin de chantier)

Une fois le site vérifié page par page en prod : drop des colonnes `page/section/category/subcategory` de l'ex-`media_library`, drop `blog_posts.imageUrl`, suppression de `AdminMedia.tsx`, de l'ancien `AdminMediaV2`, de `useMediaByPage`/`useMediaByCategory`, de `shared/mediaPages.ts` et des `FALLBACK_PHOTOS`.

## Vérification

- Aperçu/visuel de chaque page après bascule (le prerender re-bake les placements).
- L'outil « où elle est utilisée » (scan du code) doit revenir **vide** pour toute URL R2 (preuve qu'aucun rendu n'est piloté en dur).
- `pnpm check` vert ; build SSR OK.

## Risques

- **Site live pendant la bascule** : mitigé par snapshot DB + le build qui bake les placements + vérif par page. La lecture par `slot_key` tombe sur un placement existant ou rien (jamais une page cassée par une exception).
- **Mapping de reprise incomplet** : audité en `--dry-run` (liste des `(page, section)` non mappés et des URLs en dur orphelines avant tout écrit réel).
- **Prod = média baké** : les nouvelles lectures n'apparaissent qu'après rebuild — intégré au déroulé de déploiement.

## Critères de succès

- Un seul fond d'images, alimenté par upload.
- Tout endroit du site (sections, galeries, couvertures blog, OG) est rempli en piochant dans ce fond ; réutilisation et réordonnancement triviaux.
- Zéro URL R2 en dur pilotant un rendu.
- Les anciens systèmes (médiathèque page/section, blog URL-texte, ancien admin) n'existent plus.
