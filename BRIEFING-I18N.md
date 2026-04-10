# 📋 Briefing Complet — Implémentation i18n Hallucine

## 🎯 Objectif

Implémenter **i18next** sur le site Hallucine avec **URLs traduites** pour 4 domaines indépendants.
Chaque domaine affiche le site dans sa langue, avec des URLs localisées et un code source unique.

---

## 🌍 Domaines & Langues

| Domaine | Langue | Code |
|---------|--------|------|
| hallucinecran.fr | Français | fr |
| hallucinecran.com | Anglais | en |
| hallucinecran.de | Allemand | de |
| hallucinecran.es | Espagnol | es |

---

## 🏗️ Stack Technique

- **Frontend** : React 19 + Vite + TypeScript
- **Backend** : Express 4 + tRPC 11
- **Base de données** : MySQL/TiDB (Drizzle ORM)
- **Styling** : Tailwind CSS 4 + shadcn/ui
- **Routing** : Wouter
- **Auth** : Manus OAuth
- **Projet** : `/home/ubuntu/hallucine-site`

---

## 📁 Structure du Projet

```
client/
  src/
    pages/          ← 34 pages
    components/     ← Composants réutilisables
    contexts/       ← React contexts
    hooks/          ← Custom hooks
    lib/trpc.ts     ← tRPC client
    App.tsx         ← Routes & layout
    index.css       ← Styles globaux
  public/           ← Assets statiques
drizzle/            ← Schema & migrations
server/
  routers.ts        ← tRPC procedures
  db.ts             ← Query helpers
  crmWebhook.ts     ← Intégration CRM
  indexnow.ts       ← IndexNow SEO
shared/             ← Types partagés
```

---

## 📄 Pages Existantes (34 pages)

### Pages Publiques à Traduire
| Page FR | Composant | URL FR |
|---------|-----------|--------|
| Accueil | Home.tsx | / |
| Écrans gonflables | Ecrans.tsx | /ecran-gonflable |
| Écran géant soufflerie | EcranGeant.tsx | /ecran-gonflable-geant-soufflerie |
| Écran étanche | EcranEtanche.tsx | /ecran-gonflable-etanche-air |
| Écran économique | EcranEconomique.tsx | /ecran-gonflable-economique |
| Comparaison écrans | Comparaison.tsx | /comparaison-ecran-gonflable |
| Écrans LED | EcransLED.tsx | /ecrans-led |
| Tentes gonflables | Tentes.tsx | /tente-gonflable |
| Tente X | TentesX.tsx | /tente-gonflable-x |
| Tente N | TentesN.tsx | /tente-gonflable-n |
| Tente V | TentesV.tsx | /tente-gonflable-v |
| Tente Araignée | TentesAraignees.tsx | /tente-gonflable-araignee |
| Arches gonflables | ArchesGonflables.tsx | /arche-gonflable |
| Mobilier gonflable | Mobilier.tsx | /mobilier-gonflable |
| Accessoires | Accessoires.tsx | /accessoire-cinema-plein-air |
| Galerie événements | Galerie.tsx | /galerie-evenements |
| Galerie vidéo | GalerieVideo.tsx | /galerie-video |
| Contact | Contact.tsx | /contactez-nous |
| À propos | APropos.tsx | /a-propos-hallucine |
| Histoire | Histoire.tsx | /histoire-hallucine |
| Blog | Blog.tsx | /blog |
| Mode d'emploi | ModeEmploi.tsx | /mode-emploi |
| Devenir distributeur | DevenirDistributeur.tsx | /devenir-distributeur |
| Trouver distributeur | TrouverDistributeur.tsx | /trouver-distributeur |
| Mentions légales | MentionsLegales.tsx | /mentions-legales |
| Politique confidentialité | Confidentialite.tsx | /politique-confidentialite |
| Politique cookies | PolitiqueCookies.tsx | /politique-cookies |
| 404 | NotFound.tsx | /404 |

### Pages Privées (NE PAS Traduire)
| Page | Composant | URL |
|------|-----------|-----|
| Profil | Profil.tsx | /profil |
| Admin | Admin.tsx | /admin |
| Admin Analytics | AdminDashboard.tsx | /admin/analytics |
| Admin Audits | AdminAuditHistory.tsx | /admin/audits |
| Admin Calculateurs | AdminCalculateurs.tsx | /admin/calculateurs |

---

## 🔗 URLs Traduites (Mapping Complet)

