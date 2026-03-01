# Project TODO

## Pages Écrans
- [x] Écran gonflable géant — contenu complet du site d'origine
- [x] Écran gonflable étanche — enrichi avec technologie TPU, avantages, FAQ
- [x] Écran économique — tableaux complets, images, FAQ
- [x] Comparaison — nouvelle page avec tableau 16 critères + 7 arguments
- [x] Écrans LED — nouvelle page "en construction"

## Pages Tentes
- [x] Tentes X — contenu détaillé du site d'origine
- [x] Tentes N — contenu détaillé du site d'origine
- [x] Tentes V — contenu détaillé du site d'origine
- [x] Tentes Araignées — contenu enrichi avec prix et accessoires

## Pages Arches & Mobilier
- [x] Arches Gonflables — vérifiée complète
- [x] Mobilier Gonflable — vérifiée complète
- [x] Accessoires — vérifiée complète

## Pages Galeries
- [x] Galerie d'images — vérifiée complète
- [x] Galerie vidéo — Navbar/Footer ajoutés

## Pages Info
- [x] Accueil — vérifiée complète
- [x] À propos — enrichie avec histoire personnelle de Daniel
- [x] Contact — champs Vente/Location et Produit ajoutés
- [x] Mode d'emploi — vérifiée complète
- [x] Prix/Demande de prix — vérifiée complète

## Pages créées
- [x] Devenir Distributeur — nouvelle page
- [x] Trouver un Distributeur — nouvelle page
- [x] Politique de Cookies — nouvelle page

## Pages légales
- [x] Mentions Légales — mise à jour avec vraies infos (SIREN, TVA, adresse)
- [x] Politique de Confidentialité — mise à jour avec adresse officielle
- [x] Blog — Navbar/Footer ajoutés

## Fonctionnalités
- [x] Logo Hallucine intégré (navbar, footer, rideau cinéma)
- [x] Compte à rebours CSS pur 3-2-1 avec son projecteur 35mm
- [x] Backend tRPC + base de données ajoutés
- [x] Formulaire de contact connecté au backend (sauvegarde DB + notification)
- [x] Favicon créé à partir du logo Hallucine
- [x] Tests vitest pour la route contact.submit (6 tests passent)

## Navigation
- [x] Navbar mise à jour avec Comparaison, Mode d'emploi, Écrans LED
- [x] Footer mis à jour avec liens Distributeur et Cookies

## En attente (côté client)
- [ ] Rendre publique la vidéo YouTube _lLdMYZhz7s depuis YouTube Studio
- [x] Connecter le formulaire Demande de devis au backend tRPC

## Page Profil Utilisateur
- [x] Mettre à jour le schéma DB pour lier les soumissions aux utilisateurs (userId, status, adminNote)
- [x] Créer les routes backend pour récupérer/gérer les devis de l'utilisateur
- [x] Créer la page de profil avec la liste des devis (tri par colonnes, compteurs par statut)
- [x] Ajouter le lien profil/connexion dans la navbar (desktop + mobile)
- [x] Tests vitest pour les routes profil (11 tests passent)

## Panneau d'Administration
- [x] Créer les routes backend admin (liste toutes soumissions, mise à jour statut, notes admin, stats)
- [x] Créer la page Admin avec tableau triable, filtres par statut/type, compteurs
- [x] Ajouter les actions admin : changer statut, ajouter note, supprimer
- [x] Ajouter l'export CSV des demandes
- [x] Ajouter le lien Admin dans la navbar (visible uniquement pour admin)
- [x] Tests vitest pour les routes admin (20 tests passent)

## Interconnexion CRM Hallucine
- [ ] Examiner le CRM Hallucine (hallucinecrm.manus.space) pour comprendre son API
- [ ] Créer un service d'interconnexion pour envoyer les demandes de devis au CRM
- [ ] Synchroniser automatiquement chaque nouvelle soumission comme prospect dans le CRM
- [ ] Tests vitest pour l'interconnexion

## Audit Comparatif
- [ ] Audit comparatif complet Hallucine vs Airscreen (airscreen.com/fr/)

## Améliorations pour surpasser Airscreen
- [x] Bouton WhatsApp flottant sur toutes les pages
- [x] Liens réseaux sociaux dans le footer (Facebook, Instagram, YouTube, LinkedIn) — déjà présents
- [x] Section Témoignages clients sur la page d'accueil + page dédiée
- [x] Chatbot IA (LLM) — assistant commercial intelligent pour répondre aux questions produits
- [x] Brochures PDF téléchargeables sur les pages produits

## Synchronisation CRM Hallucine
- [x] Ajouter l'utilisateur "Site Web" comme 3ème commercial dans le CRM — fait via webhook (createdBy='Site Web')
- [x] Examiner l'API du CRM Hallucine (hallucinecrm.manus.space)
- [x] Créer le service de synchronisation côté serveur
- [x] Connecter la synchronisation au flux de soumission de devis existant
- [x] Tests vitest pour la synchronisation CRM

## Notifications email admin
- [x] Examiner les outils d'envoi d'email disponibles (Gmail MCP, notification Manus)
- [x] Implémenter le service d'envoi d'email côté serveur
- [x] Connecter les notifications au flux de soumission de devis
- [x] Tests vitest pour les notifications email

## Tableau de bord Analytics admin
- [x] Examiner la structure admin existante et les données disponibles
- [x] Créer le schéma de base de données pour le tracking analytics (page views, events)
- [x] Implémenter le service de tracking côté serveur et le pixel de collecte frontend
- [x] Créer la page Dashboard Analytics avec graphiques (visites, conversions, sources, pages populaires)
- [ ] Colonnes triables dans tous les tableaux du dashboard
- [ ] Tests vitest pour le tracking et les statistiques

## Heures de présence avec fuseau horaire configurable
- [x] Table DB pour stocker le fuseau horaire et les heures de présence (configurable par admin)
- [x] Routes backend pour lire/modifier le fuseau horaire et les heures
- [x] Section admin pour changer le fuseau horaire (quand on voyage)
- [x] Affichage des heures de présence sur le bouton WhatsApp avec conversion automatique au fuseau du visiteur
- [x] Indicateur en temps réel "En ligne" / "Hors ligne" sur le bouton WhatsApp
- [ ] Afficher le fuseau horaire du visiteur dans le panneau admin quand il contacte via WhatsApp
- [x] IA analyse les analytics et génère des recommandations automatiques dans le dashboard
- [x] IA contrôle le message WhatsApp adapté selon le fuseau horaire et la disponibilité

## Objectif ultime : capture de coordonnées
- [x] WhatsApp : message IA adapté au fuseau + incitation à laisser ses coordonnées
- [ ] Chatbot IA : après quelques échanges, proposer automatiquement de laisser ses coordonnées
- [x] Dashboard analytics : recommandations IA pour améliorer le taux de conversion
- [ ] Toutes les fonctionnalités convergent vers la capture de leads

## Formulaires boostés IA (minimum de saisie)
- [ ] Auto-complétion IA du nom d'entreprise à partir du SIRET ou du nom partiel
- [ ] Chatbot qui pré-remplit le formulaire de devis après la conversation (nom, email, produit, besoin)
- [ ] Formulaire simplifié : seul l'email est obligatoire, l'IA déduit le reste
- [ ] Suggestions intelligentes de produits basées sur le parcours de navigation du visiteur
- [ ] Bouton "Demander un devis" contextuel sur chaque page produit avec produit pré-sélectionné

