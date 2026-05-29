# Restructuration média : modèle `page`/`section`, site câblé sur la médiathèque

Date : 2026-05-29
Statut : spec à valider

## Problème

La médiathèque admin « ne veut rien dire » parce que la structure média du site est incohérente, et surtout **déconnectée du site** :

1. **~170 URLs R2 sont codées en dur** dans ~25 fichiers de pages (`Galerie` 52, `EcranEconomique` 17, `EcranGeant` 15, `ModeEmploi` 13, `Histoire` 9, etc.). Les pages affichent ces URLs directement, sans passer par la base.
2. **Seules 2 vues lisent la base** : `Galerie` (`galerie`) et `RealisationsSection` (`realisations`). Tout le reste ignore `media_library`.
3. La taxonomie existante est **incohérente** : la « page » est tantôt dans `category` (`realisations`), tantôt dans `subcategory` (`home`), tantôt sous `ui/...`. Il n'existe aucun rattachement page unique.
4. Conséquence : les buckets `produits/ecran-geant`, `ui/story`, etc. existent en base mais **ne pilotent rien**. La médiathèque est un catalogue mort ; éditer une photo n'a aucun effet sur le site.

Cela viole aussi la règle « pas de R2 hardcodé » : l'affichage doit venir de la base.

## Objectif

Faire de `media_library` la **source unique** des photos du site, organisée par **page** puis **section**, de sorte que :
- chaque page du site lit ses photos depuis la base ;
- la médiathèque admin est naturellement organisée par page → section ;
- éditer/ranger une photo dans l'admin se reflète sur le site, sans toucher au code.

Non-objectif : refonte visuelle des pages, vidéos, blog (hors photos), SEO. On déplace la **source** des images, pas le design.

## Modèle cible

Deux champs explicites sur chaque média :

- **`page`** : route réelle du site à laquelle la photo appartient. Valeurs = slugs des routes : `accueil`, `ecran-geant`, `ecran-etanche`, `ecran-economique`, `ecrans-led`, `arches`, `mobilier`, `accessoires`, `tente-x`, `tente-n`, `tente-v`, `tente-araignee`, `galerie`, `histoire`, `mode-emploi`, `cas-velodrome`, `cas-oran`, `drive-in`, `comparaison`, `ecrans`, `tentes`, `a-propos`.
- **`section`** (optionnel) : zone dans la page, pour les pages multi-zones. Ex. `accueil` → `produits` | `realisations` | `histoire` | `cinema` | `techno` ; une page produit → `galerie` | `bandeau` | `icones`.

Une photo appartient à exactement une `(page, section)`. La liste des pages et de leurs sections est définie **une fois** dans un registre partagé `shared/mediaPages.ts` (source de vérité commune au site, à l'admin et à la migration).

## Schéma

`media_library` : ajout additif, non destructif.

- Ajout colonne `page VARCHAR(40) NULL`.
- Ajout colonne `section VARCHAR(40) NULL`.
- On **conserve** `category`/`subcategory` pendant toute la transition (lecture de secours, rollback possible). Suppression seulement en toute fin, une fois tout vérifié.
- Index `(page, section, active, sortOrder)` pour les requêtes par page.

## Migration des données

Script idempotent, en deux temps, exécuté via Railway (DB prod) avec `--dry-run` d'abord.

1. **Backfill depuis l'existant** : mapping `(category, subcategory)` → `(page, section)` selon l'inventaire (ex. `produits/ecran-geant` → `(ecran-geant, galerie)`, `realisations` → `(accueil, realisations)`, `ui/story` → `(accueil, histoire)`…).
2. **Réconciliation des URLs hardcodées** : pour chaque URL R2 actuellement codée en dur dans une page, vérifier qu'une ligne `media_library` existe avec la bonne `(page, section)` ; sinon l'insérer (le fichier est déjà sur R2). L'`alt` est repris du code (les `alt` du code sont fiables, contrairement à ceux de la base — voir note ci-dessous).

Note importante : les `alt`/`title` actuels en base **ne correspondent pas toujours à l'image** (constaté : une ligne « Tchad » pointait sur une autre photo). La réconciliation fait foi du **code page** (URL + alt écrits à la main dans la page), pas des libellés en base.

## Lecture côté site

- Nouveau hook `useMediaByPage(page, section?)` (ou extension de `useMediaByCategory`) qui lit `media_library` par `(page, section)`, avec le même mécanisme SSR-baké/fallback qu'aujourd'hui.
- Chaque page remplace son tableau d'URLs en dur par un appel `useMediaByPage(...)`. Les `FALLBACK_PHOTOS` restent comme filet de sécurité uniquement (jamais pilote du rendu).
- Composants concernés : `PagePhoto`, `ProductsSection`, `RealisationsSection` (déjà fait), `RelatedProducts`, et les ~25 pages listées.

## Médiathèque admin

- Vue regroupée **par page** (repliable), puis **par section** sous chaque page.
- Le registre `shared/mediaPages.ts` fournit la liste ordonnée des pages et leurs sections (libellés FR lisibles).
- Une photo non rattachée (`page` NULL) tombe dans un groupe « À ranger », pour traitement.
- Déplacer une photo d'une page/section à l'autre = mise à jour `(page, section)` ; le site la reprend automatiquement.

## Déroulé (phasé, pour limiter le risque sur le site live)

- **Phase 1 — Fondations (aucun changement visible)** : registre `shared/mediaPages.ts`, colonnes schéma, migration backfill + réconciliation en `--dry-run` puis réel, hook `useMediaByPage`. Médiathèque admin passée en vue par page.
- **Phase 2 — Câblage des pages, par lots** : on bascule les pages du hardcodé vers `useMediaByPage`, lot par lot (produits d'abord, puis tentes, puis pages éditoriales). Vérification visuelle de chaque page après bascule (aperçu local) avant de passer au lot suivant.
- **Phase 3 — Nettoyage** : suppression des tableaux d'URLs morts, et à terme des colonnes `category`/`subcategory` une fois tout vérifié en prod.

Chaque phase est commitée séparément ; le site reste fonctionnel après chacune (le fallback couvre toute page non encore migrée).

## Risques

- **Site live** : la bascule d'une page peut casser son affichage si une photo manque en base. Mitigation : fallback conservé, vérification visuelle par page, bascule par lots.
- **Réconciliation incomplète** : une URL hardcodée sans équivalent base → insertion automatique ; à auditer en dry-run.
- **Prod = baked media** : les nouvelles lectures n'apparaissent en prod qu'après rebuild (prerender re-bake la base). À intégrer au déroulé de déploiement.

## Critères de succès

- Zéro URL R2 codée en dur pilotant un rendu (les `FALLBACK_*` ne servent que de secours).
- Chaque photo du site provient de `media_library` via `(page, section)`.
- La médiathèque admin liste les pages réelles, chaque photo sous sa page, et l'édition se reflète sur le site.
