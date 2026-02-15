# API CRM Hallucine - Structure

## Base URL
https://hallucinecrm.manus.space/api/trpc

## Endpoints découverts
- `prospects.list` (GET) — Liste tous les prospects
- `prospects.create` (POST) — Créer un prospect (à tester)

## Structure d'un prospect (champs)
- id: number (auto-incrémenté)
- entreprise: string (nom entreprise) — REQUIS
- valeur: string (montant, ex: "0.00")
- contactType: string | null
- produit: string | null
- personne: string | null (nom du contact)
- prenom: string | null
- telephone: string | null
- email: string | null
- numeroDevis: string | null
- column: string (étape pipeline: "prospect", "type_de_besoin", "besoin", "devis_a_faire", "devis_envoye", "appel_telephonique", "negociation")
- order: number
- status: string ("en_cours", "en_veille", "gagne")
- horizon: string | null
- dateRappel: Date | null
- dateMiseEnVeille: Date | null
- notes: string | null
- siret: string | null
- adresse: string | null
- ville: string | null
- codePostal: string | null
- pays: string | null
- formeJuridique: string | null
- needsAttention: boolean
- rating: number (0-3)
- montantGagne: number | null
- dateGagne: Date | null
- dateRealisationEnvisagee: Date | null
- createdBy: string
- updatedBy: string
- createdAt: Date
- updatedAt: Date

## Champs requis pour création
D'après le formulaire UI :
- entreprise (obligatoire)
- dateRealisationEnvisagee (obligatoire, max 6 mois)
- siret (optionnel)
- prenom (optionnel)
- personne (nom, optionnel)
- email (optionnel)

## Mapping depuis les soumissions du site Hallucine
- submission.nom → prospect.personne
- submission.prenom → prospect.prenom
- submission.email → prospect.email
- submission.telephone → prospect.telephone
- submission.societe → prospect.entreprise
- submission.produit → prospect.produit
- submission.message → prospect.notes
- submission.type (vente/location) → prospect.contactType