## Formulaire unifié intelligent "Le Devis en Douceur"
- [x] Composant SmartForm : étape 1 — choix du produit (4 cartes visuelles)
- [x] Composant SmartForm : étape 2 — besoin adapté au produit (taille écran/type tente/type mobilier/usage arche)
- [x] Composant SmartForm : étape 3 — email + téléphone (indicatif auto-détecté)
- [x] Composant SmartForm : étape 4 — prénom, nom, entreprise (IA auto-complétion depuis domaine email)
- [x] Composant SmartForm : étape 5 — pays (détection IP) + ville (API gouv.fr si France)
- [x] Composant SmartForm : étape 6 — message libre optionnel + bouton final
- [x] Animations fluides entre les étapes (slide/fade)
- [x] Comportement contextuel : pré-sélection produit sur les pages produits
- [x] Comportement contextuel : gate sur la page tarifs
- [x] Remplacer ContactSection par SmartForm sur la page d'accueil et /contactez-nous
- [x] Remplacer le formulaire DemandePrix par SmartForm en mode gate
- [x] Connecter SmartForm au CRM + notifications email (via la route contact.submit existante)
- [x] Chatbot IA pré-remplit le SmartForm après conversation
- [x] Tests vitest pour le SmartForm

## Sauvegarde de progression du formulaire SmartForm
- [x] Sauvegarde automatique dans localStorage à chaque changement d'étape
- [x] Détection de session précédente au chargement du formulaire
- [x] Bandeau/notification de reprise "Reprendre où vous en étiez ?"
- [x] Bouton pour effacer la progression sauvegardée
- [x] Expiration automatique après 7 jours
- [x] Tests vitest pour la sauvegarde de progression

## Préférence de rappel téléphonique
- [ ] Ajouter un sélecteur de préférence de rappel quand le téléphone est renseigné (jour + matin/après-midi)
- [ ] Envoyer la préférence au CRM et dans l'email admin

## Systeme de reponse email semi-automatique (1h apres demande)
- [ ] Schema DB : table pending_emails (prospectId, emailSubject, emailBody, status, generatedAt, validatedBy, sentAt)
- [ ] Service IA : generer un email de reponse personnalise basee sur le type de demande (ecran/tente/mobilier/arche)
- [ ] Timer 1h : declencher la generation d'email 1h apres la soumission du formulaire
- [ ] Notification aux admins (DC/JB) quand un email est pret a valider
- [ ] Interface admin : liste des emails en attente de validation avec preview
- [ ] Interface admin : boutons Valider / Modifier / Rejeter pour chaque email
- [ ] Envoi de l'email au prospect apres validation par DC ou JB
- [ ] Tests vitest pour le systeme de reponse email

## Email recapitulatif automatique (1h apres soumission - cote site web)
- [ ] Service d'email recapitulatif : generer un email HTML professionnel recapitulant la demande du prospect
- [ ] Timer 1h : programmer l'envoi automatique 1h apres la soumission du formulaire
- [ ] Envoyer l'email au prospect via Gmail MCP (sans validation necessaire)
- [ ] Tests vitest pour l'email recapitulatif

## Email recapitulatif IA automatique (1h apres soumission - cote site web)
- [ ] Service IA : generer un email recapitulatif personnalise et chaleureux (pas un template froid)
- [ ] L'IA adapte le ton et contenu selon le produit, la taille, le contexte du prospect
- [ ] Timer 1h : programmer l'envoi automatique 1h apres la soumission
- [ ] Envoyer l'email au prospect via Gmail MCP (sans validation)
- [ ] Tests vitest pour l'email recapitulatif IA

## Reorganisation formulaire + detection abandon
- [x] Etape 1 : Email en premier (capture immediate du contact)
- [x] Reorganiser les etapes : Email > Produit > Besoin > Tel/Rappel > Nom/Entreprise > Localisation > Message
- [x] Detection d'abandon : si le visiteur quitte apres avoir saisi l'email, envoyer les donnees partielles au CRM
- [x] Notification admin des abandons avec les infos deja saisies
- [x] IA extraction nom/prenom depuis email (jean.dupont@... -> Jean Dupont) + entreprise depuis domaine
- [x] Tests vitest pour l'extraction email (42 tests) et la route d'abandon (3 tests)

## Auto-complétion SIRET
- [x] Rechercher et tester l'API entreprise.data.gouv.fr pour la recherche SIRET
- [x] Créer le module client siretLookup.ts avec appel API et parsing des résultats
- [x] Intégrer l'auto-complétion SIRET dans le SmartForm (étape Nom/Entreprise)
- [x] Tests vitest pour la recherche SIRET (22 tests)

## Remplissage vocal du formulaire
- [x] Créer le hook useSpeechToText.ts (Web Speech API native)
- [x] Bouton micro sur chaque champ du SmartForm pour dicter au lieu de taper
- [x] Feedback visuel pendant l'écoute (animation micro, texte en cours)
- [x] Fallback gracieux si le navigateur ne supporte pas la reconnaissance vocale
- [x] Tests vitest pour le remplissage vocal (intégré dans tests SIRET)

## Audit IA hebdomadaire automatique (lundi 6h)
- [x] Lire le fuseau horaire configuré dans le CRM (businessHours)
- [x] Service d'audit IA : analyser le code (qualité, erreurs, dépendances)
- [x] Service d'audit IA : analyser le workflow (taux conversion SmartForm, abandons, pages populaires, chatbot)
- [x] Service d'audit IA : générer des recommandations d'amélioration priorisées
- [x] Envoyer le rapport par email via Gmail MCP chaque lundi à 6h (fuseau CRM)
- [x] Programmer la tâche planifiée (cron)
- [x] Tests vitest pour le service d'audit IA (25 tests)

## Historique des audits IA
- [x] Table DB audit_history pour stocker chaque rapport
- [x] Modifier weeklyAudit.ts pour sauvegarder automatiquement en DB
- [x] Routes admin : liste des audits, détail d'un audit, comparaison semaine/semaine
- [x] Interface admin : page historique avec tableau triable, détail, graphiques d'évolution
- [x] Comparaison semaine N vs N-1 : variation des métriques clés (visites, conversion, soumissions)
- [x] Tests vitest pour l'historique des audits (188 tests au total)

## Indicateur de disponibilité IA (croisement 3 fuseaux horaires)
- [x] Route backend proxy pour appeler le CRM /api/webhook/availability (ou implémentation locale)
- [x] Logique de croisement des fuseaux horaires DC + JB + visiteur
- [x] Appel LLM pour générer un message personnalisé selon la disponibilité
- [x] Composant AvailabilityIndicator : widget fixe en bas à droite (vert/orange, pulse, avatars DC/JB)
- [x] Badge de disponibilité dans le header (à côté du numéro de téléphone)
- [x] Version étendue sur la page contact avec heures d'ouverture détaillées
- [x] Rafraîchissement automatique toutes les 5 minutes
- [x] Bouton d'action contextuel (contacter maintenant / laisser email)
- [x] Tests vitest pour la logique de disponibilité (28 tests, 217 au total)

## Chatbot pré-remplissage du SmartForm
- [x] Analyser le chatbot existant et le SmartForm pour les points d'intégration
- [x] Service d'extraction d'infos depuis la conversation (nom, email, produit, besoin, entreprise, tel)
- [x] Détection d'intention contact/devis dans la conversation chatbot
- [x] Bouton "Pré-remplir le formulaire" dans le chatbot avec résumé visuel des infos collectées
- [x] SmartForm accepte les données pré-remplies depuis le chatbot (URL params enrichis : message, eventType, audience, date, budget, need)
- [x] Transition fluide chatbot → formulaire pré-rempli avec bandeau "Pré-rempli par le chatbot IA"
- [x] Tests vitest pour le pré-remplissage chatbot (18 tests, 236 au total)

