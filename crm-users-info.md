# Utilisateurs CRM Hallucine

## Utilisateurs existants
1. Eurl HALLUCINE (id: 2160095, email: contact@hallucine.fr) — initiales "EH" dans le CRM, aussi "Daniel" / "DC"
2. jonathan (id: 570200, email: jonathan@hallucine.fr) — initiales "JB" dans le CRM

## Commerciaux dans le Kanban
- DC = Daniel (Eurl HALLUCINE)
- JB = jonathan
- TU = Test User (probablement un test)

## Prochaine étape
Le site web doit être ajouté comme 3ème utilisateur. Il faut trouver l'endpoint de création d'utilisateur ou la gestion des utilisateurs dans le CRM.

## API endpoints découverts
- GET prospects.list — liste les prospects (public/authentifié)
- POST prospects.create — créer un prospect (nécessite auth)
- GET users.list — liste les utilisateurs (public/authentifié)
