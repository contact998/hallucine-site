# API Recherche Entreprises - Notes

## Endpoint
GET https://recherche-entreprises.api.gouv.fr/search?q={query}&per_page=5

## Paramètres utiles
- q: texte libre (SIRET, SIREN, nom entreprise)
- per_page: nombre de résultats (max 25)
- etat_administratif: "A" pour active seulement

## Structure réponse (champs utiles)
```json
{
  "results": [{
    "siren": "356000000",
    "nom_complet": "LA POSTE",
    "nom_raison_sociale": "LA POSTE",
    "siege": {
      "siret": "35600000000048",
      "adresse": "DIRECTION GENERALE DE LA POSTE 9 RUE DU COLONEL PIERRE AVIA 75015 PARIS",
      "code_postal": "75015",
      "libelle_commune": "PARIS",
      "departement": "75",
      "geo_adresse": "Rue du Colonel Pierre Avia 75015 Paris",
      "activite_principale": "53.10Z"
    },
    "activite_principale": "53.10Z",
    "categorie_entreprise": "GE"
  }],
  "total_results": 1
}
```

## Limites
- 7 req/sec max
- Gratuit, sans clé API
- Pas d'accès aux non-diffusibles
- Recherche par SIRET fonctionne via q= (pas d'endpoint dédié)
