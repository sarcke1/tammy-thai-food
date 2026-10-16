## V2.06.27 — Ajout du Bò Bún au bœuf

- Nouveau plat dans V2 : « Bò Bún au bœuf », photo `v2/Bo bun.png`, catégorie Plats.
- Prix de vente proposé : 10,50 €. À valider après calcul réel des coûts matière et emballage.
- Portion de départ estimée : bœuf 100 g ; vermicelles de riz 50 g secs ; 1/5 concombre ; 1/5 carotte ; 2 branches de coriandre ; 2 feuilles de salade ; menthe fraîche ; 2 nems ; cacahuètes concassées 10–15 g ; sauce pimentée environ 20 ml (la note manuscrite « 20 cents » est interprétée comme un coût indicatif, pas comme une quantité certaine).
- Descriptif mentionnant explicitement les cacahuètes, incluses dans le prix. Allergène certain : arachides. Allergènes des nems et de la sauce à confirmer sur leurs fiches fournisseurs avant de publier une information définitive.
- Fichiers modifiés : `v2/js/data.js`, `v2/js/app.js`, `v2/index.html`, `v2/css/menu.css`, `CHANGELOG.md`, `PROJECT_MEMORY.md`. Produit ajouté dans Supabase pour l’affichage et la commande ; V1 inchangée.
- Validation visuelle réelle sur PC/mobile et test de commande encore nécessaires.

## V3.07 — Planning journalier par service (2026-10-16)

- L’administration doit montrer une ligne par date sur 60 jours, avec boutons indépendants Midi/Soir, et non un calendrier hebdomadaire d’ouvertures.
- Chaque activation crée/réactive les créneaux de 15 minutes du service daté ; chaque désactivation rend les créneaux inactifs sans supprimer les commandes existantes.
- Les fonctions de disponibilité et de création de commande publiques ne consultent plus `weekly_opening_hours`; `service_slots.active` fait foi pour chaque date/service.
- Les horaires restent midi 11 h–14 h, soir 17 h 30–21 h en semaine et 17 h 30–22 h le week-end. La capacité par créneau reste réglable. Tests end-to-end/PC/mobile à faire.

## V3.06 — Créneaux de retrait et charge de préparation (2026-10-16)

- Le planning admin ajoute une génération des créneaux sur 60 jours à partir du calendrier hebdomadaire existant.
- Horaires générés : midi 11 h–14 h ; soir 17 h 30–21 h en semaine ; soir 17 h 30–22 h samedi/dimanche. Chaque créneau dure 15 minutes.
- Les créneaux déjà existants ne sont pas réactivés ni remplacés lors d'une nouvelle génération. L'administration permet d'activer/désactiver chaque créneau et de régler sa charge maximale en minutes.
- Le site public V3 ne propose que les créneaux d'aujourd'hui et de demain encore actifs, non commencés et avec une capacité restante compatible avec le panier.
- La création de commande passe par `create_public_order_in_slot`, qui verrouille le créneau, recalcule le tarif public, contrôle les options, calcule la charge de préparation, vérifie la capacité et enregistre date/heure et origine `public` dans une transaction.
- Ajout de `orders.pickup_time` et `service_slots.max_preparation_minutes`. La capacité initiale est de 45 minutes de préparation par créneau de 15 minutes ; elle est provisoire et modifiable depuis l'administration.
- Temps de préparation de départ renseignés sur les produits publics actifs à partir des estimations de travail (Pad Thaï 10 min ; principaux plats 8 min ; rouleau 2 min ; salade papaye 5 min ; dessert 2 min ; nems 5 min). Ces estimations doivent être validées en cuisine.
- L'administration affiche maintenant l'heure de retrait sur les commandes. V1 inchangée ; le parcours client V2 n'a pas été modifié. Les règles hebdomadaires existantes restent la source des jours ouverts : il faut activer les services voulus avant de générer les créneaux.
- Aucun test de commande réelle ni test visuel PC/mobile n'a été effectué. Ne pas déclarer V3.06 stable avant validation.

### Complément V3.05 — Administration commune

- L’administration existante `v2/admin/` lit désormais `orders.sales_channel` et affiche un badge « Client public » ou « Collègue » sur chaque commande.
- Fichiers d’administration modifiés : `v2/admin/admin.js` et `v2/admin/admin.css`. Aucun fichier du site client V2 n’a été modifié.

