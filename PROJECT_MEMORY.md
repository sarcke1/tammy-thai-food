## V2.06.13 — swipe des catégories mobile

- Les quatre catégories tiennent sur une seule ligne dans la largeur disponible du téléphone.
- Un swipe horizontal effectué depuis n'importe quelle zone du menu passe à la catégorie suivante ou précédente.
- Le swipe vertical continue à permettre le défilement normal de la page.
- La catégorie « Plats » reste la catégorie affichée par défaut.

## V2.06.11 — panier et affichage des soupes

- Suppression des repères « #1 », « #2 » dans le panier client.
- Contrôle de quantité − / + conservé uniquement pour les produits additionnables : Nems maison et Rouleau de printemps.
- Les soupes Tom kha kai, curry rouge et curry vert portent le badge « 🍚 Servi avec riz ».
- La Soupe de nouille au bœuf utilise le nom de fichier exact présent dans GitHub, avec le caractère « œ ».

## V2.06.10 — carte client et panier

- Ordre des catégories client : Entrées, Plats, Desserts, Boissons.
- Suppression du bouton « Tous ».
- Libellé des choix de protéines simplifié en « Choix ».
- Choix poulet/porc/bœuf des soupes de curry au même prix.
- Badge promotionnel Nems : « 4 achetés + 1 offert ».
- Miniatures des produits fiabilisées dans le panier.
- Contrôles − / quantité / + ajoutés dans le panier.
- Badge « 🍚 Servi avec riz » ajouté aux plats concernés.
- Suppression du grammage « 150 g » dans la fiche du sauté de poulet aux noix de cajou.

## V2.06.08 — recette interne soupe de nouille au bœuf

- Le descriptif affiché au client est volontairement distinct de la recette technique.
- La recette détaillée est stockée dans Supabase pour le calcul du coût et la préparation des informations allergènes.
- Les coûts incomplets restent à renseigner pour les boulettes, les nouilles, la coriandre et la sauce soja.

## V2.06.07 — Soupe de nouille au bœuf

- Ajout de « Soupe de nouille au bœuf » à la carte, catégorie Plats.
- Prix : 9 €.
- Piment : choix du niveau.
- Recette saisie à partir des indications fournies : 50 g de bœuf, 2 boulettes, 70 g de nouilles, coriandre, sauce soja, ail et sauce.
- Image prévue : « Soupe de nouille au boeuf.png ».

# PROJECT MEMORY

## V2.06.06 — Informations du footer dépliables

- « Allergènes » est maintenant présenté dans une section dépliable.
- « Contact » est également dépliable et indique provisoirement que l'email sera ajouté ultérieurement.
- Les informations allergènes restent à valider après finalisation des recettes et sauces Supabase.

## V2.06.05 — Regroupement des commandes dans l'administration

- Les lignes identiques sont regroupées dans l'administration selon produit, viande et niveau de piment.
- Les unités incluses par promotion sont regroupées avec les unités payantes.
- La checklist cuisine utilise également les lignes regroupées.

## V2.06.04 — Promotion Nems

- Nems maison : 4 unités payées donnent 1 unité supplémentaire incluse.
- Les multiples de 4 sont gérés automatiquement : 4 → 5, 8 → 10, 12 → 15.
- Le prix reste calculé sur les unités payées.
- La préparation tient compte des unités réellement à préparer.
- L'affichage utilise « 4 + 1 inclus » pour éviter une formulation ambiguë.
- Le traitement est effectué côté Supabase afin que le total enregistré ne puisse pas être contourné par le frontend.

## V2.06.03 — Panier

- Correction de la suppression des groupes de produits dans le panier.
- Après ajout, les compteurs de la fiche produit reviennent à 0 sans modifier les autres produits déjà présents.

V2 : sauvegarde

## V2.06.02 — Bas du site et informations consommateur

- L'en-tête ne comporte plus les liens « Commander » et « Notre histoire ».
- Le pied de page contient une première ébauche des allergènes à partir des recettes et ingrédients enregistrés dans Supabase.
- Les sauces doivent être détaillées dans Supabase avant validation définitive des allergènes.
- L'origine du poulet, du porc et du bœuf doit être renseignée à partir des informations fournisseurs.

V3 : développement actif

## V2.05 — Notification email des commandes

- Déclenchement côté Supabase après insertion d'une commande.
- Edge Function : `notify-order-email`.
- Destinataire : boîte dédiée aux commandes.
- Le frontend ne contient aucune clé email secrète.
- Le message reprend le retrait à midi, le client, téléphone, email, chaque plat, quantité, viande, niveau de piment, total et commentaire.
- Le choix de viande existant est conservé dans `order_items.customer_note` et réutilisé par la notification.
- Le fonctionnement de l'administration et de l'enregistrement des commandes reste inchangé.

Prix validés

- Pad Thaï : 10 €
- Chicken Massena : 9 €
- Sauté de poulet aux noix de cajou : 8 €
- Tom Kha Kai : 9 €
- Riz frit : 7 €
- Rouleau printemps : 2 €
- Nem : 1 €

## Sauté de poulet aux noix de cajou

- Photo : Sauté poulet cajoux.png
- Préparation : 8 min
- Poulet : 100 g
- Noix de cajou : 10 noix
- Poivron : 1
- Oignon : 1/3
- Cibettes : 2
- Sauce : 3 c. à café
- Riz thaï : 150 g
- Prix de revient matière estimé : 2,00 €
- Piment : sans piment
- Viande : poulet

Promo

4 nems achetés = 1 offert