## Bug fixes
- [x] Fix indicateur de disponibilité : affiche "21h-07h" au lieu de "08h-16h" (conversion fuseau horaire inversée)
- [x] Fix indicateur de disponibilité : utilisateur connecté → fuseau depuis profil DB, visiteur anonyme → fuseau depuis appareil
- [x] Différenciation visiteur/connecté : anonyme voit seulement statut (Disponible/Absent), connecté voit statut + heures locales
- [x] Fuseau par défaut de JB corrigé : Asia/Shanghai au lieu de Europe/Paris
- [x] Heures d'ouverture et horaires locaux masqués pour les visiteurs anonymes (vie privée)

## Bug persistant - Heures 21h-07h dans le widget de disponibilité
- [x] Identifier la source exacte des heures 21h-07h : bug dans formatInVisitorTz (routers.ts) et convertHourBetweenTimezones (availabilityService.ts) - new Date() sans 'Z' interprété en heure locale du serveur (America/New_York) au lieu d'UTC
- [x] Corriger définitivement l'affichage : utiliser Date.UTC + soustraction de l'offset du fuseau source pour obtenir le vrai UTC
- [x] Vérifier visuellement le rendu après correction : 00:00-10:00 en UTC, 01:00-11:00 à Paris, 08:00-18:00 à Shanghai

## Suppression widget disponibilité flottant
- [x] Supprimer le widget AvailabilityWidget (bulle fixe en bas à gauche) — trop gros et inutile
- [x] Garder le badge header et la version étendue sur la page contact

## Simplification tooltip WhatsApp
- [x] Supprimer le gros tooltip blanc avec heures au-dessus du bouton WhatsApp — trop encombrant

## Widget navigation flottante Hallucine
- [x] Ajouter le script externe nav-widget dans client/index.html avant </body>

## Bug: Musique du rideau de cinéma ne joue plus
- [x] Diagnostiquer pourquoi la musique du rideau ne joue plus
- [x] Corriger le problème

## Bug: tRPC mutation retourne HTML au lieu de JSON
- [ ] Identifier quelle mutation tRPC cause l'erreur "Unexpected token '<'" au chargement de la page d'accueil
- [ ] Corriger le problème

## Remplacement musique rideau cinéma
- [ ] Remplacer la musique actuelle par un son authentique de projecteur 35mm (cliquetis mécanique pellicule)

## Remplacement musique compte à rebours 4-3-2-1
- [x] Remplacer la musique du compte à rebours par un son authentique de projecteur 35mm qui tourne (Mixkit "Vintage film projector working")

## Synchronisation audio/animation
- [x] Précharger le son du compte à rebours (FilmCountdown) pour qu'il démarre en même temps que l'animation
- [x] Précharger le son du rideau de cinéma (CinemaRideau) pour qu'il démarre en même temps que l'animation

## Fichiers audio intégrés au bundle (pas de CDN)
- [x] Ajouter des preload links dans index.html pour que le navigateur télécharge les MP3 en priorité dès le chargement de la page
- [x] Combiner avec le préchargement canplaythrough dans les composants pour synchronisation parfaite

## Bug: son du rideau disparu
- [x] Le son du rideau de cinéma ne joue plus après les modifications de préchargement
- [x] Pictogramme micro barré : le navigateur bloque l'autoplay audio
- [x] Solution : fusionner CinemaRideau + FilmCountdown en un seul composant avec clic "Entrer" pour déclencher son + animation

## Bug: impossible de se connecter
- [ ] Diagnostiquer l'erreur de connexion
- [ ] Corriger le problème

