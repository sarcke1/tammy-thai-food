## V2.06.42 — Descriptions unitaires et alignement des boutons du menu

- Nems : description client précisée avec la viande de poulet.
- Nems et rouleau de printemps : sous-titre « Vendu à l’unité » affiché sous le nom ; suppression de la mention redondante « Vendu à la pièce » dans la description du rouleau.
- Menu PC : cartes organisées en colonne avec le bouton « Ajouter au panier » poussé en bas de chaque fiche ; les cartes d’une même rangée peuvent ainsi conserver des boutons alignés même si certaines contiennent les choix de piment.
- Fichiers modifiés : `v2/js/data.js`, `v2/js/app.js`, `v2/css/menu.css`, `v2/index.html`, `CHANGELOG.md`. V1 inchangée. Vérification PC/mobile requise après publication.
- Le prospectus n’est pas modifié dans cette version ; son réajustement fera l’objet d’une intervention distincte.

## V2.06.41 — Bannière imprimable agrandie de 33 % supplémentaires

- Hauteur de la bannière en impression augmentée de 53,2 mm à 70,76 mm (+33 % supplémentaires).
- Le reste de la mise en page, le bouton, le QR code, les fiches, les prix et les décorations ne sont pas modifiés.
- Fichiers modifiés : `v2/prospectus.html`, `CHANGELOG.md`. V1 inchangée.
- Comme la bannière occupe davantage de place, vérifier l’aperçu d’impression pour confirmer que tout tient encore sur une seule page A4.

## V2.06.40 — Bouton sur une ligne et bannière imprimée agrandie

- Bouton « COMMANDEZ AVANT 18 H » élargi et réglé pour interdire le retour à la ligne, avec une taille de texte responsive pour éviter que le « H » soit isolé.
- Bannière en version imprimable agrandie de 40 à 53,2 mm (+33 %) pour réduire l’effet écrasé observé dans l’aperçu.
- Les décorations HTML, le QR code, les fiches produits et les tarifs sont conservés. V1 inchangée.
- Fichiers modifiés : `v2/prospectus.html`, `CHANGELOG.md`. Contrôle visuel navigateur et impression à refaire après publication.

## V2.06.39 — Masquer la barre d’outils à l’impression

- Correction de la pagination : la barre d’outils du prospectus n’était plus masquée par la dernière révision et créait une première page vide avant l’affiche.
- Masquage explicite de `.toolbar` en mode impression, sans toucher au contenu du prospectus ni à sa mise en page validée.
- Bannière, QR code, fond plage, dimensions des fiches et format A4 conservés. V1 inchangée.
- Fichiers modifiés : `v2/prospectus.html`, `CHANGELOG.md`. À confirmer dans l’aperçu d’impression après publication.

## V2.06.38 — Supprimer la page blanche avant le prospectus

- Impression forcée sur une page A4 sans marge externe du navigateur, avec le prospectus limité à 286 mm de hauteur.
- Réinitialisation des hauteurs/débordements de `html` et `body` en mode impression et interdiction des sauts de page avant, après ou à l’intérieur du prospectus.
- Bannière, QR code, hauteur des fiches et décorations de la V2.06.37 conservés.
- Fichiers modifiés : `v2/prospectus.html`, `CHANGELOG.md`. V1 et données de commande inchangées.
- À valider dans l’aperçu d’impression : une page A4, sans première page blanche.

## V2.06.37 — Bannière, QR code et hauteur des plats à l’impression

- Bannière imprimée portée de 31 mm à 40 mm pour retrouver une hauteur moins écrasée.
- QR code aligné en haut à droite, à la hauteur du titre « Votre commande, prête pour le retrait ».
- Fiches de plats légèrement agrandies : photos de 48 à 54 px, cartes et espacements un peu plus hauts, typographie très légèrement augmentée.
- Format A4 et décorations en images HTML conservés. Le contenu et les prix ne changent pas ; V1 inchangée.
- Fichiers modifiés : `v2/prospectus.html`, `CHANGELOG.md`. Le contrôle de la pagination et du rendu PDF reste à faire après publication.

## V2.06.36 — Décorations imprimables et page A4 unique

