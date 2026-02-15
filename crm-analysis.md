# CRM Hallucine - Analyse

## URL
https://hallucinecrm.manus.space/

## Structure
- Prospects (Kanban avec étapes: PROSPECT, TYPE DE BESOIN, BESOIN, DEVIS À FAIRE, DEVIS ENVOYÉ, APPEL TÉLÉPHONIQUE, NÉGOCIATION)
- Contacts
- Doublons
- Auto (automatisations?)
- Tâches
- Emails
- Devis-Facture
- Calendrier
- Commercial (DC, JB, TU)
- Carte

## Champs Prospect
- Nom de l'entreprise
- Commercial assigné (DC, JB, TU)
- Note (1, 2, 3, -)
- Contact associé (nom)
- Date de réalisation
- Tâche associée (type: Appel, Email, Autre)
- Étape pipeline
- Montant (€)

## Architecture
- App React (SPA)
- Probablement tRPC backend (même stack Manus)
- Base de données avec tables prospects, contacts, tâches, etc.

## À vérifier
- API tRPC disponible sur /api/trpc
- Structure des procédures
