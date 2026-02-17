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
