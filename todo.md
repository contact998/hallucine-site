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
