# Tammy Thai Food — V3 (site client public)

## État
V3.00 : socle visuel indépendant créé. Aucune commande n'est encore activée.

## Règles d'architecture
- Le site public vit dans `v3/`.
- La V1 et la V2 restent intactes.
- Ne pas importer directement le catalogue V2 pour afficher les tarifs : la V2 utilise des prix collègues. La carte publique et ses prix doivent être définis explicitement.
- Aucun secret Supabase dans le navigateur. Les opérations privilégiées et la création des paiements devront être vérifiées côté serveur.
- N'activer les paiements réels qu'après validation du parcours de commande, de la sécurité et des remboursements/annulations.
- Une fonctionnalité à la fois ; mettre à jour `CHANGELOG.md` et ce document à chaque décision importante.
- Valider sur PC et mobile avant de déclarer une version stable.

## Périmètre prévu
- Catalogue public, prix publics, photos, descriptions et allergènes vérifiés.
- Choix des options de viande et du piment.
- Panier et récapitulatif.
- Créneaux de retrait, calendrier d'ouverture et capacité.
- Commande et confirmation.
- Paiement en ligne sécurisé dans une étape séparée.
- Suivi client et intégration à l'administration sans mélanger les règles de prix V2/V3.

## Étape suivante
V3.01 — transfert contrôlé du produit Nems, après vérification du prix public et des règles de quantité/promotion.
