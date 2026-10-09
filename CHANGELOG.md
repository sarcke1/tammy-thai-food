## V2.06.16

- Ajout de `photo:"Salade papaye.png"` à la fiche Salade de papaye dans `v2/js/data.js`.
- Vérification : le fichier `v2/Salade papaye.png` existe bien sur GitHub.
- Cache du moteur menu actualisé dans `v2/index.html`.

## V2.06.15

- Ajout de la Salade de papaye dans les Entrées, au tarif TAF de 6 €.
- Ajout du Bœuf sauté sauce huître dans les Plats, au tarif TAF de 8 €, avec piment au choix de 0 à 3 et riz servi avec.
- Les tarifs publics notés sur les fiches (7 € pour la salade, 10 € pour le bœuf) seront à appliquer au canal client V3 lorsque la tarification par canal sera mise en place.
- Recettes internes ajoutées dans Supabase à partir des notes manuscrites ; les coûts incomplets restent à renseigner.
- Allergènes connus ajoutés au footer : cacahuètes et poisson pour la salade ; mollusques via la sauce huître pour le bœuf, sous réserve de vérification de l'étiquette fournisseur.
- La photo du bœuf est référencée dans le dépôt. La photo de la salade doit encore être ajoutée au dépôt pour apparaître sur la fiche client.
- Correction du moteur d’ajout : le niveau de piment choisi est bien conservé pour le bœuf à viande fixe.

## V2.06.14

- Correction de l’ouverture du formulaire après clic sur « Valider le panier ».
- Cache du module de commande actualisé.
- Aucun changement apporté à la logique des produits ou au calcul du panier.

## V2.06.13

- Mobile : les 4 catégories Entrées, Plats, Desserts et Boissons tiennent sur la largeur de l'écran.
- Mobile : un glissement horizontal vers la gauche ou la droite depuis n'importe quelle zone du menu change de catégorie.
- La catégorie active est mise à jour automatiquement après le swipe.
- La navigation verticale du menu reste conservée.

## V2.06.12

- Accueil du menu : catégorie « Plats » sélectionnée par défaut à l'arrivée sur le site.
- Bannière haute et pied de page : suppression du tréma dans « thai ».
- Mobile : navigation des catégories Entrées → Plats → Desserts → Boissons améliorée en défilement horizontal tactile.

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
