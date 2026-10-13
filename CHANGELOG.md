## V2.06.26 — Correctifs carte, panier, calendrier et e-mails

- Carte : « Riz sauté façon thaï » sans bœuf et sans mention de sauce ; ordre des choix de viande uniformisé (porc, poulet, puis autres choix).
- « Bœuf sauté sauce huître » reste une recette au bœuf fixe ; ses options Supabase déclarent désormais le bœuf autorisé pour éviter le rejet RPC « Choix de viande invalide ».
- « Soupe de nouilles au bœuf », rouleau de printemps vendu à la pièce, nems renommés « Nems maison façon thaï » ; offre Nems affichée dans le corps de la fiche et reconnue malgré le nouveau nom.
- Accord des pastilles « Servi/Servie avec du riz », choix du piment explicités par plat et viande, libellé de viande simplifié dans le panier.
- Navigation par catégorie : centrage du premier plat affiché. Formulaire de commande placé au début du panneau ; panier masqué pendant la saisie et fermeture temporisée après envoi sans recharger la page.
- Choix de date de retrait parmi les midis ouverts entre le lundi de la semaine en cours et le lundi suivant, avec délai minimum selon l’heure. La fonction Supabase accepte uniquement une date ouverte dans cette période.
- Administration : calendrier déplacé dans un onglet dédié à côté de la déconnexion.
- E-mail de commande : date issue de `pickup_date`, lien vers l’administration, confirmation envoyée à l’adresse du client via Resend.
- Mise à jour de la fonction SQL de commande et de l’Edge Function `notify-order-email` (version déployée 8).
- Fichiers V2 modifiés : `v2/js/app.js`, `v2/js/data.js`, `v2/js/cart.js`, `v2/js/checkout.js`, `v2/index.html`, `v2/css/cart.css`, `v2/admin/index.html`, `v2/admin/admin.js`, `v2/admin/admin.css`. Supabase : produits et fonction `create_pending_order`. Edge Function : `notify-order-email`.
- V1 inchangée. Tests réels PC/mobile et test d’e-mails encore nécessaires.

## V2.06.25 — Synchronisation de l’état du panier

- Cause identifiée : `app.js` et `checkout.js` importaient deux URL versionnées différentes pour `cart.js`, créant deux instances de module et des états de panier distincts.
- `checkout.js` utilise maintenant exactement la même URL de module que `app.js` : `cart.js?v=20261008-01`.
- Cache du module checkout actualisé dans `v2/index.html` vers `20261013-01`.
- Aucun changement de prix, de contenu du panier, de logique serveur ou de V1.
- Test navigateur PC/mobile encore requis après publication.

## V2.06.24

- Correction du bouton « Valider le panier » : gestionnaire de clic directement attaché au bouton après chaque rendu du panier, au lieu de dépendre uniquement de la délégation d’événement.
- Le bouton affiche brièvement « Ouverture du formulaire… » puis déclenche l’ouverture du formulaire de commande.
- Aucun changement aux produits, prix, calculs, validation serveur ou V1.
- Fichiers modifiés : `v2/js/app.js`, `v2/index.html`, `CHANGELOG.md`, `PROJECT_MEMORY.md`. Cache du moteur menu : `20261012-03`.

## V2.06.23

- Le calcul du retrait consulte désormais le calendrier hebdomadaire Supabase.
- Si le jour calculé est fermé à midi, le retrait est reporté au prochain midi ouvert ; le délai minimal reste J+1 avant 18 h et J+2 à partir de 18 h.
- Le formulaire refuse d’enregistrer la commande si le calendrier est inaccessible ou incomplet.
- La date de retrait est stockée dans `orders.pickup_date` et affichée dans la fiche de commande de l’administration.
- Fichiers modifiés : `v2/js/checkout.js`, `v2/index.html`, `v2/admin/admin.js`, `v2/admin/index.html`, `CHANGELOG.md`, `PROJECT_MEMORY.md`. Mise à jour Supabase : colonne `pickup_date` et fonction `create_pending_order`.
- Le service client reste le retrait à midi ; les ouvertures du soir sont enregistrées dans le calendrier mais ne sont pas proposées au client dans cette étape. V1 inchangée.

## V2.06.22

- Administration : ajout d'un calendrier hebdomadaire pour activer/désactiver les services du midi et du soir pour chaque jour.
- Nouveau stockage Supabase `weekly_opening_hours`, lisible publiquement et modifiable uniquement par les administrateurs authentifiés.
- Valeurs initiales : midi ouvert du lundi au dimanche sauf le mercredi ; tous les soirs fermés. Les réglages déjà existants ne sont pas écrasés lors de l'installation.
- Fichiers modifiés : `v2/admin/index.html`, `v2/admin/admin.js`, `v2/admin/admin.css`, `CHANGELOG.md`, `PROJECT_MEMORY.md`.
- V1 et logique des commandes existantes inchangées. L'affichage client des créneaux sera raccordé séparément après validation du calendrier admin.

## V2.06.21

- Miniatures du panier rendues avec de véritables balises image, avec texte alternatif et chargement différé.
- Image de remplacement affichée si un produit n'a pas de photo ; image masquée proprement si le fichier est introuvable.
- Actualisation du cache du module menu. Aucun changement de calcul panier, de commande, d'administration ou de base de données.
- V1 inchangée.

## V2.06.20

- Descriptif de « Riz sauté au choix » précisé : contient des carottes.
- Recette Supabase mise à jour : 20 g de carottes par portion.
- Prix (7 €), photo `Riz frit poulet.png`, choix de protéines et autres ingrédients inchangés.
- Cache du catalogue actualisé. V1 inchangée.

## V2.06.19

- Renommage du dessert en « Riz gluant à la mangue ».
- Prix collègue mis à jour de 4 € à 6 € dans la carte V2 et Supabase.
- Photo réelle conservée : `v2/Sticky rice.png`.
- Le prospectus dynamique reprend automatiquement le nom et le prix depuis Supabase.
- Cache du catalogue actualisé ; V1 inchangée.

## V2.06.18

- Ajout de « Sticky rice mangue » à la catégorie Desserts, au prix existant de 4 €.
- Réactivation du produit existant dans Supabase ; aucune nouvelle ligne produit créée.
- Photo réelle utilisée : `v2/Sticky rice.png`.
- Description client : riz gluant au lait de coco, mangue fraîche, graines de sésame et touche de sucre.
- Prospectus : ajout d’une rubrique Desserts et adaptation de la grille pour afficher les quatre catégories.
- Cache du catalogue actualisé dans `v2/js/app.js` et `v2/index.html`.
- V1 inchangée. À tester sur PC et mobile après déploiement GitHub Pages.

## V2.06.17

- Ajout de `v2/prospectus.html`, un prospectus interactif partageable et imprimable.
- Les produits actifs et leurs prix sont chargés depuis Supabase ; les descriptions, photos, options de viande/piment et promotions sont repris des fiches locales validées.
- Les produits non présents dans `v2/js/data.js` ne sont pas affichés : aucun dessert ni aucune boisson n’est inventé.
- QR code vers le site de commande V2.
- Informations de retrait conformes au checkout actuel : commande avant 18 h = retrait J+1 à midi ; à partir de 18 h = retrait J+2 à midi.
- Aucun fichier du site de commande ni aucune logique V1/V2 n’a été modifié. La carte du site reste inchangée.
- Le prospectus dépend d’une connexion Internet pour charger Supabase, les photos et le QR code.

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