- Bannière et fond plage/palmiers convertis en véritables éléments `<img>` décoratifs plutôt qu’en seules images d’arrière-plan CSS, afin qu’ils apparaissent dans l’aperçu PDF/impression même si le navigateur ignore les arrière-plans CSS.
- Styles d’impression renforcés pour préserver couleurs, rubans, bandeaux et fonds de fiches.
- Hauteur imprimable réduite à 280 mm dans la zone A4 avec marges, afin de limiter le risque de page supplémentaire blanche.
- Contenu du menu, prix collègues, QR code et logique de chargement inchangés. V1 inchangée.
- Fichiers modifiés : `v2/prospectus.html`, `CHANGELOG.md`. Aperçu PDF à vérifier après publication.

## V2.06.35 — Décorations conservées à l’impression

- Ajout des règles d’impression `print-color-adjust: exact` et `-webkit-print-color-adjust: exact` pour préserver les couleurs et les arrière-plans.
- Réaffirmation des images de bannière et de fond, du ruban décoratif, des cartes et des bandeaux en mode impression.
- Le format A4 et la disposition compacte restent inchangés. Selon le navigateur, l’option « Graphiques d’arrière-plan » peut encore devoir être activée dans la fenêtre d’impression.
- Fichiers modifiés : `v2/prospectus.html`, `CHANGELOG.md`. V1 et logique de commande inchangées.

## V2.06.34 — Prospectus : reprise globale du visuel V2

- Correction de la bannière : proportions du visuel conservées sans recadrage `cover`, comme sur le site ; bouton d’appel à la commande recalé sur sa position et ses dimensions responsive.
- Fond de plage/palmiers rétabli derrière les fiches en utilisant le même `fond d'écran.png` et le même léger voile que le site ; suppression du fond opaque qui masquait l’image.
- Titres de catégories remplacés par des bandeaux clairs, fins et arrondis avec accent corail ; suppression des gros pavés vert foncé.
- Pied de page allégé en crème et vert, au lieu d’un grand bloc vert sombre.
- Conservation du format A4 portrait, des colonnes, des prix collègues, du QR code et du chargement des données. V1 inchangée.
- Fichiers modifiés : `v2/prospectus.html`, `CHANGELOG.md`. Tests visuels et impression réelle à valider après publication.

## V2.06.33 — Identité visuelle du site sur le prospectus

- Prospectus harmonisé avec le thème V2 : réutilisation de la bannière `banniere site.png`, du fond `fond d'écran.png`, des couleurs, de la typographie et des formes de cartes du site.
- La bannière originale remplace l’en-tête graphique autonome ; un bouton d’appel à la commande reste superposé dans la zone prévue, sans répéter les textes de la bannière.
- Format portrait A4 et mise en page compacte conservés ; le contenu, les prix collègues et le chargement Supabase ne changent pas.
- Fichiers modifiés : `v2/prospectus.html`, `CHANGELOG.md`. V1, catalogue, panier et commandes inchangés.

## V2.06.32 — Prix collègues et prospectus compact

- La salade thaïe s’affiche à 8 € sur le site collègues V2 ; le tarif standard à 10 € reste conservé dans Supabase pour le site public.
- Affichage client de la salade simplifié : « servie avec du riz », choix porc/poulet et piment ; les proportions de base restent dans les notes de préparation non affichées.
- Prospectus réorganisé en deux colonnes indépendantes (Entrées + Soupes / Plats + Desserts) pour supprimer les grands espaces entre catégories ; affichage du seul tarif collègues.
- Fichiers modifiés : v2/js/data.js, v2/js/app.js, v2/index.html, v2/prospectus.html, CHANGELOG.md. V1 inchangée.

## V2.06.31 — Salade thaïe et prospectus A4

- Ajout de la salade thaïe de viande hachée aux herbes fraîches : choix porc/poulet (200 g), piment de 0 à 3, 1 échalote, 2 branches de menthe et ½ branche de citronnelle ; 10 € standard et 8 € collègues.
- Ajout du produit actif dans Supabase et dans v2/js/data.js, avec la photo présente dans le dépôt GitHub.
- Prospectus réglé pour une impression portrait sur une seule face A4 ; densité, images et typographies adaptées à la page. Tarif collègues/standard différencié pour cette salade.
- Fichiers modifiés : v2/js/data.js, v2/js/app.js, v2/index.html, v2/prospectus.html, CHANGELOG.md. V1 inchangée. Impression A4 et parcours de commande à tester.