## V3.05 — Activation sécurisée des commandes publiques (2026-10-16)

- Activation du formulaire de commande dans `v3/js/checkout.js` avec l’appel RPC séparé `create_public_pending_order`.
- Migration Supabase : ajout de `products.public_price` pour isoler les prix publics des prix collègues et de `orders.sales_channel` (valeur par défaut `colleague` pour préserver les commandes V2 existantes).
- Les 14 produits actifs disposent d’un tarif public renseigné. La fonction serveur recalcule le total avec ces tarifs, contrôle les produits actifs, les options de viande, le piment, la date de retrait midi et la promotion des nems.
- Les commandes V3 sont enregistrées avec `sales_channel='public'`, statut `pending_payment` et paiement `unpaid` (paiement au retrait). Les commandes V2 continuent d’utiliser leur fonction existante et le tarif collègue.
- L’import du panier dans le checkout V3 utilise la même version de module que le moteur du panier afin de lire le même stockage local.
- Aucun ordre de test n’a été créé en base. Vérification effectuée par lecture : RPC présente, permission d’exécution anon active, tarifs publics renseignés, fichiers V2 inchangés.
- Limite : le parcours actuellement activé concerne le retrait du midi uniquement. Le site est accessible sur GitHub Pages ; les essais PC/mobile et la vérification visuelle dans l’administration restent à faire. Ne pas déclarer V3.05 stable avant ces essais.

## V3.04 — Copie de la base complète V2 dans V3 (2026-10-15)

- Copie indépendante du HTML, des modules JavaScript panier/commande/piment/Supabase/catalogue et des modules CSS dans `v3/`.
- Le rendu, les contrôles de quantité, les options de viande/piment et le panier reprennent désormais le moteur V2, mais les fichiers sont physiquement séparés sous V3.
- Les prix affichés dans V3 sont définis dans `v3/js/data.js` avec le barème public. Le moteur d’affichage utilise le prix local V3 et non `colleaguePrice` ni le prix Supabase par défaut lorsqu’un produit correspond au catalogue local.
- Les visuels de bannière/fond et les photos produits sont référencés depuis les fichiers V2 existants en lecture seule.
- Le formulaire de commande s’affiche, mais l’envoi est volontairement bloqué : V2 utilise un calcul de retrait destiné aux collègues, incompatible avec les créneaux publics V3. Aucun ordre ne doit être envoyé avant adaptation du calendrier public.
- V1 et V2 inchangées. Test réel PC/mobile requis ; V3.04 n’est pas déclarée stable.

## V3.03 — Catalogue public complet (2026-10-15)

- Catalogue V3 autonome créé dans `v3/js/data.js` avec 14 fiches publiques : entrées, plats et dessert, photos, descriptions, catégories, options viande/piment informatives et tarifs clients.
- Affichage dynamique et filtres de catégories dans `v3/js/app.js`; mise en page adaptative dans `v3/css/style.css`; structure de catalogue dans `v3/index.html`.
- Prix publics affichés : nems 1 €/pièce (promo affichée 4 + 1 offert), rouleau de printemps 2 €, salade de papaye 7 €, Pad Thaï 10 €, Chicken Massena 9 €, sauté de poulet cajou 8 €, bœuf sauce huître 10 €, riz sauté 7 €, Tom Kha Kai 9 €, soupe de nouilles de riz au bœuf 9 €, salade thaïe de viande hachée 10 €, curry rouge 8 €, curry vert 8 €, riz gluant mangue 4 €.
- Les prix sont définis explicitement dans V3, sans import du catalogue V2. Les images existantes V2 sont référencées en lecture seule.
- Boutons de commande toujours désactivés ; pas de panier, création de commande, paiement ni appel Supabase ajouté à cette étape.
- V1 et V2 inchangées. Validation navigateur PC/mobile et vérification des images encore nécessaires ; V3.03 n'est pas déclarée stable.

## V3.02 — Copie isolée des styles modulaires de V2 (2026-10-15)

