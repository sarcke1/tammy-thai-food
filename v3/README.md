# Tammy Thai Food — V3 (site client public)

## État
V3.03 : catalogue public complet intégré (14 fiches). Le panier, les créneaux, les commandes et les paiements ne sont pas activés.

## Catalogue public
- Nems maison façon thaï : 1,00 € la pièce.
- Promotion affichée : 4 achetés + 1 offert.
- Description commerciale : nems maison au poulet, croustillants, préparés selon une recette thaïlandaise.
- Photo : fichier existant `v2/Nem.png`, référencé depuis la V3 sans modifier la V2.
- Le tarif public est défini explicitement dans la V3 et n'est pas repris du prix collègue V2 (0,75 €).

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
Vérifier et intégrer les autres fiches du catalogue public, sans reprendre les prix collègues de V2.


## V3.02 — Base de styles

Les styles modulaires de V2 sont copiés indépendamment dans `css/` (variables, layout, header, hero, menu, footer, responsive). `css/style.css` est chargé en dernier pour conserver les adaptations spécifiques du site public. Les fonctions panier/commande ne sont pas activées par cette étape.


## Catalogue V3.03

Les fiches et tarifs publics sont définis dans `js/data.js`, indépendamment des prix collègues de V2. Les catégories sont filtrables. Les boutons restent désactivés tant que le panier et le parcours de commande ne sont pas prêts. Les photos sont référencées depuis les images V2 sans modification de celles-ci.


## V3.04 — Base V2 copiée

V3 reprend maintenant une copie isolée de la structure HTML, des styles et du moteur menu/panier de V2. Les prix clients sont propres à `js/data.js`. Le formulaire s’affiche, mais l’envoi de commande est bloqué jusqu’à la mise en place des créneaux publics. Les visuels et photos réutilisent les ressources de V2 en lecture seule.