## V2.06.30 — Début de catégorie visible

- Lors d’un changement de catégorie (bouton ou balayage horizontal), le menu défile doucement vers la première fiche de la nouvelle catégorie, sous l’en-tête fixe.
- Aucun ancrage n’est ajouté au défilement vertical normal : il reste libre entre les changements de catégorie.
- Fichiers modifiés : v2/js/app.js, v2/index.html, CHANGELOG.md. V1 inchangée.

## V2.06.29 — Retour au défilement libre

- Suppression du centrage automatique des fiches lors du changement de catégorie.
- Suppression du geste vertical qui faisait passer d’une fiche à la suivante et imposait un ancrage.
- Le défilement vertical redevient libre et natif ; le swipe horizontal pour changer de catégorie reste actif.
- Fichiers modifiés : v2/js/app.js, v2/index.html, CHANGELOG.md. Les réductions de taille des fiches et les correctifs du formulaire sont conservés. V1 inchangée.

## V2.06.28 — Ajustements d’affichage mobile

- Défilement vertical et changement de catégorie : les fiches sont centrées dans la zone visible sous l’en-tête sticky, en tenant compte de sa hauteur.
- Fiches avec choix de viande et de piment : réduction modérée de la photo, des marges, du texte et des contrôles sur petit écran pour limiter la hauteur totale.
- Formulaire mobile : le choix de la date ne déclenche plus automatiquement le clavier à l’ouverture ; après le choix, le formulaire est ramené en haut du panneau et le champ Nom reçoit le focus sans défilement parasite.
- Fichiers modifiés : v2/css/menu.css, v2/js/app.js, v2/js/checkout.js, v2/index.html, CHANGELOG.md. Versions de cache actualisées. V1 inchangée.
- Vérification du code effectuée ; validation réelle sur téléphone et PC à effectuer après publication.

## V2.06.27 — Parcours de commande et titre Nem

- Après validation réussie, la confirmation reste visible 4 secondes avant la fermeture du panier.
- Le formulaire demande d’abord de choisir une date de retrait disponible à midi ; les informations client s’affichent uniquement après ce choix.
- Correction ciblée du bouton d’envoi : le bon bouton est désactivé pendant le traitement, sans bloquer le bouton « Retour au panier ».
- Le titre du plat s’affiche « Nem maison façon thaï » au singulier dans le menu ; le nom interne « Nems maison façon thaï » reste inchangé pour préserver la correspondance Supabase et la promotion.
- Fichiers modifiés : `v2/js/checkout.js`, `v2/js/app.js`, `v2/index.html`, `CHANGELOG.md`.
- Création de compte et notation : à concevoir séparément avant implémentation. V1 inchangée ; tests de commande PC/mobile à effectuer.

## V2.06.26 — Correctifs carte, panier, calendrier et e-mails

- Carte : « Riz sauté façon thaï » sans bœuf et sans mention de sauce ; ordre des choix de viande uniformisé (porc, poulet, puis autres choix).
- « Bœuf sauté sauce huître » reste une recette au bœuf fixe ; ses options Supabase déclarent désormais le bœuf autorisé pour éviter le rejet RPC « Choix de viande invalide ».
- « Soupe de nouilles au bœuf », rouleau de printemps vendu à la pièce, nems renommés « Nems maison façon thaï » ; offre Nems affichée dans le corps de la fiche, reconnue malgré le nouveau nom et unités regroupées avant l’appel RPC pour déclencher correctement le calcul des nems offerts.
- Accord des pastilles « Servi/Servie avec du riz », choix du piment explicités par plat et viande, libellé de viande simplifié dans le panier.
- Navigation mobile : swipe horizontal pour changer de catégorie et swipe vertical pour passer à la fiche suivante/précédente, centrée à l’écran. Formulaire de commande placé au début du panneau ; panier masqué pendant la saisie, bouton « Retour au panier » ajouté, fermeture temporisée après envoi sans recharger la page.
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