- Copie dans `v3/css/` des modules `variables.css`, `layout.css`, `header.css`, `hero.css`, `menu.css`, `footer.css` et `responsive.css` depuis les fichiers V2 réellement relus.
- V3 charge ces styles copiés puis son `style.css` spécifique en dernier, afin de conserver l’apparence publique actuelle et de préparer une adaptation progressive.
- Aucun fichier V1 ou V2 n’est modifié. Aucun JavaScript, panier, commande, tarif, Supabase ou paiement n’est activé/modifié dans cette étape.
- Validation visuelle PC/mobile après publication encore nécessaire.

## V3.01 — Première fiche catalogue public (2026-10-15)

- Première fiche V3 intégrée : Nems maison façon thaï.
- Prix public : 1,00 € par pièce ; le prix collègue V2 (0,75 €) est distinct et n'est pas repris.
- Promotion affichée : 4 achetés + 1 offert ; le calcul n'est pas encore actif.
- Description publique : nems maison au poulet. Image réutilisée en lecture seule depuis `v2/Nem.png`.
- Le bouton reste désactivé ; panier, commandes et paiement ne sont pas actifs.
- Modifications limitées au répertoire `v3/` et à la documentation V3. V1 et code fonctionnel V2 inchangés.

## V3 — Exigences fonctionnelles confirmées (2026-10-15)

- Le site V3 est le site client public ; la V2 reste le site collègues et la V1 est intouchable.
- Spécifications détaillées enregistrées dans `V3_SPECIFICATIONS.md` ; feuille de route actualisée dans `ROADMAP_V3.md`.
- Parcours prévu : panier, coordonnées, numéro de commande, confirmation client et notification Tammy.
- Services midi et soir séparés. Le client choisit un créneau parmi les disponibilités restantes. Exemples encore provisoires : commande midi entre 00 h et 13 h pour le jour même ; commande le matin pour le soir, retrait exemple 18 h–21 h. Horaires limites, durée et capacité restent à confirmer.
- Calendrier de fermetures et vacances et capacité maximale par créneau requis.
- Paiement sur place au lancement ; paiement en ligne sécurisé à intégrer plus tard avec contrôle serveur.
- Administration Kanban et notifications prévues.
- Recettes et données de préparation restent internes ; aucune clé secrète Supabase/paiement dans le frontend.
- Aucune modification de code V1/V2 dans cette mise à jour documentaire ; aucune commande/paiement activé.
- Point de restauration conservé : `backup/v2-stable-2026-10-15` (base `c1a2d79296335c33ded39f6faf7f16f081a36215`).

## V3.00 — Socle du site client public créé

- Point de restauration GitHub créé avant le travail V3 : branche `backup/v2-stable-2026-10-15`, basée sur `c1a2d79296335c33ded39f6faf7f16f081a36215`.
- Création d'un espace séparé `v3/` avec `index.html`, `css/style.css`, `js/app.js` et `README.md`.
- La page présente la marque et précise que les commandes ne sont pas disponibles ; aucun panier, paiement, ni accès Supabase n'est activé.
- V1 et V2 non modifiées par cette étape. Les prix publics ne doivent pas être importés implicitement depuis le catalogue V2, qui contient des tarifs collègues.
- Fichiers de suivi : `ROADMAP_V3.md` et `CHANGELOG.md` actualisés.
- Prochaine étape : V3.01 — vérifier le prix public du Nems et les règles de vente à la pièce/promotion avant de l'ajouter au catalogue client.

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

- Cause du bouton « Valider le panier » inopérant : `app.js` importait `cart.js?v=20261008-01`, alors que `checkout.js` importait `cart.js?v=20261006-06`. Ces URL produisent des instances de module distinctes et peuvent donner un panier vide au checkout.
- Import checkout aligné sur `cart.js?v=20261008-01` et cache checkout actualisé à `20261013-01`.
- Vérification réelle dans le navigateur PC/mobile toujours nécessaire ; V1 inchangée.

## V2.06.24 — Bouton de validation du panier

- Le bouton « Valider le panier » reçoit maintenant son gestionnaire de clic directement après le rendu de `cartContent`.
- Le clic déclenche le montage puis l’ouverture du formulaire via les événements existants `checkout:mount` et `checkout:open`.
- Le libellé change brièvement pour confirmer la prise en compte du clic.
- `v2/index.html` charge `app.js?v=20261012-03`.
- Fichiers modifiés : `v2/js/app.js`, `v2/index.html`, `CHANGELOG.md`, `PROJECT_MEMORY.md`.
- Relecture GitHub après écriture requise ; test navigateur réel PC/mobile requis. V1 inchangée.

