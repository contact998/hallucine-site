# Audit harmonisation Hallucine — 2026-05-25

Périmètre : site public + admin. Lecture seule.

## P0 — Cassé ou contradictoire (à corriger)

### V1. Deux palettes "or" concurrentes dans index.css
- **OKLCH** (warm) : `--color-warm: oklch(0.72 0.10 55)` → `--primary` / `--ring` (lignes 47-78)
- **HEX** (gold) : `#D4AF37`, `#FFD700`, `#B8860B` (lignes 187-232) via utilities `.bg-gold` / `.text-gold` / `.glow-gold`
- Conséquence : `bg-primary` ≠ `bg-gold` visuellement (copper/amber vs gold).
- Fix : choisir une palette canonique, supprimer l'autre. Recommandation : garder OKLCH (system tokens), réécrire les utilities gold pour pointer sur `var(--color-warm)`.

### V2. 30+ couleurs hex hardcodées dans le code
Top occurrences (66 fichiers TSX, 86 valeurs arbitraires `text-[...]` / `bg-[...]`):
- `#DAA520` (24×) — variant gold goldenrod
- `#1a1a2e` (10×) — concurrent du `--background`
- `#c8a96e`, `#c5942a`, `#D4AF37`, `#FFD700`, `#B8860B`, `#e8b84a` — au moins 8 ors différents
- `#8b1a1a`, `#6b0f0f`, `#a02020`, `#5a0a0a`, `#4a0808`, `#7a1212` — 6 rouges
- `#25D366` (WhatsApp), `#FBBC05` (Google) — légitimes
- Fix : remplacer par tokens (`text-warm`, `bg-primary`, `bg-card`, etc.) sauf les couleurs de marques tierces.

### V3. 19 `<button>` raw dans les pages au lieu du composant shadcn `<Button>`
- shadcn Button existe dans `components/ui/button.tsx` mais Blog.tsx et autres utilisent `<button className="...">` avec couleurs hardcodées.
- Fix : remplacer par `<Button variant="..." size="..."/>`.

### C1. Pages produit ~1700 lignes avec structure répétée
- EcranGeant 405, EcranEconomique 321, EcranEtanche 281, ArchesGonflables 291, DriveIn 212, Ecrans 173, EcransLED 93.
- Pattern hero / specs / gallery / CTA répété, pas extrait.
- Fix : créer `ProductPageLayout` + sections réutilisables (`ProductHero`, `ProductSpecs`, `ProductGallery`, `ProductCTASection`). **Hors scope harmonisation pure** — à planifier séparément.

## P1 — Incohérent visible

### V4. Radius non normalisé
- `rounded-lg` (282×), `rounded-full` (135×), `rounded-xl` (63×), `rounded-md` (56×), `rounded-sm` (20×), `rounded-2xl` (8×).
- Pas de règle visible (cards/buttons mélangés).
- Fix : convention `card=lg`, `button=md`, `badge=full`, `image=lg`.

### V5. OG image inconsistante
- 2 hosts utilisés : `pub-dc19082f8e054e8b8a192d8d29df2aa0.r2.dev` (R2) ET `d2xsxph8kpxj0f.cloudfront.net` (CloudFront).
- Fix : canoniser sur R2 ou créer un alias unique.

### S1. CTAs incohérents entre `common.json` et `footer.menu`
- `cta_devis` = "Demander un devis gratuit" vs `footer.menu.devis` = "Devis gratuit"
- `cta_contact` = "Nous contacter" vs `footer.menu.contact` = "Contactez-nous"
- Fix : aligner sur les clés `cta_*` (ce sont les CTAs primaires).

### B1. Casing brand & vocabulaire
- "Drive-In" (2×) vs "drive-in" (17×) vs "Drive-in" (1×) vs "DriveIn" (1×, code) — convention typo manquante
- "Écran gonflable" (14×) vs "Écran Gonflable" (3×) — capitalisation mixte
- "Hallucinecran" 6× (probable old branding vs "Hallucine" canonique)
- Fix : règle = drive-in (minuscule sauf début phrase), écran gonflable (minuscule sauf début), Hallucine (canon).

## P2 — Polish

### V6. `motion.h1` dans HeroSection.tsx → 2 H1 si réutilisé
- Composant a 2 motion.h1 dans son JSX (l. 81 + ?). Si rendu plusieurs fois sur une page : duplication SEO.
- Vérifier rendu unique.

### S2. BlogPost a 2 H1 en code
- L. 67 (404 "Article introuvable") + l. 103 (article). Rendus conditionnels donc OK en prod, mais isoler dans composants distincts pour clarté.

### S3. Profil.tsx a 2 H1
- À vérifier.

## Pages bien faites
- 42/44 utilisent `useDocumentMeta` avec i18n (`t("meta_title")`) ✓
- Title gabarit unique `"X | Hallucine"` ✓
- Structured data centralisée (GlobalStructuredData + PageStructuredData) ✓

---

## Plan d'exécution

**Lot A — Visuel (P0+P1)** : palette unifiée, hex → tokens (sauf marques tierces), radius normalisé.

**Lot B — Composants (P0)** : `<button>` raw → `<Button>` shadcn (Blog + autres).

**Lot C — Contenu (P1)** : aligner CTAs footer↔common, fixer casing drive-in / écran gonflable / Hallucine.

**Hors scope** (à proposer séparément) : refacto pages produit en `ProductPageLayout` (C1).