## Simplification rideau + logo transparent
- [x] Supprimer le compte à rebours 3-2-1 du rideau (réservé uniquement à la sélection d'écran gonflable)
- [x] Au clic sur le rideau → ouverture directe avec son du rideau (pas de countdown)
- [x] Remplacer le logo fond blanc par le logo avec fond transparent sur le rideau

## Photos d'arches manquantes
- [x] Ajouter des photos d'arches gonflables dans la galerie (6 photos réelles)
- [x] Ajouter des photos d'arches gonflables dans le sous-menu arches (6 photos réelles)
- [x] Ajouter des photos d'arches dans la section Réalisations de la page d'accueil (3 photos)

## Remplacement logo rideau
- [x] Utiliser le logo fourni tel quel (fond noir intégré au design)
- [x] Remplacer le logo actuel du rideau par le nouveau logo

## Bug: lettres HALLUCINÉ devenues rouges/transparentes
- [x] Corriger : l'image fournie était déjà transparente (PNG avec alpha), utiliser l'original tel quel sans traitement

## Amélioration ouverture rideau
- [x] Supprimer le fond noir derrière le rideau — le rideau s'ouvre directement sur la page d'accueil
- [x] Le logo Hallucine s'efface progressivement (fade-out 1.5s) pendant l'ouverture du rideau

## Bug: accent sur HALLUCINE
- [x] Vérifié : le logo fourni contient HALLUCINÉ avec accent (c'est le design du logo)

## Remplacement global des logos
- [x] Uploader le logo transparent fourni sur S3
- [x] Recadrer le logo (suppression 48% de marges transparentes) pour un rendu plus grand et lisible
- [x] Remplacer TOUS les logos du site par la version recadrée (Navbar, Footer, CinemaRideau, brochure.ts)
- [x] Tailles ajustées : Navbar h-12/h-14, Footer h-20/h-24, CinemaRideau w-[28rem]/w-[42rem]

## Bug: erreur S3 (PutObject 503 ServiceUnavailable)
- [x] Diagnostiquer : erreur temporaire Cloudflare R2/S3 (503 ServiceUnavailable) lors de l'upload de brochure PDF
- [x] Ajouter un retry avec backoff exponentiel dans storage.ts (5 tentatives, délai 500ms→ 8s)
- [x] Ajouter une gestion d'erreur gracieuse côté frontend (message adapté selon le type d'erreur)

## Correction logo rideau — taille d'origine
- [x] Logo rideau responsive : w-40 (mobile) → sm:w-52 → md:w-64 → lg:w-80 → xl:w-96 (grand écran)

## Rideau de cinéma — suppression éléments décoratifs
- [x] Supprimer les deux carrés jaunes en haut du rideau (embrasses/attaches dorées)

## Bug persistant S3 — erreur stockage en production
- [ ] Diagnostiquer la vraie cause de l'erreur S3 en production (pas juste retry)
- [ ] Corriger le bug racine

## Widget navigation Hallucine — masquer pour visiteurs
- [x] Masquer le bandeau nav (Accueil/Site Web/CRM/Devis/Carte) pour les visiteurs non connectés — visible uniquement pour les admins

## Rideau — scroll en haut de page + logo réduit
- [x] Forcer le scroll en haut de page quand le rideau s'ouvre (scroll to top au montage + au clic)
- [x] Réduire la taille du logo rideau (w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64)

## Photos arches gonflables manquantes
- [x] Ajouter les 2 photos d'arches manquantes sur /arche-gonflable (8 photos maintenant)
- [x] Ajouter les 2 photos d'arches manquantes dans la galerie (8 photos maintenant)

## Renommage alt text de toutes les photos du site
- [x] Renommer les alt text de toutes les photos avec des descriptions claires et SEO-friendly (toutes les pages)

## Lightbox vidéo
- [x] Créer un composant VideoLightbox (modale plein écran avec autoplay, fermeture Escape/clic extérieur)
- [x] Intégrer la lightbox sur GalerieVideo, EcranGeant, ModeEmploi, TentesV

## Images accessoires cassées
- [x] Corriger les 3 images cassées des accessoires (Casques, Transats, Transmetteur FM) — uploadées sur CDN

## Mode d'emploi — refonte complète avec images/vidéos/schémas
- [x] Analyser le HTML de référence pour extraire tout le contenu (images, vidéos, schémas)
- [x] Mettre à jour la page Mode d'emploi avec 12 images, 7 vidéos, 7 schémas d'étapes, lightbox images

## Mode d'emploi — alignement schémas/étapes
- [x] Chaque schéma en face de son étape correspondante (2 colonnes par étape)
- [x] Réduire la taille des schémas (max-h-64)
- [x] Espacer les étapes de la timeline (space-y-12)

## Vidéo non disponible
- [x] Retirer la vidéo "Installation écran gonflable" (_lLdMYZhz7s) du mode d'emploi et de la galerie vidéo

## Calculateurs de prix tentes gonflables
- [x] Extraire les calculateurs de prix du zip ZohoWorkDrive
- [x] Intégrer les 4 calculateurs (X, V, N, Araignée) dans la partie admin du site
- [x] Créer la page admin Calculateurs avec onglets + lien depuis le panneau admin
- [x] Implémenter le calculateur Tente X (3x3 à 8x8, 4 côtés, auvents, connexions, impressions, accessoires)
- [x] Implémenter le calculateur Tente V (4x4 à 6x6, toit, pieds, impressions)
- [x] Implémenter le calculateur Tente N (3x3 à 5x5, murs A/B/C/D+C, impressions, accessoires)
- [x] Implémenter le calculateur Tente Araignée (4x4 à 10x10, murs, auvents, impressions)

## Page Tente X — illisible, refonte
- [ ] Comparer avec le HTML de référence et refaire la page /tente-gonflable-x pour qu'elle soit lisible

## Calculateurs — refonte style Excel
- [x] Refaire le calculateur X en style Excel simple : fond blanc, tableaux clairs, 2 onglets
- [x] Réécrire CalculateurTenteAraignee en style clair (fond blanc, tableaux bordures)
- [ ] Vérifier CalculateurTenteV et CalculateurTenteN en style clair
- [ ] Ajouter export PDF au calculateur X
- [ ] Ajouter verrouillage/déverrouillage des prix avec code d'accès (6312)
- [ ] Rendre les prix éditables dans l'onglet Prix

## Refonte page Tente X (contenu public)
- [x] Réécrire la page /tente-gonflable-x avec un layout clair, lisible et professionnel
- [x] Ajouter une section héro avec image de fond et titre impactant
- [x] Structurer le contenu en sections bien distinctes avec alternance de couleurs
- [x] Améliorer la galerie photos avec lightbox
- [x] Ajouter les sections Fiabilité, Expertise, Qualité avec texte complet du site original
- [x] Tableau des caractéristiques techniques clair et lisible
- [x] Grille des tailles disponibles avec icônes visuelles
- [x] Section accessoires avec icônes et descriptions
- [x] Section personnalisation avec visuels
- [x] CTA final avec boutons contact et demande de prix
- [x] Tests et checkpoint (236 tests passent)

## Fuseau horaire admin/CRM
- [x] Champ timezone déjà présent dans la table users (schéma DB)
- [x] Créer un sélecteur de fuseau horaire dans la page Profil (dropdown avec 16 fuseaux)
- [x] Exposer le timezone via tRPC (profile.getTimezone + profile.updateTimezone)
- [x] Hook useTimezone : formatDate, formatDateOnly, formatTime selon le fuseau configuré
- [x] Appliquer le fuseau horaire configuré aux dates dans Admin.tsx (CRM)
- [x] Appliquer le fuseau horaire configuré aux dates dans AdminAuditHistory.tsx
- [x] Appliquer le fuseau horaire configuré aux dates dans Profil.tsx
- [x] Ne pas détecter automatiquement le fuseau du navigateur, uniquement sélection manuelle
- [x] Tests vitest pour le fuseau horaire (248 tests passent)

## Bouton WhatsApp — ouverture directe sans boîte de dialogue
- [x] Utiliser le protocole whatsapp:// au lieu de https://wa.me/ pour ouvrir directement l'app
- [x] Fallback vers https://wa.me/ si l'app n'est pas installée (timeout 1.5s)

## Remplacement photo héro page d'accueil
- [x] Uploader annonce2hd.jpg sur S3
- [x] Remplacer la photo héro de la page d'accueil par la nouvelle image

## Suppression effet faisceau projecteur animé
- [x] Supprimer le composant ProjectorBeam de la page d'accueil (HeroSection)

## Barre de stats héro — contraste insuffisant
- [x] Ajouter un fond semi-transparent, backdrop-blur, bordure et labels plus visibles (white/60)

## Audit lisibilité page d'accueil
- [x] Examiner visuellement chaque section de la page d'accueil
- [x] Corriger tous les textes peu lisibles : opacités (white/30→white/65, white/50→white/70), tailles (text-[10px]→text-xs, text-xs→text-sm)
- [x] Composants corrigés : HeroSection, ProductsSection, TechnologySection, UseCasesSection, StorySection, RealisationsSection, TestimonialsSection, FaqSection, ContactSection, Footer, SmartForm, Navbar, AvailabilityIndicator
- [x] Labels de section (text-xs→text-sm) : Nos produits, Technologie, Cas d'usage, Notre histoire, Réalisations, Témoignages
- [x] 248 tests passent

## Remplacement photo Gamme Étanche (section Nos produits)
- [x] Uploader imgi_6_3ECRANS1CANAPE-1-.jpg sur S3
- [x] Remplacer la photo Gamme Étanche dans ProductsSection par la nouvelle image (3 écrans + canapé rouge)

## Remplacement photo héro page Mobilier Gonflable
- [x] Remplacer l'image d'arrière-plan héro de la page Mobilier Gonflable par Meublesenpleinair.jpg
- [x] Supprimer/réduire le dégradé sombre sur le héro de la page Mobilier Gonflable

## Remplacement photo Tentes gonflables page accueil
- [x] Remplacer la photo Tentes gonflables dans la section Nos produits par tentedeprojection.jpg

## Refonte tableau comparatif page Comparaison
- [x] Refaire le tableau comparatif en style cartes côte à côte VS (Hallucine vs Concurrent) pour meilleure lisibilité
- [x] Refaire les cartes VS avec fonds clairs, icônes colorées bien visibles et contraste fort
- [x] Centrer les titres des critères dans chaque colonne du tableau VS
- [x] Centrer les titres des critères dans chaque colonne du tableau VS
- [x] Mettre le titre principal du tableau sur fond clair (pas fond sombre)
- [x] Refaire tableau VS : centrage correct, bords arrondis, espace noir autour
- [x] Supprimer la section Technologie (images Étanche/Soufflerie + comparatif de poids) de la page d'accueil
- [ ] Remettre TechnologySection dans Home.tsx
- [ ] Supprimer uniquement les deux images Étanche/Soufflerie de TechnologySection (garder le comparatif de poids)
- [x] Remettre TechnologySection dans Home.tsx (sans les images Étanche/Soufflerie)
- [x] Supprimer le tableau VS de la page Comparaison

## Centralisation gestion fuseaux horaires dans le portail d'accueil
- [ ] Créer la section "Gestion des commerciaux" dans le portail d'accueil (Dashboard)
- [ ] Interface manuelle : sélecteur fuseau horaire + statut (en ligne/hors ligne) pour DC et JB
- [ ] Supprimer la gestion fuseau du profil site web (/profil)
- [ ] Supprimer la gestion fuseau du profil CRM
- [ ] Source unique de vérité : site web et CRM lisent depuis la même table DB
- [ ] Tests vitest pour la gestion centralisée

## Centralisation gestion fuseaux horaires dans /admin
- [x] Supprimer le sélecteur fuseau horaire de la page /profil
- [x] Ajouter un panneau "Gestion des commerciaux" dans /admin (fuseau + statut DC et JB)
- [ ] Créer un endpoint API webhook pour que le CRM lise les fuseaux depuis le site web
- [ ] Mettre à jour les tests

## Tooltip heure sur boutons WhatsApp et orange
- [x] Bouton WhatsApp : tooltip au survol avec heures DC + JB (visible uniquement admin connecté)
- [x] Bouton orange disponibilité : tooltip heure de Paris si non connecté, heure du contact si connecté

## Bug tooltips heure
- [ ] Bouton WhatsApp : les heures DC/JB ne tiennent pas compte du fuseau paramétré dans le CRM
- [x] Bouton orange : rien n'apparaît au survol (tooltip repositionné en dessous avec z-index élevé)

## Suppression gestion fuseaux du site web (centralisation CRM uniquement)
- [x] Supprimer le panneau gestion commerciaux de /admin (le CRM est la seule source)
- [x] Le site web lit les fuseaux uniquement depuis le CRM via route tRPC publique

## Intégration CRM - Route publique commercials.timezones (sans token)
- [x] Créer la route tRPC publique commercials.timezones dans le CRM
- [x] Déployer le CRM avec la nouvelle route
- [x] Modifier le site web pour lire les fuseaux depuis cette route (plus de siteSettings)
- [x] Mettre à jour le fallback : Asia/Shanghai pour DC et JB (tous deux en Chine)
- [x] Tester l'intégration complète CRM → site web (248 tests passent, fuseaux chargés)

## Bug tooltip bouton orange (signalé par l'utilisateur)
- [x] Le tooltip du bouton orange corrigé — affiche "Paris HH:MM" quand non connecté, heure locale quand connecté, détails par commercial au survol

## Bugs badge disponibilité (signalés par l'utilisateur)
- [ ] Bouton vert : le badge ne s'affiche qu'après avoir ouvert WhatsApp une fois — devrait être visible dès le chargement
- [ ] Bouton orange : le tooltip ne s'affiche pas au survol (le bouton bouge mais rien d'autre)

