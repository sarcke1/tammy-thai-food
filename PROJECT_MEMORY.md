## V3.08 — État de l'intégration paiement (2026-10-21)

- Travail isolé sur la branche `v3.08-payment-integration`, basée sur le code récent de `main` ; ne pas fusionner directement l'ancienne branche `v3.08-payment`, qui est en retard sur des correctifs du site.
- Parcours prévu : panier V3 → Edge Function `payment-start` → Stripe Checkout ou PayPal → webhook signé et/ou vérification serveur via `payment-confirm` → mise à jour du paiement Supabase.
- Espèces au retrait conservées comme choix par défaut. Les clés privées restent exclusivement dans les secrets Supabase.
- Migration préparée à partir de la définition SQL actuelle afin de préserver les tarifs et règles de commande récentes. Migration appliquée à Supabase ; Edge Functions de paiement déployées en v1 ; le frontend V3 reste isolé dans cette branche et n'est pas encore publié. Secrets Stripe et webhook à configurer ; aucun paiement sandbox testé.
- Le formulaire de paiement Stripe configuré dans le tableau de bord ne suffit pas à lui seul : le lien Checkout est créé côté serveur par l'API Stripe et les webhooks doivent être configurés séparément.

## 2026-10-21 — Publication V3 à la racine du domaine

- La page `index.html` à la racine sert désormais le contenu HTML de V3 pour le domaine `tammythaifood.fr`, en chargeant CSS/JS depuis `/v3/`.
- L’ancienne page d’accueil V1 n’est plus servie à la racine, mais ses fichiers historiques restent conservés pour un retour arrière. Le dossier V3 reste en place.
- V2 collègues et son administration restent sur leurs liens GitHub Pages distincts.
- Fichiers modifiés : `index.html`, `CHANGELOG.md`, `PROJECT_MEMORY.md`.
- Tests PC/mobile et commande test à effectuer après déploiement.

## 2026-10-21 — Correctifs photos V2/V3 et formulaire admin

- Photos : suppression des guillemets autour de l’URL dans `background-image` afin que les guillemets ne ferment pas prématurément l’attribut HTML `style`. Le chemin varie selon GitHub Pages (`/tammy-thai-food/v2/`) ou le domaine personnalisé (`/v2/`).
- Administration : déclaration `async` ajoutée à `changeOrderStatus`, qui contient `await`. L’erreur de syntaxe empêchait tout le module d’administration de se charger et donc l’interception du formulaire de connexion.
- Cache renouvelé pour les trois moteurs/pages concernés. V1 non modifiée.
- Fichiers : `v2/js/app.js`, `v3/js/app.js`, `v2/index.html`, `v3/index.html`, `v2/admin/admin.js`, `v2/admin/index.html`, `CHANGELOG.md`, `PROJECT_MEMORY.md`.
- Tests navigateur réel encore nécessaires.

## 2026-10-21 — Chemins de photos selon le domaine

- Les moteurs V2/V3 choisissent explicitement `/tammy-thai-food/v2/` sur GitHub Pages et `/v2/` sur le domaine personnalisé.
- Les photos de menu et miniatures du panier partagent cette base. Cache actualisé dans les deux pages index.
- Fichiers modifiés : `v2/js/app.js`, `v2/index.html`, `v3/js/app.js`, `v3/index.html`, `CHANGELOG.md`, `PROJECT_MEMORY.md`.
- V1 et authentification admin non modifiées ; test navigateur nécessaire.

## 2026-10-21 — Chemins des photos compatibles avec le domaine personnalisé

- Les photos des cartes et du panier utilisaient un chemin fixe `/tammy-thai-food/v2/`, qui ne fonctionne pas à la racine du domaine `tammythaifood.fr`.
- V2 et V3 utilisent maintenant `new URL("../../v2/", import.meta.url)` comme base des images, conservant les fichiers image dans `v2/` et prenant en charge GitHub Pages comme le domaine personnalisé.
- Paramètres de cache de `v2/js/app.js` et `v3/js/app.js` renouvelés dans leurs pages HTML.
- Fichiers modifiés : `v2/js/app.js`, `v2/index.html`, `v3/js/app.js`, `v3/index.html`, `CHANGELOG.md`, `PROJECT_MEMORY.md`.
- V1 et l’authentification de l’administration ne sont pas modifiées. Tester les photos du menu et les miniatures du panier sur PC/mobile après publication.

