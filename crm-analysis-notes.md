# Analyse du CRM Hallucine

## Structure observée
Le CRM est une application web React hébergée sur hallucinecrm.manus.space. Il utilise un système Kanban pour gérer les prospects avec les étapes suivantes :

1. PROSPECT
2. TYPE DE BESOIN
3. BESOIN
4. DEVIS À FAIRE
5. DEVIS ENVOYÉ
6. APPEL TÉLÉPHONIQUE
7. NÉGOCIATION

## Navigation principale
- Prospects (Kanban)
- Contacts
- Doublons
- Auto
- Tâches
- Emails
- Devis-Facture
- Calendrier
- Commercial
- Carte

## Données d'un prospect
- Nom de l'entreprise/prospect
- Contact associé (nom)
- Commercial assigné (DC, JB, TU)
- Note (1, 2, 3, -)
- Date de réalisation
- Tâches associées (Appel, Email, Autre)
- Étape du pipeline
- Montant

## Prochaine étape
Examiner l'API du CRM en inspectant les requêtes réseau, ou cliquer sur "Ajouter prospect" pour comprendre les champs requis.
