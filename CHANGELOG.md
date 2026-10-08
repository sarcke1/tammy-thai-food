## V2.06.11

- Panier : suppression des repères « #1 », « #2 » inutiles.
- Panier : − / + limité aux produits additionnables (Nems maison, Rouleau de printemps).
- Soupe Tom kha kai, soupe de curry rouge et soupe de curry vert : badge « 🍚 Servi avec riz ».
- Correction de la photo de la Soupe de nouille au bœuf : le fichier GitHub s'appelle réellement `Soupe de nouille au bœuf.png` et non `Soupe de nouille au boeuf.png`.

## V2.06.10

- Carte client : catégories réordonnées Entrées → Plats → Desserts → Boissons, bouton « Tous » supprimé.
- Fiches : « Choix » à la place de « Choix de la viande ».
- Soupes de curry : bœuf au même prix que poulet et porc, données Supabase mises à jour.
- Nems : promotion affichée « 4 achetés + 1 offert ».
- Panier : miniatures de tous les produits et quantité modifiable avec − / +.
- Plats servis avec riz : badge « 🍚 Servi avec riz ».
- Sauté de poulet aux noix de cajou : retrait du grammage de riz dans la description.

## V2.06.08

- Remplacement du descriptif technique affiché au client par un descriptif commercial court.
- Ajout de la recette technique dans Supabase, séparée de la fiche client, pour le coût et les allergènes.
- Ajout des ingrédients internes manquants « Boulettes de bœuf » et « Sauce soja » avec prix à renseigner.

## V2.06.07

- Ajout de la « Soupe de nouille au bœuf » à 9 €.
- Choix du niveau de piment activé.
- Description et composition de la recette intégrées à la fiche.
- Image référencée : « Soupe de nouille au boeuf.png ».

# CHANGELOG

## V2.06.06

- Sections « Allergènes » et « Contact » rendues dépliables dans le footer.
- Email de contact laissé en attente de confirmation.
- Libellé « Nems » harmonisé et promotion affichée « 4 + 1 inclus ».

## V2.06.05

- Regroupement des lignes identiques dans l'administration.
- Les informations viande/piment restent distinguées.
- Les unités promotionnelles sont regroupées avec les unités payantes.

## V2.06.04

- Mise en place de la promotion Nems : 4 unités payées + 1 unité supplémentaire incluse.
- Calcul de la promotion côté Supabase.
- Affichage de la promotion sur la fiche et dans le panier.

## V2.06.03

- Correction de la suppression des groupes dans le panier.
- Réinitialisation des compteurs après ajout au panier.

## V2.06.02

- En-tête V2 simplifié : suppression des liens « Commander » et « Notre histoire », désormais inutiles.
- Pied de page restructuré avec une première ébauche des informations allergènes et de l’origine des viandes.
- L’ébauche allergènes est basée sur les recettes/ingrédients actuellement présents dans Supabase ; les sauces et recettes manquantes restent à vérifier.
- L’origine des viandes reste à compléter à partir des informations fournisseurs avant mise en ligne définitive.

## V2.05

Notification email des nouvelles commandes : déclenchement serveur après création d'une commande, envoi vers la boîte commande dédiée, avec retrait, client, plats, quantités, viande, piment, total et commentaire. Aucun secret email dans le frontend.

## V3.00

Bootstrap DevOps.
