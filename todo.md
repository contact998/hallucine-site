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