## Modification options spectateurs formulaire contact
- [x] Changer les nombres : 5m=20, 9m=300, 11m=600, 13m=1000, 15m=5000

## Retry automatique tRPC (erreur HTML au lieu de JSON)
- [x] Ajouter un retry link dans le client tRPC pour relancer automatiquement les requêtes échouées (502/503/HTML)

## Simplification champ entreprise (un seul champ)
- [x] Supprimer le champ Ville et le lien "Rechercher sans ville" du SiretLookupField
- [x] Transformer SiretLookupField en champ texte unique avec auto-complétion API (saisie libre si pas de résultat)
- [x] Supprimer le champ texte libre "Entreprise / Organisation" séparé de l'étape 5
- [x] Pré-remplir le champ unique avec la suggestion IA (depuis l'email) si disponible

## Remplacement geo.api.gouv.fr par Zippopotam.us (code postal → ville, tous pays)
- [x] Remplacer l'appel geo.api.gouv.fr par Zippopotam.us dans l'étape 6 (Localisation) du SmartForm
- [x] Supprimer la condition "si France" : le code postal fonctionne pour tous les pays
- [x] Remettre le champ Ville auto-complété dans SiretLookupField (étape 5) — non nécessaire, le code postal est à l'étape 6

## Champs obligatoires du formulaire
- [x] Définir les champs obligatoires : Email, Produit, Code postal, Prénom
- [x] Tout le reste optionnel (nom, téléphone, entreprise, pays, ville, message)

## Bug : code postal et ville disparus de l'étape 6
- [x] Corriger l'étape 6 : le code postal et la ville ne s'affichent plus (cause : bouton étape 5 bloqué par l'IA)

## Suppression IA du formulaire + fix étape 6
- [x] Supprimer l'appel IA (extractFromEmail) et les suggestions IA du SmartForm
- [x] Supprimer le bandeau "IA a détecté" et le bouton "Accepter tout"
- [x] Champs Prénom/Nom/Entreprise deviennent des champs texte simples
- [x] Corriger l'étape 6 (Pays + Code postal + Ville) qui ne s'affiche pas — le problème était le bouton bloqué à l'étape 5 (IA)

## Réorganisation étapes formulaire
- [x] Étape 5 = Code postal + Ville (Zippopotam.us, France par défaut, détection pays auto)
- [x] Étape 6 = Prénom + Nom + Entreprise (auto-complétion API filtrée par code postal si France)
- [x] Supprimer le champ Pays séparé (détecté auto depuis code postal)
- [x] Corriger Zippopotam.us : essayer France par défaut, puis autres pays
- [x] Ajouter une étoile rouge (*) sur les champs obligatoires (Email, Produit, Code postal, Prénom)

## Correction Zippopotam.us
- [x] France testée en premier, puis autres pays seulement si France ne trouve rien
- [x] Si plusieurs villes pour un même code postal → liste déroulante pour choisir

## Bugs select villes + filtre entreprise par code postal
- [x] Corriger le style du select villes : fond sombre, texte clair, options lisibles
- [x] Passer le code postal au SiretLookupField pour filtrer la recherche entreprise

## Réorganisation étapes 5-6-7
- [x] Étape 5 = Code postal + Ville/Pays (inchangé)
- [x] Étape 6 = Entreprise (auto-complétion API)
- [x] Étape 7 = Prénom + Nom + Message + Envoi

## Fix auto-complétion entreprise
- [x] Recherche automatique à la frappe (sans Entrée) via useEffect
- [x] Debounce réduit à 300ms
- [x] Fallback : si rien trouvé avec code postal, relancer sans filtre

## Fix pays/ville persistant après correction code postal
- [x] Réinitialiser pays et ville à chaque nouvelle saisie de code postal

## Formulaire robuste — 8 améliorations
- [x] 1. Validation email stricte (regex standard + message erreur rouge)
- [x] 2. Validation téléphone (min 8 chiffres, avertissement doux)
- [x] 3. Message si code postal non reconnu + champs ville/pays éditables en fallback
- [x] 4. Trim espaces sur tous les champs avant soumission
- [x] 5. Protection anti double-soumission (guard dans handleSubmit)
- [x] 6. Validation prénom minimale (min 2 caractères)
- [x] 7. Messages d'erreur visuels sous les champs obligatoires invalides
- [x] 8. Accessibilité clavier — Enter pour avancer sur toutes les étapes

## Anti-spam invisible — 3 protections
- [x] 1. Honeypot : champ caché frontend + rejet silencieux backend
- [x] 2. Rate limiting : max 5 soumissions/heure par IP
- [x] 3. Délai minimum : rejet si soumission < 5 secondes après ouverture

## Fix debounce + reset entreprise
- [x] Debounce Zippopotam.us : 400ms → 500ms
- [x] Reset entreprise quand le code postal change

## Connexion directe site → base CRM
- [x] Ajouter secret CRM_DATABASE_URL
- [x] Créer module server/crmDirect.ts (insertion directe dans table prospects)
- [x] Modifier contact.submit pour utiliser l'insertion directe
- [x] Garder webhook en fallback
- [x] Tests vitest

## Migration webhook → insertion directe (abandon + beacon)
- [x] Migrer trackAbandon vers insertion directe CRM
- [x] Migrer beacon vers insertion directe CRM

## Dédoublonnage intelligent + suppression webhook
- [x] Dédoublonnage : abandon + email existant → mise à jour (pas de doublon)
- [x] Dédoublonnage : soumission complète + email existant → nouveau prospect + avertissement dans notes
- [x] Supprimer crmSync.ts et tous les fallbacks webhook
- [x] Supprimer crmWebhook.test.ts
- [x] Nettoyer les imports webhook dans routers.ts et index.ts
- [x] Migrer crmStatus et syncToCrm admin vers insertion directe
- [x] Tests vitest dédoublonnage (296 tests passent)

## Email de confirmation automatique au prospect
- [x] Créer server/emailTemplates.ts avec template de confirmation (remerciement + prise en compte + recontact)
- [x] Installer Resend + créer emailSender.ts avec envoi via Resend
- [x] Ajouter secret RESEND_API_KEY
- [x] Intégrer l'envoi immédiat dans contact.submit
- [x] Tests vitest (307 tests passent, envoi Resend confirmé)
- [x] Email de confirmation retiré du site (géré par le CRM)
- [ ] Test réel avec formulaire (en attente publication)

## Bug: API code postal relance la recherche au déplacement du curseur
- [x] Fix: l'API Zippopotam.us ne relance plus la recherche quand le curseur bouge (garde lastSearchedPostalRef)

## Modification adresse siège
- [x] Remplacer "Shenzhen, Chine — Fabrication : Dongguan, Chine" par "La Mure d'Isère, France"

## Charte graphique Option A — Cinéma Élégant (re-application après reset)
- [x] SmartForm : coins arrondis, champs obligatoires bg-white/15 + bordure dorée, optionnels bg-white/10
- [x] Tableaux de prix : chaque ligne entourée, coins arrondis, en-tête doré (8 pages)
- [x] FAQ : coins arrondis, bordure dorée
- [x] Remplacer tous les rounded-sm par rounded-lg (composants + pages)

## Uniformisation noms formulaire
- [x] CTA produits/hero → "Demander un devis gratuit"
- [x] Section contact page accueil → "Contactez-nous" (déjà en place)
- [x] Supprimer "Demande de prix" partout, nouvelle route /devis (anciennes routes gardées pour compatibilité)

## Bug: étape Objectif (Achat/Location/Info) ne s'affiche pas
- [x] Diagnostiquer pourquoi l'étape Objectif est absente du SmartForm (jamais créée comme étape visuelle)
- [x] Nouvelle étape 4 Objectif (Achat/Location/Information) ajoutée après options produit, total 8 étapes

## Nettoyage et audit SmartForm
- [ ] Nettoyage code : cohérence 8 étapes, code mort, commentaires
- [ ] Audit UX : propositions d'amélioration attractivité

## Nettoyage code SmartForm
- [x] Corriger commentaire d'en-tête (7→8 étapes, bon ordre)
- [x] Supprimer code mort : countryFiltered, showCountryDropdown, handleCountryInput, selectCountry
- [x] Supprimer code mort : hasSavedProgress (state jamais lu)
- [x] Supprimer code mort : handleVisibilityChange (listener vide)
- [x] Supprimer alias inputClass, utiliser inputOptionalClass directement
- [x] Supprimer lignes vides doubles
- [x] Corriger message confirmation mensonger → "Nous vous recontacterons sous 24h"
- [x] Ajouter objectif (Achat/Location/Info) au récapitulatif étape finale
- [x] Retirer fallback productDetail dans objectif du handleSubmit

## Améliorations UX SmartForm
- [x] Messages d'encouragement entre les étapes
- [x] Estimation de temps en haut ("2 min pour obtenir votre devis")
- [x] Indicateur de confiance ("Réponse sous 24h garantie")
- [x] Animation checkmark dans la barre de progression
- [x] Barre de progression améliorée avec labels
- [x] Fusionner étapes 7 (Entreprise) + 8 (Prénom/Message) → 7 étapes total

## Animation cinéma soumission SmartForm
- [x] Créer composant CinemaSuccessAnimation (clap cinéma + étoiles Hollywood + projecteur)
- [x] Intégrer l'animation dans le SmartForm à la place du simple checkmark

## Amélioration animation cinéma
- [x] Ralentir l'animation (doubler les durées de chaque phase)
- [x] Ajouter un jingle cinéma libre de droits à la soumission
- [x] Bouton mute discret pour couper le son
- [x] Centrer l'animation cinéma verticalement au milieu de l'écran

## Animation luxury brand reveal (remplacement)
- [x] Réécrire CinemaSuccessAnimation en style luxury brand reveal (fond velvet noir, anneaux dorés, logo, rugissement lion)
- [x] Texte : "Nous avons bien reçu votre demande" + sous-textes
- [x] Son : rugissement de lion au moment du logo reveal

## Corrections animation luxury reveal
- [x] Réduire le délai de démarrage (glow immédiat, logo à 1.5s, texte à 3s)
- [x] Centrer l'animation en plein écran (fixed overlay fullscreen)
- [x] Rapprocher le texte du logo et ajuster les marges
- [x] Texte animation plus lisible (plus gros, plus blanc, plus lumineux)
- [x] Bouton "Retour à l'accueil" après l'animation + redirection auto après 12s

## Unification formulaires - suppression page demande-de-prix
- [x] Supprimer la page DemandePrix.tsx (plus d'affichage de tarifs)
- [x] Ajouter redirection /demande-de-prix, /tarifs-ecran-gonflable, /devis → /contactez-nous
- [x] Mettre à jour tous les liens internes (13 fichiers) vers /contactez-nous
- [x] Supprimer le mode "gate" du SmartForm (plus nécessaire)
- [x] Nettoyer les imports et routes dans App.tsx

## Migration CRM : insertion directe → webhook
- [x] Créer service crmWebhook.ts (appel POST /api/webhook/new-prospect)
- [x] Adapter contact.submit pour utiliser le webhook au lieu de crmDirect
- [x] Adapter contact.abandonPartial pour utiliser le webhook avec abandonPartiel: true
- [x] Ajouter le champ SIRET dans les données transmises au webhook
- [x] Supprimer crmDirect.ts (insertion directe en base → .bak)
- [x] Supprimer les imports mysql2 liés au CRM (remplacés par fetch webhook)
- [x] Vérifier les secrets CRM_WEBHOOK_URL et CRM_WEBHOOK_TOKEN (déjà dans les secrets)
- [x] Écrire un test vitest pour le service webhook (9 tests)
- [x] BUG: Notifications Manus envoyées en boucle — identifier et corriger la source

## Nettoyage notifications - Le site ne fait que transmettre au CRM
- [x] Supprimer notifyOwner() des routes submit et abandonPartial
- [x] Supprimer prepareAdminEmailNotification() et pendingEmailNotifications du flux submit
- [x] Nettoyer les imports inutiles (notifyOwner, emailNotification) + emailSender.ts et emailConfirmation renommés en .bak
- [x] Vérifier les tests et le build (19 suites, 289 tests passent, 0 erreur TS)

## Correction token webhook CRM
- [x] Vérifier/synchroniser CRM_WEBHOOK_TOKEN entre le site et le CRM (erreur 403) — corrigé, prospect créé avec succès (id: 1080046)

## Modification SmartForm - Types de tentes
- [x] Changer les options "type de tente" : Tentes X, Tentes N, Tentes V, Tentes Araignées (au lieu de Événementielle, Publicitaire, etc.)

## Refonte page Écran Économique
- [x] Refaire /ecran-gonflable-economique à l'identique de l'ancien site (2 colonnes, mêmes images, même contenu)

## Refonte page Tente Gonflable X
- [x] Refaire /tente-gonflable-x à l'identique de l'ancien site (mêmes images, même contenu, même structure)
- [x] Corriger page Tente X : hero avec 4 photos en grille + sections en damier (alternance image/texte)
- [x] Remplacer photo 1 et 4 du hero Tente X par nouvelles images (Meguiar's + Ealing Eagles)
- [x] Utiliser les 4 photos du hero dans les sections damier (damier 1=photo1, damier 2=photo2, etc.)

## Bug saisie vocale
- [ ] Diagnostiquer et corriger la saisie vocale qui ne fonctionne pas

## Refonte page Tente Gonflable N
- [x] Refaire /tente-gonflable-n à l'identique de l'ancien site (mêmes images, même contenu, même structure, grille hero + damier)

- [x] Page /tente-gonflable-v : reconstruire à partir de la page anglaise hallucinecran.com/inflatable-tents-v
- [x] Page /tente-gonflable-araignee : supprimer photo 4 et mettre les photos restantes sur la même ligne
- [x] Page /tente-gonflable-araignee : supprimer le tableau des éléments disponibles
- [x] Page /arche-gonflable : supprimer les photos 4, 6, 7 et 8
- [x] Page /arche-gonflable : section Caractéristiques Techniques en 2 colonnes (texte + image éclatée)
- [x] Page /arche-gonflable : Applications possibles et Questions fréquentes en 2 colonnes côte à côte
- [x] Page /arche-gonflable : section Gamme/Applications/FAQ en 3 colonnes avec FAQ de la page anglaise
- [x] Page /mobilier-gonflable : corriger la photo coupée en haut
- [x] Page /mobilier-gonflable : damier sur 4 lignes avec les pièces de mobilier
- [x] Page /accessoire-cinema-plein-air : supprimer photos 4, 5, 6 et remplacer par canapés, cabine projection, AV packages
- [x] Page /galerie-evenements : ajouter image de fond au header
- [x] Page /galerie-evenements : ajouter 31 nouvelles photos uploadées par l'utilisateur
- [x] Retirer les effets d'étoiles et d'arrière-plan animés du site

## Galerie filtres overlay
- [x] Barre filtres en overlay sur l'image hero (top-160px) sans sticky

## Audit — Corrections critiques et haute priorité
- [x] Migrer les ~92 images de hallucinecran.com vers S3 (59 images migrées, 82 remplacements dans 10 fichiers)
- [x] Code splitting React.lazy sur les 34 pages (App.tsx)
- [x] Meta title/description dynamique par page (hook useDocumentMeta + 32 pages)
- [x] Lazy loading images (21 ajoutées) + lien Blog corrigé

## Audit — Suite des corrections
- [x] Créer sitemap.xml + robots.txt
- [x] Nettoyer les fichiers de travail inutiles à la racine (29 fichiers supprimés)
- [x] Corriger l'erreur TentesN.tsx (résolue — erreur d'état précédent, page charge sans erreur)
- [x] Corriger les liens hallucinecran.fr dans emailTemplates.ts (2 liens → hallucine-site.manus.space)
- [x] Mettre à jour sitemap.xml, robots.txt et emailTemplates.ts avec hallucinecran.fr
- [x] Corriger l'erreur d'import dans AdminDashboard.tsx (déjà corrigé, erreur ancienne dans les logs)
- [x] Ajouter les balises Open Graph (image + description) par page (22 pages + index.html)
- [x] Vérifier et corriger le responsive mobile sur les pages produits (7 fichiers corrigés)
- [x] Page 404 personnalisée avec design cinéma vintage
- [x] Optimiser les images : decoding=async (69 images) + loading=lazy (6 ajoutées) sur 25 fichiers
- [x] Intégrer Google Analytics G-JKHPG2Q6GK dans index.html
- [x] Soumettre le sitemap à Google Search Console (instructions fournies)
- [x] Ajouter le fichier de vérification Google Search Console google608a77cbc2babbfa.html

## Traçabilité des prospects (lang)
- [x] Ajouter lang: "fr" dans le payload du webhook CRM (crmWebhook.ts)

## Pré-rendu statique (SSG) pour SEO Google
- [x] Installer Puppeteer
- [x] Créer le script de pré-rendu (prerender.mjs) pour les 27 pages publiques
- [x] Configurer le serveur pour servir les HTML pré-rendus
- [x] Tester le build + pré-rendu et vérifier que le HTML contient le contenu (27/27 pages, 11507 chars de texte visible)
- [x] Vérifier que le site fonctionne normalement après le pré-rendu (289 tests passent, serveur OK)

## Fix pré-rendu SSG — inclure les HTML dans le code source
- [x] Extraire le contenu div#root de chaque page → 27 fichiers .content.html (1.4 MB total)
- [x] Modifier le serveur (vite.ts) : injection du contenu pré-rendu dans index.html au démarrage
- [x] Retirer prerender.mjs du script build (garder le script pour régénération manuelle)
- [x] Build fonctionne sans Puppeteer (24s au lieu de 5min)
- [x] Test production : pages publiques = HTML complet, pages admin = SPA vide

## Fix canonical URL — toutes les pages pointent vers la page d'accueil (bloque l'indexation Google)
- [x] Supprimer la balise canonical statique de index.html
- [x] Créer le hook useCanonical qui met à jour dynamiquement canonical + og:url selon la route
- [x] Mettre à jour aussi og:url dynamiquement
- [x] Injecter la bonne canonical dans les HTML pré-rendus (SSG)
- [x] Régénérer les fichiers .content.html avec la bonne canonical (27/27 pages)
- [x] Corriger les URLs localhost dans les fichiers pré-rendus (og:url, OAuth)
- [x] Tester et vérifier (289 tests passent)

## Données structurées Schema.org (JSON-LD) pour rich results Google
- [x] Créer le hook useStructuredData pour injecter du JSON-LD dans le head
- [x] Schema Organization : infos entreprise Hallucine (logo, adresse, téléphone, réseaux sociaux)
- [x] Schema WebSite : nom du site + SearchAction pour le sitelinks search box
- [x] Schema BreadcrumbList : fil d'Ariane sur toutes les pages (27 pages)
- [x] Schema Product : sur les pages produits (écrans, tentes, arches, mobilier, accessoires)
- [x] Schema FAQPage : sur les pages avec FAQ (accueil, écrans, tentes, comparaison)
- [x] Schema LocalBusiness : coordonnées et horaires d'ouverture
- [x] Schema Article : sur la page blog
- [x] Régénérer les fichiers pré-rendus avec les données structurées (27/27 pages, 3 JSON-LD chacune)
- [x] Fix serveur : route SSG avant express.static pour éviter que index.html soit servi directement
- [x] Test production : accueil 1 JSON-LD, ecran-gonflable 4 JSON-LD (Product+FAQ+Breadcrumb+Global), admin 0
- [x] 289 tests passent, 0 erreur TypeScript

## Fix Schema Product — erreurs Rich Results Test
- [x] Ajouter price (minPrice) dans les offres Product (12 pages produits)
- [x] Ajouter priceValidUntil (fin d'année suivante)
- [x] Régénérer les fichiers pré-rendus (27/27 pages)
- [x] JSON-LD avec price dans le head du HTML pré-rendu (vérifié)

## Corrections SEO (février 2026)
- [x] H1 dupliqué : différencier le H1 de la page d'accueil et de /ecran-gonflable
- [x] Meta description trop longue : réécrire en moins de 160 caractères
- [x] Calendrier éditorial blog : créer un plan de contenu ciblant des mots-clés longue traîne

## Audit SEO Complet — Corrections (février 2026)
- [x] Titres <title> uniques et optimisés pour chaque page (27 pages avec titres uniques dans le HTML pré-rendu)
- [x] Meta descriptions uniques pour chaque page (27 pages avec descriptions uniques dans le HTML pré-rendu)
- [x] Retirer les pages admin/profil du sitemap.xml (déjà absent — sitemap ne contient que 27 pages publiques)
- [x] Bloquer les pages admin/profil dans robots.txt (déjà en place : Disallow /admin, /profil, /api)
- [x] Ajouter balise noindex sur les pages admin/profil (hook useNoIndex ajouté sur Admin, AdminDashboard, AdminAuditHistory, AdminCalculateurs, Profil)
- [x] Vérifier les données structurées Schema.org (confirmé : Organization, WebSite, LocalBusiness, Product, FAQPage, BreadcrumbList, Article présents dans le HTML pré-rendu)
- [x] Optimiser les images : lazy loading ajouté partout (66/68 images déjà lazy, 2 corrigées). 47 images déjà en WebP. JPG/PNG restants sont sur CDN externe (manuscdn) — conversion côté serveur non applicable
- [x] Configurer redirection 301 non-www vers www (géré au niveau DNS/proxy Manus, pas dans l'app)
- [x] Convertir toutes les images JPG/PNG en WebP et ré-uploader sur le CDN (107 images converties, 0 JPG/PNG restant)

## Performance PageSpeed (février 2026)
- [x] Réduire les ressources bloquantes (Google Fonts non-bloquantes, preload hero image, sons retirés du preload)
- [x] Optimiser l'affichage des images (13 images >500KB redimensionnées 1600px max, économie ~16 MB total)
- [x] Améliorer FCP et LCP (hero image preload + fetchpriority=high + width/height explicites)
- [x] Corriger NO_LCP sur Desktop (CinemaRideau réécrit en overlay pointer-events-none, ne masque plus le contenu)
- [x] Réduire CLS (CinemaRideau ne provoque plus de layout shift, width/height sur images above-the-fold)
- [x] Réduire le bundle JS principal (1.7MB → 634KB, chatbot Streamdown lazy-loadé séparément)

## Corrections Accessibilité et Bonnes Pratiques (février 2026)
- [x] Ajouter aria-label sur tous les boutons icône sans texte visible (Navbar mobile toggle, Chatbot close/send, Lightbox close)
- [x] Augmenter la taille des zones tactiles (icônes sociales top bar + footer, liens email/phone top bar)
- [x] Corriger les erreurs console JavaScript (warning scroll position fixé, erreur Vite WebSocket = dev only)
- [x] Source maps en production : non incluses volontairement (sécurité, bonne pratique)

## Optimisation Performance PageSpeed v2 (février 2026)
- [x] Fix CLS : ajouter width/height explicites sur toutes les images (ProductsSection, TechnologySection, StorySection, RealisationsSection, Footer)
- [x] Fix CLS : ajouter sizes="100vw" sur l'image hero
- [x] Fix requêtes bloquantes : déférer Google Analytics après window.load + 2s
- [x] Fix requêtes bloquantes : déférer widget admin après window.load + 3s
- [x] Fix requêtes bloquantes : réduire les variantes Google Fonts (moins de poids)
- [x] Fix JS inutilisé : séparer framer-motion, react-dom, radix-ui en chunks distincts (manualChunks)
- [x] Fix accessibilité : aria-label sur boutons carrousel témoignages (précédent/suivant/dots)
- [x] Fix accessibilité : zones tactiles 44px minimum sur dots carrousel témoignages
- [x] Fix accessibilité : boutons navigation carrousel agrandis à 44px (w-11 h-11)
- [x] Régénérer les 27 pages pré-rendues (SSG)
- [x] Build OK + 289 tests passent

## Bug: Logo rideau cinéma sur fond blanc
- [x] Diagnostiquer pourquoi le logo s'affiche sur fond blanc au lieu de transparent
- [x] Corriger le logo pour qu'il soit transparent sur le rideau rouge (ancien logo RGB sans alpha → nouveau logo RGBA transparent uploadé sur S3)
- [x] Mettre à jour le logo dans CinemaRideau, Navbar, Footer, brochure.ts et 27 fichiers pré-rendus
- [ ] Vérifier l'affichage dans le Preview Manus

## Bug: Son rideau + affichage Preview
- [x] Plus de son à l'ouverture du rideau de cinéma (cause: headlesschrome bloquait le rideau dans le Preview → pas de clic → pas de son)
- [x] Le rideau ne s'affiche plus dans le Preview Manus (retiré headlesschrome de la détection bot)

## Restauration détection bot headlesschrome
- [x] Remettre headlesschrome dans la détection bot du rideau pour PageSpeed

## Remplacement logo par le PNG transparent original
- [x] Vérifier le nouveau logo PNG transparent (752x550, RGBA, fond transparent, 717 Ko)
- [x] Remplacer le logo dans CinemaRideau, Navbar, Footer, brochure.ts
- [x] Mettre à jour les 27 fichiers pré-rendus

## Bug: Texte manquant sur image de fond page Galerie
- [x] Le texte descriptif ajouté sur l'image de fond du hero de la page Galerie (gradient + texte en overlay)

## Bug: Texte manquant sur image de fond page Galerie
- [x] Le texte descriptif ajouté sur l'image de fond du hero de la page Galerie (gradient + texte en overlay)

## SEO: Retirer pages admin du sitemap + robots.txt
- [x] Retirer /admin, /profil du sitemap.xml
- [x] Bloquer /admin, /profil dans robots.txt avec Disallow + noindex
- [x] Ajouter meta robots noindex/nofollow dynamiquement pour /admin et /profil

## Optimisation images : recompression + redimensionnement
- [x] Extraire toutes les URLs d'images du site (hors rideau) — 153 images trouvées
- [x] Télécharger, recompresser WebP q70, redimensionner à taille utile — 153/153 OK
- [x] Ré-uploader sur CDN et remplacer les URLs dans le code — 237 remplacements dans 32 fichiers + 15 pré-rendus
- [x] Résultat : 22.9 Mo → 8.0 Mo = 14.9 Mo économisés (65%)

## Nettoyage optimisations PageSpeed inutiles/nuisibles
- [x] Identifier et supprimer will-change, contain, et autres micro-optimisations
- [x] Tester et régénérer le pré-rendu
- [x] Ajouter les balises hreflang dans client/index.html
- [x] Ajouter un sélecteur de langue (drapeaux FR/EN/DE/ES) dans la navbar

## Logo animation fin de formulaire
- [x] Remplacer le logo dans l'animation de fin de formulaire par le logo transparent (même que le rideau)

## Régénération SSG avec hreflang
- [x] Régénérer les 27 fichiers pré-rendus pour inclure les balises hreflang + sélecteur de langue

## Régénération SSG avec hreflang
- [x] Régénérer les 27 fichiers pré-rendus pour inclure les balises hreflang + sélecteur de langue

## IndexNow SEO
- [x] Intégrer IndexNow pour notifier Bing/Yandex automatiquement
- [x] Générer une clé IndexNow et ajouter le fichier de vérification
- [x] Créer un endpoint admin pour déclencher la soumission des URLs
- [x] Ajouter un bouton "Soumettre à IndexNow" dans le dashboard admin
- [x] Ajouter un bouton retour vers /admin dans la page AdminCalculateurs
- [x] FilmCountdown : jouer une seule fois par session (pas à chaque navigation entre pages écrans)
- [x] FilmCountdown : retirer de la page TentesX
- [x] Ajouter le tableau comparatif visuel des 16 critères dans la page Comparaison
- [x] Déplacer le sélecteur de langue de la navbar principale vers la top bar
- [x] Rideau : ajouter pointer-events none dès que l'animation d'ouverture est terminée
- [x] Ajouter un bouton "Voir les vidéos" dans la page Galerie photos vers /galerie-video
- [x] FilmCountdown : ajouter fondu enchaîné (page apparaît progressivement derrière le compteur)
- [x] Mettre en place un antispam plus robuste sur les formulaires
  - [x] Proof of Work (PoW) côté client
  - [x] Validation email renforcée (domaines jetables)
  - [x] Score de confiance composite côté serveur

## Images & Assets
- [x] Remplacer les 6 images de la page "Écrans gonflables étanches" par les nouvelles optimisées
- [x] Ajouter la numérotation des photos (1/6, 2/6, etc.) dans la galerie
- [x] Repositionner la numérotation en bas à droite (visible et non cachée)