| FR | EN | DE | ES |
|----|----|----|-----|
| / | / | / | / |
| /ecran-gonflable | /inflatable-screen | /aufblasbarer-bildschirm | /pantalla-inflable |
| /ecran-gonflable-geant-soufflerie | /giant-inflatable-screen | /grosser-aufblasbarer-bildschirm | /pantalla-inflable-gigante |
| /ecran-gonflable-etanche-air | /waterproof-inflatable-screen | /wasserdichter-aufblasbarer-bildschirm | /pantalla-inflable-impermeable |
| /ecran-gonflable-economique | /budget-inflatable-screen | /guenstiger-aufblasbarer-bildschirm | /pantalla-inflable-economica |
| /comparaison-ecran-gonflable | /inflatable-screen-comparison | /aufblasbarer-bildschirm-vergleich | /comparacion-pantalla-inflable |
| /ecrans-led | /led-screens | /led-bildschirme | /pantallas-led |
| /tente-gonflable | /inflatable-tent | /aufblasbares-zelt | /tienda-inflable |
| /tente-gonflable-x | /inflatable-tent-x | /aufblasbares-zelt-x | /tienda-inflable-x |
| /tente-gonflable-n | /inflatable-tent-n | /aufblasbares-zelt-n | /tienda-inflable-n |
| /tente-gonflable-v | /inflatable-tent-v | /aufblasbares-zelt-v | /tienda-inflable-v |
| /tente-gonflable-araignee | /spider-inflatable-tent | /spinnen-aufblasbares-zelt | /tienda-inflable-arana |
| /arche-gonflable | /inflatable-arch | /aufblasbarer-bogen | /arco-inflable |
| /mobilier-gonflable | /inflatable-furniture | /aufblasbares-mobiliar | /mobiliario-inflable |
| /accessoire-cinema-plein-air | /outdoor-cinema-accessories | /freiluftkino-zubehoer | /accesorios-cine-aire-libre |
| /galerie-evenements | /events-gallery | /veranstaltungsgalerie | /galeria-eventos |
| /galerie-video | /video-gallery | /videogalerie | /galeria-video |
| /contactez-nous | /contact-us | /kontakt | /contactenos |
| /a-propos-hallucine | /about-hallucine | /ueber-hallucine | /sobre-hallucine |
| /histoire-hallucine | /hallucine-history | /hallucine-geschichte | /historia-hallucine |
| /blog | /blog | /blog | /blog |
| /mode-emploi | /user-guide | /bedienungsanleitung | /manual-usuario |
| /devenir-distributeur | /become-distributor | /haendler-werden | /convertirse-distribuidor |
| /trouver-distributeur | /find-distributor | /haendler-finden | /encontrar-distribuidor |
| /mentions-legales | /legal-notice | /impressum | /aviso-legal |
| /politique-confidentialite | /privacy-policy | /datenschutz | /politica-privacidad |
| /politique-cookies | /cookie-policy | /cookie-richtlinie | /politica-cookies |

---

## 🔑 Variables d'Environnement & Secrets

### Secrets Système (déjà configurés dans Manus)
```
DATABASE_URL              ← MySQL/TiDB connection string
JWT_SECRET                ← Session cookie signing
VITE_APP_ID               ← Manus OAuth app ID
OAUTH_SERVER_URL          ← Manus OAuth backend
VITE_OAUTH_PORTAL_URL     ← Manus login portal
OWNER_OPEN_ID             ← Owner's OpenID
OWNER_NAME                ← Owner's name
BUILT_IN_FORGE_API_URL    ← Manus built-in APIs URL
BUILT_IN_FORGE_API_KEY    ← Manus built-in APIs key (server)
VITE_FRONTEND_FORGE_API_KEY ← Manus APIs key (frontend)
VITE_FRONTEND_FORGE_API_URL ← Manus APIs URL (frontend)
RESEND_API_KEY            ← Email service
RESEND_FROM_EMAIL         ← Email sender
VITE_ANALYTICS_ENDPOINT   ← Umami analytics endpoint
VITE_ANALYTICS_WEBSITE_ID ← Umami website ID
```

### Secrets Spécifiques Hallucine
```
CRM_WEBHOOK_URL           ← URL du webhook CRM
CRM_WEBHOOK_TOKEN         ← Token d'authentification CRM
```

### Secrets à Ajouter pour i18n
```
DEEPL_API_KEY             ← DeepL API pour traductions automatiques
                            Gratuit jusqu'à 500 000 caractères/mois
                            https://www.deepl.com/pro-api
```

---

## 🔌 Intégrations Existantes

### CRM Webhook
- **Fichier** : `server/crmWebhook.ts`
- **Déclenchement** : Soumission du formulaire de contact
- **Données envoyées** : entreprise, prénom, nom, email, téléphone, produit, notes, ville, pays

### IndexNow (SEO)
- **Fichier** : `server/indexnow.ts`
- **Clé** : `f31bcd06809042bfb75256a01133a84c`
- **Domaine principal** : hallucinecran.fr
- **À mettre à jour** : Ajouter les URLs des 4 domaines après i18n

### Google Analytics
- **ID** : `G-JKHPG2Q6GK`
- **Fichier** : `client/index.html`