## V2.07 — E-mail lorsque la commande est prête au retrait

- Confirmation initiale envoyée à la création de commande par `notify-order-email` (Brevo).
- Un e-mail distinct est envoyé au client quand `orders.status` passe à `ready`.
- Le trigger `trg_notify_order_email` est exécuté après insertion et mise à jour ; la fonction SQL ne déclenche l’appel webhook sur UPDATE que lors d’une transition vers `ready`.
- Edge Function active en version 13. Code synchronisé avec `supabase/functions/notify-order-email/index.ts`.
- La réponse HTTP 200 de Brevo/Supabase confirme l’acceptation du traitement, mais ne garantit pas la livraison finale dans la boîte du destinataire.

## V2 collègues — Correction de la validation du panier (20 octobre 2026)

- Erreur observée : « Choix de sauce invalide » lors de la validation d’un panier contenant notamment un rouleau de printemps et une soupe de nouilles au bœuf.
- Cause confirmée dans `supabase/migrations/20261017103000_v2_bobun_sauce_selection.sql` : `create_pending_order` n’autorise le champ `sauce` que pour les produits dont le nom commence par « Bò Bún ». Or `v2/js/app.js` transmettait l’état de sauce par défaut à tous les produits.
- Correction : `v2/js/app.js` ne transmet la sauce que si le produit propose `sauceOptions`; `v2/js/checkout.js` ne transmet le champ sauce et la note que pour le Bò Bún, et ignore les anciennes valeurs sauvegardées sur les autres articles. Cache actualisé dans `v2/index.html`.
- Fichiers modifiés : `v2/js/app.js`, `v2/js/checkout.js`, `v2/index.html`, `CHANGELOG.md`, `PROJECT_MEMORY.md`. V1 inchangée. Tester une commande collègue sur PC et mobile avant de considérer le correctif stable.

## V3.14 — Correction du sélecteur individuel de sauce du Bò Bún

- Le Bò Bún chargé depuis Supabase reçoit un UUID comme `dish.id`. Le test `dish.id === "bo-bun"` était donc faux ; le sélecteur restait générique et n’imitait pas celui des accompagnements des ailes de poulet.
- Ajout de `localId: local?.id` aux produits issus de Supabase. Le sélecteur et l’ajout au panier utilisent maintenant `dish.localId === "bo-bun"` pour associer une sauce indépendante à chaque unité.
- Fichiers modifiés : `v3/js/app.js`, `v3/index.html`, `CHANGELOG.md`, `PROJECT_MEMORY.md`. V1/V2 inchangées. À tester sur PC/mobile et avec deux Bò Bún aux sauces différentes.

## V3.13 — Sauce individuelle du Bò Bún et nom du plat enfant

- Le Bò Bún accepte maintenant une sauce indépendante pour chaque unité commandée. Les choix sont initialisés à « Sauce non pimentée » ; l’utilisateur peut sélectionner une sauce pimentée ou non pimentée pour chaque plat. Le panier conserve le choix de chaque unité séparément.
- Le nom présenté au client pour le produit enfant est « Ailes de poulet frit ». Le nom source utilisé pour retrouver sa fiche locale reste inchangé dans la donnée de référence ; l’affichage est ajusté dans le moteur V3.
- La sauce individuelle est conservée dans `order_items.customer_note` lors de la validation. Le nom client « Ailes de poulet frit » est converti vers le nom Supabase d’origine à la commande, sans modifier la base.
- Fichiers : `v3/js/app.js`, `v3/js/checkout.js`, `v3/js/data.js`, `v3/index.html`, `CHANGELOG.md`, `PROJECT_MEMORY.md`.
- V1 et V2 laissées intactes. Tester l’ajout de 2 Bò Bún avec sauces différentes et la catégorie Enfants sur PC/mobile.

