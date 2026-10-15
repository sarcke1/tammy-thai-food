# ROADMAP V3 — Site client public

## État actuel
- **V3.00 — Socle du site public** : structure indépendante, styles responsive et initialisation JavaScript. Aucun panier, aucune commande et aucun paiement actif.
- Point de restauration créé : branche `backup/v2-stable-2026-10-15`, basée sur le commit existant avant le démarrage V3.

## Versions prévues
- **V3.01 — Nems** : intégrer le produit Nems au catalogue public après validation du prix public, de la promotion et de la vente à la pièce.
- **V3.02 — Commandes RATP** : cadrer et développer le parcours spécifique des commandes collègues si confirmé, sans mélanger les tarifs ni l’historique avec le site public.
- **V3.03 — Planning** : calendrier des ouvertures, jours de fermeture, capacité et créneaux de retrait.
- **V3.04 — Cuisine** : flux de commandes et statuts pour la préparation en cuisine.

## Garde-fous obligatoires
- V1 inchangée ; V2 conservée et traitée comme version verrouillée.
- Tout le nouveau code client public se trouve sous `v3/`.
- Ne jamais réutiliser directement les prix V2 pour les clients : les prix collègues et les prix publics doivent rester distincts.
- Aucun secret Supabase dans le frontend ; paiements et opérations privilégiées validés côté serveur.
- Une fonctionnalité par intervention ; relire les fichiers GitHub avant toute modification.
- Mettre à jour `CHANGELOG.md` et `PROJECT_MEMORY.md` pour les décisions importantes.
- Tester PC et mobile avant de déclarer une version stable.