### Umami Analytics
- **Endpoint** : Variable `VITE_ANALYTICS_ENDPOINT`
- **Website ID** : Variable `VITE_ANALYTICS_WEBSITE_ID`

---

## 🗺️ Feuille de Route i18n

### Phase 1 : Installation i18next (15 min)
- Installer `i18next`, `react-i18next`, `i18next-browser-languagedetector`
- Créer la structure `client/locales/fr|en|de|es/`
- Configurer i18next avec détection de langue par domaine
- Créer un hook `useTranslation()` personnalisé

### Phase 2 : Extraction des textes (20 min)
- Identifier tous les textes hardcodés du site
- Créer les fichiers JSON avec clés de traduction par sections :
  - `common.json` (nav, footer, boutons génériques)
  - `home.json` (page d'accueil)
  - `products.json` (pages produits)
  - `contact.json` (formulaire de contact)
  - `legal.json` (mentions légales, RGPD)

### Phase 3 : Traduction automatique DeepL (10 min)
- Utiliser DeepL API pour générer EN/DE/ES depuis le FR
- Vérifier et corriger les traductions critiques (produits, CTA)

### Phase 4 : Refactorisation du code (30 min)
- Remplacer tous les textes hardcodés par `t('clé')`
- Tester chaque page avec les 4 langues

### Phase 5 : URLs traduites (20 min)
- Configurer le routing pour URLs traduites (voir tableau ci-dessus)
- Créer une fonction de mapping URL par langue
- Gérer les redirections 301 pour les anciennes URLs

### Phase 6 : Détection de langue par domaine (10 min)
- hallucinecran.fr → FR
- hallucinecran.com → EN
- hallucinecran.de → DE
- hallucinecran.es → ES
- Redirection automatique si langue incorrecte

### Phase 7 : SEO & Hreflang (10 min)
- Mettre à jour les hreflang avec les URLs traduites
- Mettre à jour les meta tags (title, description) par langue
- Mettre à jour les sitemaps pour chaque domaine
- Mettre à jour IndexNow pour les 4 domaines

### Phase 8 : Test & Déploiement (15 min)
- Tester chaque domaine avec chaque langue
- Vérifier les redirections
- Créer un checkpoint
- Déployer

---

## ⚠️ Points d'Attention

1. **URLs changent** → Redirects 301 nécessaires pour ne pas perdre le SEO
2. **Formulaire de contact** → Les emails de confirmation doivent être dans la langue du visiteur
3. **CRM** → Ajouter le champ `langue` dans les données envoyées au CRM
4. **Sitemaps** → Créer un sitemap par domaine avec les URLs traduites
5. **Google Search Console** → Ajouter les 3 autres domaines (.com, .de, .es)
6. **Yandex Webmaster** → Déjà vérifié pour hallucinecran.fr
7. **Images** → Certaines images peuvent contenir du texte (à adapter si nécessaire)

---

## 📂 Fichiers Clés à Modifier

```
client/
  index.html              ← Meta tags, hreflang
  src/
    App.tsx               ← Routes (ajouter URLs traduites)
    main.tsx              ← Provider i18next
    pages/*.tsx           ← Toutes les pages (remplacer textes)
    components/
      Navbar.tsx          ← Navigation (déjà multilingue partiel)
      Footer.tsx          ← Footer
      HeroSection.tsx     ← Hero
      ProductsSection.tsx ← Produits
      ContactSection.tsx  ← Formulaire contact
      SmartForm.tsx       ← Formulaire multi-étapes
      FaqSection.tsx      ← FAQ
      ... (tous les composants)
server/
  indexnow.ts             ← Ajouter URLs des 4 domaines
  crmWebhook.ts           ← Ajouter champ langue
```

---

## 🔄 Processus pour Ajouter une Nouvelle Page Après

1. Créer la page en FR (comme d'habitude)
2. Ajouter les clés de traduction dans `locales/fr/[section].json`
3. Lancer DeepL pour générer EN/DE/ES automatiquement
4. Utiliser `t('clé')` dans le code
5. Ajouter la route dans `App.tsx` avec les 4 URLs
6. Mettre à jour les sitemaps
7. La page est multilingue ! ✅

---

## 📊 Résumé SEO Actuel

| Élément | Statut |
|---------|--------|
| sitemap.xml | ✅ Présent (hallucinecran.fr) |
| robots.txt | ✅ Présent |
| Google Search Console | ✅ Configuré (hallucinecran.fr) |
| Yandex Webmaster | ✅ Vérifié (hallucinecran.fr) |
| IndexNow | ✅ Soumis (27 URLs) |
| Hreflang | ✅ Configuré (4 langues) |
| Google Analytics | ✅ G-JKHPG2Q6GK |
| Structured Data | ✅ FAQ, BreadcrumbList |

---

## 🤖 Chatbot IA (HallucineChatbot)

- **Fichier** : `server/chatbot.ts` + `client/src/components/HallucineChatbot.tsx`
- **Système prompt** : En français uniquement (`Tu réponds en français`)
- **À adapter** : Le chatbot doit détecter la langue du domaine et répondre dans la langue correspondante
- **Prompts suggérés** : Actuellement hardcodés en FR dans `HallucineChatbot.tsx` → à traduire

---

## 📐 Composants Spéciaux à Traduire

| Composant | Description | Contenu à traduire |
|-----------|-------------|--------------------|
| `HeroSection.tsx` | Section héro de la page d'accueil | Titre, sous-titre, CTA |
| `ProductsSection.tsx` | Grille des produits | Noms, descriptions |
| `TechnologySection.tsx` | Section technologie | Textes techniques |
| `UseCasesSection.tsx` | Cas d'usage | Titres, descriptions |
| `StorySection.tsx` | Histoire de la marque | Texte narratif |
| `RealisationsSection.tsx` | Réalisations clients | Textes |
| `FaqSection.tsx` | FAQ | Questions + réponses |
| `ContactSection.tsx` | Section contact | Labels, placeholders |
| `SmartForm.tsx` | Formulaire multi-étapes | Toutes les étapes |
| `Footer.tsx` | Pied de page | Liens, textes |
| `Navbar.tsx` | Navigation | Menus, liens |
| `WhatsAppButton.tsx` | Bouton WhatsApp | Tooltip, messages |
| `AvailabilityIndicator.tsx` | Indicateur disponibilité | Textes d'état |
| `BrochureDownloadButton.tsx` | Téléchargement brochure | Texte bouton |
| `CinemaRideau.tsx` | Animation rideau | Texte d'intro |
| Calculateurs (4 fichiers) | Calculateurs de tentes | Labels, résultats |

---

## 🔧 Hooks à Adapter pour i18n

| Hook | Rôle | Adaptation nécessaire |
|------|------|----------------------|
| `useDocumentMeta.ts` | Gère title, description, OG | Passer les meta traduits |
| `useCanonical.ts` | Gère l'URL canonique | Adapter par domaine |
| `useStructuredData.ts` | Données structurées JSON-LD | Traduire les données |
| `useAnalytics.ts` | Tracking analytics | Ajouter langue dans events |

---

## 🖥️ SSG (Pré-rendu Statique)

- **Script** : `scripts/prerender.mjs`
- **Rôle** : Génère des fichiers HTML statiques pour le SEO (27 routes)
- **À adapter** : Créer un script de pré-rendu par domaine/langue
- **Attention** : Les routes changent avec les URLs traduites → mettre à jour la liste `ROUTES`

---

## 🗄️ Base de Données (Tables Existantes)

| Table | Description |
|-------|-------------|
| `users` | Utilisateurs (auth Manus) |
| `contactSubmissions` | Soumissions formulaire contact |
| `pageViews` | Tracking des visites |

**À ajouter** : Champ `langue` dans `contactSubmissions` pour savoir depuis quel domaine vient la demande.

---

## 📱 Fonctionnalités Spécifiques

### Brochure PDF
- Générée côté serveur via tRPC
- Actuellement en français uniquement
- **À adapter** : Générer la brochure dans la langue du visiteur

### Calculateurs de Tentes
- 4 calculateurs (X, N, V, Araignée)
- Labels et résultats en français
- **À traduire** : Labels, unités, messages d'erreur

### Widget Admin Navigation
- Visible uniquement pour les admins
- Chargé depuis `hallucine.manus.space/api/nav-widget`
- **Ne pas traduire** (usage interne)

### IndexNow
- **Clé** : `f31bcd06809042bfb75256a01133a84c`
- **Fichier clé** : `client/public/f31bcd06809042bfb75256a01133a84c.txt`
- **À mettre à jour** : Ajouter les URLs des 4 domaines après i18n

---

## 🌐 Configuration index.html à Adapter

```html
<!-- Actuel (hardcodé FR) -->
<html lang="fr">
<meta property="og:locale" content="fr_FR" />
<link rel="canonical" href="https://hallucinecran.fr/" />

<!-- À adapter (dynamique par domaine) -->
<html lang="{lang}">
<meta property="og:locale" content="{locale}" />
<link rel="canonical" href="{canonical_url}" />
```

**Locales par domaine :**
- hallucinecran.fr → `lang="fr"`, `og:locale="fr_FR"`
- hallucinecran.com → `lang="en"`, `og:locale="en_US"`
- hallucinecran.de → `lang="de"`, `og:locale="de_DE"`
- hallucinecran.es → `lang="es"`, `og:locale="es_ES"`

---

*Fichier créé le 10/04/2026 — Projet Hallucine*