## V2.06.23 — Calendrier relié aux commandes

- Le checkout lit les 7 lignes de service « midi » dans `weekly_opening_hours`.
- Règle minimale : avant 18 h, recherche à partir de J+1 ; à partir de 18 h, à partir de J+2. Si ce jour est fermé, sélection du prochain midi ouvert (jusqu’à 14 jours).
- Le formulaire ne soumet pas de commande si les horaires ne peuvent pas être lus ou si le calendrier est incomplet.
- `orders.pickup_date` enregistre la date structurée ; `create_pending_order` vérifie que cette date correspond au prochain midi ouvert et refuse une date fermée/invalide.
- L’administration affiche la date de retrait sur chaque commande.
- Le service client reste le retrait à midi. Les ouvertures du soir sont réglables mais ne sont pas encore proposées à la commande.
- Cache checkout : `20261012-01` ; cache admin : `20261012-02`.
- Validation navigateur PC/mobile encore requise après publication.

## V2.06.22 — Calendrier hebdomadaire d'ouverture

- Table Supabase `public.weekly_opening_hours` avec une ligne par jour (0 dimanche à 6 samedi) et période (`midi`/`soir`).
- RLS : lecture publique de la configuration d'ouverture ; écriture réservée aux comptes `authenticated` validés par `public.is_admin()`.
- Seed initial idempotent : midi ouvert tous les jours sauf mercredi ; soir fermé tous les jours. Les lignes existantes sont préservées.
- `v2/admin/index.html` : panneau calendrier dans le tableau de bord.
- `v2/admin/admin.js` : chargement et sauvegarde de chaque case, retour visuel d'erreur.
- `v2/admin/admin.css` : mise en forme responsive.
- Cache admin actualisé vers `20261012-01`.
- Étape suivante : raccorder la configuration au parcours client (créneaux réellement proposés/validés), puis tester PC/mobile.

## V2.06.21 — Miniatures du panier

- `v2/js/app.js` : le panier affiche les photos produits en balises `img` réelles, avec URL GitHub Pages encodée, alt et chargement différé.
- `v2/css/cart.css` : style des miniatures et visuel de secours sans photo.
- `v2/index.html` : cache du module app actualisé vers `20261012-02`.
- Aucun changement de logique panier/checkout ni de Supabase. V1 inchangée.
- À valider sur mobile et PC en ajoutant plusieurs plats au panier et en contrôlant les photos.

## V2.06.20 — Carottes dans le riz sauté

- Produit concerné : `Riz sauté au choix`.
- Description client mise à jour pour mentionner les carottes explicitement.
- Dans Supabase, ingrédient Carotte de la recette existante : quantité `20 g` par portion (auparavant 1/6 de pièce).
- Prix conservé à 7 €, photo `Riz frit poulet.png`, choix poulet/bœuf/porc/crevettes inchangés.
- Fichiers modifiés : `v2/js/data.js`, `v2/js/app.js`, `v2/index.html`, `CHANGELOG.md`, `PROJECT_MEMORY.md`; base Supabase : description produit et quantité de carottes.
- V1 inchangée. À valider sur PC et mobile.

## V2.06.19 — Prix collègue du riz gluant à la mangue

- Nom client : `Riz gluant à la mangue`.
- Prix collègue V2 : 6,00 €.
- Photo réelle conservée : `v2/Sticky rice.png`.
- Produit Supabase existant mis à jour, sans créer de doublon ; prix 6,00 €, nom harmonisé avec `v2/js/data.js`.
- Prospectus dynamique synchronisé par sa lecture des produits actifs Supabase.
- Fichiers modifiés : `v2/js/data.js`, `v2/js/app.js`, `v2/index.html`, `CHANGELOG.md`, `PROJECT_MEMORY.md` et ligne produit Supabase.
- Cache actualisé pour l'affichage V2. V1 inchangée.

## V2.06.18 — Dessert Sticky rice mangue