## V3.12 — Correction de la catégorie Enfants

- Cause identifiée : `v3/js/app.js` excluait explicitement les produits Supabase dont la catégorie était « Enfants », même lorsqu'ils étaient actifs.
- Correction : suppression de ce filtre d'exclusion. Le menu enfant actif est maintenant inclus dans les données du menu client.
- Fichiers modifiés : `v3/js/app.js`, `v3/index.html`, `CHANGELOG.md`, `PROJECT_MEMORY.md`.
- V1 et V2 laissées intactes pour cette correction. Vérification finale à faire sur PC et mobile.

## 2026-10-20 — Correctif disponibilité soupe de nouilles au bœuf

- V3 : la « Soupe de nouilles au bœuf » est associée explicitement à la protéine obligatoire « Bœuf », sans modifier sa fiche ni son affichage.
- Quand le bœuf est désactivé, le plat est masqué, les articles concernés sont retirés du panier et le checkout bloque toute ligne devenue indisponible.
- Fichiers modifiés pour ce correctif : `v3/js/app.js`, `v3/js/checkout.js`, `v3/index.html`, `CHANGELOG.md`, `PROJECT_MEMORY.md`. V1 et V2 inchangées.
- Vérification du code effectuée ; test réel PC/mobile encore requis avant validation stable.

## 2026-10-20 — Finalisation technique des disponibilités

- Les menus V2/V3 actualisent les produits et les protéines toutes les 60 secondes.
- Le Tom kha kai est traité comme un plat à poulet fixe pour le filtrage et la validation, sans changer l’interface de choix de viande.
- Les scripts et feuilles de style liés aux disponibilités ont des paramètres de cache actualisés.
- Les protections de validation des paniers V2/V3 retirent les articles indisponibles et interrompent la validation pour que le client vérifie le panier.
- Tests automatisés et validation visuelle PC/mobile non encore réalisés ; ne pas considérer la fonctionnalité comme stable avant ces contrôles.

## 2026-10-20 — Gestion des disponibilités

- L’administration commune `v2/admin/` comporte un onglet « Disponibilité » pour activer/désactiver les fiches produits et les protéines.
- `products.active` pilote la disponibilité d’un produit sans supprimer sa fiche.
- Nouvelle table Supabase `protein_availability` : Porc, Poulet, Bœuf, Crevettes et Poisson, avec lecture publique et modification réservée aux administrateurs authentifiés via `is_admin()`.
- Les menus V2 et V3 retirent les produits désactivés ; dans les plats à choix multiples, une protéine en rupture reste affichée avec « Indisponible » et ses boutons de quantité sont supprimés. Un plat à protéine fixe indisponible est masqué.
- Le panier local est nettoyé quand un produit ou la protéine sélectionnée devient indisponible. La validation de commande revérifie les disponibilités et bloque l’enregistrement si des lignes ont été retirées.
- Actualisation automatique des menus toutes les 60 secondes. La V1 n’est pas modifiée.
- À valider manuellement sur PC et mobile avant de déclarer cette évolution stable.

## 2026-10-19 — Menu enfant ailes de poulet frit

- V3 uniquement : « Menu enfant — ailes de poulet frit », 6 €, catégorie Enfants, trois ailes et accompagnement au choix : frites ou riz blanc.
- V2 collègues : le produit est filtré et n’est pas proposé.
- Supabase : produit actif en catégorie Enfants ; recette estimée 1,50 € avec riz (1 € les 3 ailes + 0,50 € de riz). Le coût des frites reste à renseigner et n’est pas inclus dans cette estimation.
- Le choix d’accompagnement est transmis dans la commande.
- Photo reçue, mais le fichier image n’a pas encore été publié dans les assets du dépôt ; la fiche utilise temporairement le fond de secours.
- V1 inchangée ; tests PC/mobile et commande de test à effectuer.

## 2026-10-19 — Promotion satay par lots de trois (finalisation)

