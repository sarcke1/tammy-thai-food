# ROADMAP V3 — Site client public

## État actuel
- **V3.00 — Socle du site public** : structure indépendante, styles responsive et initialisation JavaScript. Aucun panier, aucune commande et aucun paiement actif.
- Point de restauration créé : branche `backup/v2-stable-2026-10-15`, basée sur le commit existant avant le démarrage V3.
- Les exigences fonctionnelles détaillées sont consignées dans `V3_SPECIFICATIONS.md`. Les horaires et capacités exacts de retrait restent à valider.

## Versions prévues
- **V3.01 — Première fiche catalogue public** : Nems maison façon thaï, prix public 1,00 € la pièce, promotion affichée 4 achetés + 1 offert ; bouton de commande désactivé tant que le panier n'est pas développé. Les autres fiches restent à vérifier.
- **V3.02 — Panier et commande** : panier, coordonnées, numéro de commande et confirmations au client et à Tammy.
- **V3.03 — Retrait et planning** : choix de créneaux midi/soir, horaires limites, calendrier des fermetures/vacances et capacité maximale par créneau.
- **V3.04 — Administration cuisine** : file Kanban, statuts de préparation et notifications.
- **V3.05 — Paiement en ligne** : étude puis intégration sécurisée côté serveur ; paiement sur place au démarrage. Ne pas activer de paiement réel avant validation sécurité.

## Garde-fous obligatoires
- V1 inchangée ; V2 conservée et traitée comme version verrouillée.
- Tout le nouveau code client public se trouve sous `v3/`.
- Ne jamais réutiliser directement les prix V2 pour les clients : les prix collègues et les prix publics doivent rester distincts.
- Recettes, quantités de préparation et coûts restent internes ; le client ne voit que les informations commerciales et nécessaires à sa commande.
- Aucun secret Supabase ou secret de paiement dans le frontend ; opérations privilégiées et paiement validés côté serveur.
- Une fonctionnalité par intervention ; relire les fichiers GitHub avant toute modification.
- Mettre à jour `CHANGELOG.md` et `PROJECT_MEMORY.md` pour les décisions importantes.
- Tester PC et mobile avant de déclarer une version stable.