- Produit Supabase existant réactivé : `Sticky rice mangue`, prix 4,00 €, catégorie Desserts.
- Image réelle du dépôt : `v2/Sticky rice.png`; `image_url` enregistré dans Supabase comme `Sticky rice.png`, conformément au format des autres produits.
- Description client : « Riz gluant au lait de coco, accompagné de mangue fraîche, de graines de sésame et d’une touche de sucre. »
- Fiche ajoutée à `v2/js/data.js` avec id local `sticky-rice-mangue`, photo, catégorie et tarif.
- Cache de `data.js` actualisé dans `v2/js/app.js`; cache du module menu actualisé dans `v2/index.html`.
- `v2/prospectus.html` affiche désormais aussi la catégorie Desserts.
- Fichiers modifiés : `v2/js/data.js`, `v2/js/app.js`, `v2/index.html`, `v2/prospectus.html`, `CHANGELOG.md`, `PROJECT_MEMORY.md`, et la ligne produit existante dans Supabase.
- Recette manuscrite lue : 1/2 mangue, 100 g de riz, 200 ml de lait de coco, 1 g de graines de sésame et sucre (unité manuscrite incertaine, non enregistrée comme quantité structurée).
- Aucun changement V1. Vérifier affichage photo, prix, panier, commande et prospectus sur PC et mobile.

## V2.06.17 — Prospectus interactif dynamique

- Nouvelle page autonome : `v2/prospectus.html`.
- URL publique attendue : `https://sarcke1.github.io/tammy-thai-food/v2/prospectus.html`.
- Le prospectus charge les produits actifs et les prix depuis Supabase, puis associe les photos, descriptions, options et promotions aux fiches correspondantes de `v2/js/data.js`.
- Seuls les produits connus dans la carte locale sont affichés ; aucun dessert ni aucune boisson n’est ajouté par invention.
- Le prix affiché provient du produit actif dans Supabase, pour rester synchronisé avec la carte de commande.
- QR code cible `https://sarcke1.github.io/tammy-thai-food/v2/`.
- Retrait repris de `v2/js/checkout.js` : avant 18 h, J+1 à midi ; à partir de 18 h, J+2 à midi. Le prospectus indique le retrait à Champhol, pas la livraison.
- Fichiers modifiés : ajout de `v2/prospectus.html`, mise à jour de `CHANGELOG.md` et `PROJECT_MEMORY.md`. Aucun fichier de la V1 ou du site de commande n’a été modifié.
- Dépendances : connexion Internet requise pour charger Supabase, les photos et le QR code.
- À valider après publication : affichage sur PC et mobile, lecture du QR code et concordance de tous les tarifs.

## V2.06.16 — photo Salade de papaye

- Fiche `salade-papaye` : `photo:"Salade papaye.png"`.
- Le fichier image existe dans `v2/Salade papaye.png` sur GitHub.
- Cache du moteur menu actualisé dans `v2/index.html`.

## V2.06.15 — Salade de papaye et bœuf sauté sauce huître

- Salade de papaye ajoutée aux Entrées au tarif TAF de 6 € ; tarif public prévu sur la fiche manuscrite : 7 €.
- Bœuf sauté sauce huître ajouté aux Plats au tarif TAF de 8 € ; tarif public prévu : 10 €.
- Bœuf : piment au choix de 0 à 3, servi avec riz ; photo du dépôt référencée.
- Recettes internes saisies dans Supabase à partir des quantités manuscrites. Les prix d'achat inconnus sont laissés non renseignés ; le coût matière n'est donc pas validé.
- Allergènes connus : salade de papaye = cacahuètes et poisson (sauce poisson) ; bœuf sauce huître = mollusques via la sauce huître. Vérifier l'étiquette exacte de la sauce fournisseur.
- La photo client de la salade n'est pas encore présente dans le dépôt GitHub ; la fiche affiche provisoirement le fond de remplacement jusqu'à l'ajout du fichier image.
- Le moteur d'ajout conserve le niveau de piment choisi pour le bœuf à viande fixe.

## V2.06.14 — ouverture du formulaire de commande

- Le formulaire de validation s'affiche via un gestionnaire d'ouverture dédié.
- Le module de commande est chargé avec une version de cache actualisée.
- Le panier et le calcul des commandes ne sont pas modifiés.

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