- V2 collègues : pastille « Offre : les 3 pour 4 € » ; calcul par groupe de trois à 4 €, puis 1,50 € par brochette restante.
- V3 public : pastille « Offre : les 3 pour 5 € » ; calcul par groupe de trois à 5 €, puis 2 € par brochette restante.
- Le panier regroupe les brochettes satay et affiche le total promotionnel. Le checkout regroupe la quantité avant l’appel RPC.
- Les fonctions Supabase create_pending_order et create_public_order_in_slot recalculent maintenant le total promotionnel côté serveur et enregistrent le bon total de ligne.
- Exemples : V2 1=1,50 €, 2=3 €, 3=4 €, 4=5,50 €, 6=8 € ; V3 1=2 €, 2=4 €, 3=5 €, 4=7 €, 6=10 €.
- V1 inchangée. Tests de navigateur réels PC/mobile et commandes de test encore à effectuer.

## 2026-10-19 — Brochettes de filet de poulet satay sur V2 et V3

- Deux choix au menu pour rendre la promotion simple à commander sans changer le moteur de panier : 1 brochette et un lot de 3 brochettes.
- Recette décrite comme filet de poulet mariné, grillé et accompagné d’une sauce satay à part ; produit non épicé.
- Base matière interne par brochette : 75 g de filet de poulet + 0,20 € de sauce satay. Ce n’est pas le coût de revient complet : prix d’achat du poulet, marinade, pertes et emballage restent à ajouter avant calcul de marge.
- Tarifs V2 collègues : 1,50 € la brochette, 4 € le lot de 3. Tarifs V3 clients : 2 € la brochette, 5 € le lot de 3.
- Photo utilisée : `v2/Brochette poulet satay.png`.
- Base matière : 75 g de filet de poulet et 0,20 € de sauce par brochette. Coût complet non calculé (autres ingrédients, pertes et emballage à ajouter).
- Allergènes de la sauce satay et de la marinade non confirmés ; le menu invite à vérifier les fiches fournisseurs au lieu de présenter une liste non vérifiée.
- V1 inchangée. Commande réelle et affichage PC/mobile à tester.

## 2026-10-18 — Photo du Tom Yum raccordée

- Utilisation de l’image déjà présente dans le dépôt : `v2/Tom yum crevette poisson blanc et poulet.png`.
- Le catalogue V2 et V3 pointe désormais vers ce même fichier, servi depuis le répertoire V2 commun aux deux sites.
- L’image produit Supabase utilise le même nom de fichier pour garder l’affichage cohérent avec le catalogue local.
- V1 inchangée. Affichage navigateur PC/mobile à vérifier.

## 2026-10-18 — Tom Yum aux crevettes, poulet et poisson

- Recette fournie : 2 crevettes, ½ tomate, 1 champignon, 50 g de poulet, 50 g de poisson, 1 gousse d’ail, ¼ d’oignon, 1 branche de coriandre, 1 cuillère à café de pâte de piment et 10 cl de lait de coco.
- Description publique : soupe thaïlandaise Tom Yum au lait de coco, crevettes, poulet, poisson, champignons, tomate et coriandre ; piment au choix.
- Prix collègue V2 : 10 €. Prix client V3 : 11 €.
- Préparation estimée initialement à 10 minutes ; à valider en cuisine.
- Allergènes identifiés à partir de la recette : crustacés (crevettes) et poisson.
- Photo non encore ajoutée au dépôt ; vignette de remplacement en attendant.
- V1 inchangée ; V2 et V3 utilisent le même produit Supabase avec tarifs distincts.

## 2026-10-17 — Bò Bún sur V2 et V3

- Description souhaitée : belle description culinaire, aucun poids, aucun allergène dans la fiche.
- Choix obligatoire de sauce distinct du piment : « Sauce non pimentée » ou « Sauce pimentée », non pimentée par défaut. Le Bò Bún ne doit pas afficher le contrôle générique de niveau de piment.
- Les allergènes restent dans le menu déroulant du bas de page ; arachides (cacahuètes) identifiées, autres allergènes des nems/marinade/sauces à confirmer selon les étiquettes fournisseurs.
- Choix de sauce transporté jusqu’aux détails de commande et visible dans l’administration.
- Fichiers clients modifiés uniquement dans V2 et V3 ; V1 inchangée.

## V2.06.27 — Fiche Bò Bún et choix de sauce

- Bò Bún : description gourmande sans poids ni allergènes ; la mention des cacahuètes concassées reste dans la description.
- Choix de sauce distinct du piment : « Sauce non pimentée » ou « Sauce pimentée », non pimentée par défaut.
- Le choix est conservé dans le panier et transmis avec la commande dans la note de l’article.
- Fichiers : `v2/js/data.js`, `v2/js/app.js`, `v2/js/cart.js`, `v2/js/checkout.js`, `v2/index.html`, documentation projet.
- V1 inchangée ; tests PC/mobile et vérification du rendu des notifications encore nécessaires.

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


## Correctif V3.08.02 — Heure de retrait e-mail (2026-10-22)

- `supabase/functions/notify-order-email/index.ts` lit maintenant `pickup_time` et inclut l'heure réelle du retrait dans les e-mails client et admin, au lieu d'ajouter systématiquement « midi ».
- Fonction déployée dans Supabase, version 16. À vérifier lors de la prochaine commande test.
- Les autres demandes (libellé « choix unique », tarifs V2, tri des archives, délivrabilité des e-mails, horaires d'ouverture V2) restent à traiter séparément, une zone à la fois.


## Correctif prix V2 — 2026-10-22

- Cause confirmée : `v2/js/data.js` déclare `colleaguePrice: 8` pour « Salade thaïe de viande hachée aux herbes fraîches », tandis que `public.products.price` était à 10. Le checkout serveur `create_pending_order` utilise `products.price`, d'où l'écart entre panier collègue et total enregistré.
- Correction appliquée : `products.price = 8.00`, `products.public_price` reste à 10.00 pour V3. Vérifié après migration. Satay reste 1.50 collègue / 2.00 public, déjà correct.
- Fichiers : migration `supabase/migrations/20261022150000_v2_fix_colleague_price_salad.sql`; aucun changement du code client V3, V1 ou V2 pour ce correctif.


## Correctif créneaux V2 — 2026-10-22

- Cause : `v2/js/checkout.js` lisait seulement `weekly_opening_hours` et proposait des dates, puis appelait `create_pending_order` avec `p_service_slot_id: null`. Cela ignorait les créneaux réellement générés dans `service_slots` par l’administration.
- Correction : V2 charge les créneaux actifs, les filtre selon les services ouverts dans `weekly_opening_hours`, permet de choisir date et heure et transmet le vrai ID du créneau.
- RPC `create_pending_order` mise à jour via migration `supabase/migrations/20261022170000_v2_use_admin_pickup_slots.sql` : exige un créneau actif correspondant à la date, valide l’ouverture de la période (midi/soir), vérifie la capacité restante et enregistre `pickup_time`.
- `v2/index.html` charge `checkout.js?v=20261022-02`. V1 et checkout V3 non modifiés.
- À tester : jours fermés, service midi fermé/soir ouvert, créneau complet, commande acceptée avec heure identique à l’administration et aux e-mails.


## Règles de livraison V2 collègues — 2026-10-22

- V2 = commandes collègues livrées au travail, service unique le midi, pas de créneau horaire individuel.
- Commande avant 18 h la veille. Après 18 h, basculer vers le prochain jour admissible.
- Jours admissibles : lundi, mardi, jeudi, vendredi uniquement (pas mercredi car télétravail, ni samedi/dimanche).
- Le checkout V2 calcule et affiche la prochaine date admissible, transmet cette date à `create_pending_order`, avec `p_service_slot_id: null`.
- Migration `supabase/migrations/20261022180000_v2_colleague_lunch_delivery_rules.sql` appliquée : la RPC recalcule la date admissible côté serveur, la refuse si elle ne correspond pas au délai/cutoff, et enregistre l'heure de livraison à 12:00 sans dépendre de `service_slots`.
- Le V3 conserve ses créneaux de retrait et son fonctionnement public ; aucune modification du V3 ou de la V1.
