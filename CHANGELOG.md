## 2026-10-23 — Prospectus en ligne : fond tropical écran

- Arrière-plan de la zone d’information et des fiches enrichi avec des dégradés doux, des motifs discrets de palmiers, mer et éléphant, dans le même esprit que le visuel de référence.
- Image de fond existante conservée en transparence réduite pour que les fiches colorées et leurs textes restent lisibles.
- Décorations supplémentaires limitées à l’affichage écran/mobile ; elles sont masquées à l’impression afin de préserver le PDF déjà validé.
- Fichier fonctionnel modifié : `v2/prospectus.html`. V1, V3, catalogue, prix et commandes inchangés.

## 2026-10-22 — Prospectus en ligne : décoration tropicale discrète

- Ajout de motifs discrets palmier, mer et éléphant en arrière-plan de la zone d’information et derrière les fiches produits, avec opacité basse et couleurs tropicales douces.
- L’image de fond existante derrière les produits est conservée, avec une opacité réduite pour laisser les fiches et leurs photos lisibles.
- Les motifs décoratifs sont masqués à l’impression pour conserver le rendu PDF validé ; la bannière et les fiches gardent leur structure et leurs couleurs de catégorie.
- Fichier fonctionnel : `v2/prospectus.html`. Aucune modification à la V1/V3, aux prix, commandes ou à l’administration.

## 2026-10-22 — Prospectus PDF : mieux remplir la première page

- Hauteur des photos à l’impression augmentée de 40,5 mm à 48 mm pour réduire le grand espace vide en bas de la première page et mieux équilibrer la composition.
- Tri PDF conservé : Entrées → Plats → Soupes → Desserts → Boissons, avec couleurs pastel, trois colonnes et pagination automatique.
- Fichier fonctionnel : `v2/prospectus.html`. Aucun changement au site de commande, à la V1/V3, aux prix ou à l’administration. À contrôler dans l’aperçu PDF sur téléphone et PC.

## 2026-10-22 — Prospectus PDF : tri des fiches par catégorie

- À l’impression uniquement, les fiches sont triées visuellement dans l’ordre Entrées → Plats → Soupes → Desserts → Boissons, en conservant la grille de trois colonnes et le flux automatique sur les pages suivantes.
- Les couleurs pastel d’impression restent distinctes ; l’affichage écran conserve sa présentation sans bandeaux.
- Fichier fonctionnel : `v2/prospectus.html`. V1, V3, commandes, prix et administration inchangés. Vérifier l’aperçu PDF multipage.

## 2026-10-22 — Prospectus : retour à la mise en page écran et couleurs par catégorie

- Sur écran, retour à la disposition précédente en deux colonnes avec les titres Entrées, Soupes, Boissons à gauche et Plats, Desserts à droite.
- Les fiches écran utilisent désormais un fond pastel par catégorie : entrées vert pâle, plats bleu pâle, soupes pêche, desserts rose, boissons turquoise.
- À l’impression, la grille de trois colonnes sans titres de catégories est conservée. Les teintes pastel sont plus distinctes qu’à l’écran pour identifier rapidement chaque famille.
- Marges d’impression A4 réglées à 5 mm. Noms, prix, descriptions, photos et pagination conservés.
- Fichier fonctionnel : `v2/prospectus.html`. V1, V3, commandes, tarifs et administration inchangés. Vérifier rendu écran et aperçu PDF multipage.

## 2026-10-22 — Prospectus : catégories remplacées par des fonds pastel

- Suppression des titres de catégories dans la grille : les fiches sont triées dans l’ordre Entrées, Plats, Soupes, Desserts, Boissons.
- Chaque fiche reçoit un fond pastel par catégorie : entrées vert pâle, plats bleu pâle, soupes pêche pâle, desserts rose pâle, boissons turquoise pâle.
- La rubrique Boissons est réintégrée au prospectus et placée après les desserts ; seules les couleurs de la page prospectus changent, pas le catalogue ni les prix.
- Nom et prix restent sur la même ligne ; la description compacte reste sous le titre. Photos et pagination d’impression conservées.
- Fichier fonctionnel : `v2/prospectus.html`. V1, V3, commandes et administration inchangées. Test PC, mobile et aperçu A4 requis.

## 2026-10-22 — Prospectus : prix aligné et descriptions compactes

- Nom du plat et prix alignés sur une même ligne.
- Description affichée sous le titre en caractères plus petits, y compris à l’impression (6,5 px), pour conserver la lisibilité et limiter la hauteur des fiches.
- Données de description utilisées depuis Supabase, avec repli sur la description locale si nécessaire. Aucun changement au catalogue, aux prix ou au site de commande.
- Fichier fonctionnel : `v2/prospectus.html`. V1, V3 et administration inchangées.

## 2026-10-22 — Prospectus : photos moins étirées à l’impression

- Photos du prospectus A4 en trois colonnes : hauteur augmentée de 18 mm à 27 mm (× 1,5) pour une proportion plus équilibrée et moins aplatie.
- Le cadrage reste en `object-fit: cover` pour remplir les cartes sans déformer les photos. Le format écran/mobile n’est pas modifié.
- Fichier fonctionnel : `v2/prospectus.html`. V1, V3, commandes, prix et administration inchangés. Vérifier l’aperçu d’impression A4 pour confirmer que toutes les fiches tiennent encore sur une page.

## 2026-10-22 — Prospectus : mise en page A4 sur trois colonnes

- Correction de l’impression : les catégories sont réparties en trois colonnes indépendantes, au lieu de deux colonnes qui coupaient le contenu dans une zone masquée.
- Photos d’impression réduites pour faire tenir davantage de fiches sur une page A4 ; les photos écran/mobile restent inchangées.
- La zone du menu n’est plus forcée à masquer le débordement ; objectif de conserver toutes les catégories et fiches sur une page. Vérification visuelle de l’aperçu A4 encore nécessaire.
- Fichier fonctionnel : `v2/prospectus.html`. V1, commande, administration, V3 et prix inchangés.

## 2026-10-22 — Prospectus : rubrique Boissons et colonne gauche optimisée

- Ajout d’une rubrique « Boissons » distincte, alimentée automatiquement par les produits actifs Supabase de catégorie « Boissons » et leurs photos/prix locaux.
- Rubrique placée sous les soupes dans la colonne gauche pour utiliser l’espace disponible ; fiches boissons plus compactes, avec photos de hauteur réduite à l’impression pour préserver la place des plats.
- Aucun changement aux données, prix, commandes, administration, V1 ou V3.
- Fichier fonctionnel modifié : `v2/prospectus.html`. Test : https://tammythaifood.fr/v2/prospectus.html ; contrôler PC, mobile et aperçu A4.

## 2026-10-22 — Prospectus : titre en tête et photos encore agrandies

- Nom du plat et prix placés au-dessus de la photo, sur une ligne de titre ; la photo occupe ensuite toute la largeur de la fiche.
- Photo écran : hauteur portée à 300 px sur PC et 320 px sur mobile. Impression : hauteur portée à 45 mm.
- Aucun changement de produit, prix, commande, administration, V1 ou V3.
- Fichier fonctionnel modifié : `v2/prospectus.html`. À vérifier sur PC, mobile et aperçu A4 : https://tammythaifood.fr/v2/prospectus.html.

## 2026-10-22 — Prospectus aéré, photos agrandies

- Prospectus dynamique V2 : suppression des descriptifs, options et pastilles dans les fiches ; conservation du nom et du prix avec la photo.
- Photos agrandies : disposition plus visuelle sur écran et hauteur d’impression portée de 76 px à 38 mm (environ deux fois plus grande en hauteur).
- Sur mobile, chaque fiche place la photo au-dessus du titre et du prix pour maximiser la largeur de l’image.
- Les produits et tarifs continuent d’être chargés dynamiquement depuis Supabase ; aucune donnée produit, commande ou prix n’est modifiée.
- Fichier fonctionnel modifié : `v2/prospectus.html`. V1, parcours de commande V2, V3 et administration inchangés.
- Test : https://tammythaifood.fr/v2/prospectus.html ; vérifier PC, mobile et aperçu avant impression A4, notamment que toutes les fiches restent visibles.

## V3.08 — Intégration paiement isolée (2026-10-21)

- Branche de travail : `v3.08-payment-integration`, créée depuis `main` pour préserver les correctifs V3 les plus récents ; l'ancienne branche préparatoire `v3.08-payment` n'est pas fusionnée telle quelle.
- Le checkout V3 conserve les contrôles récents du panier/produits et ajoute Carte bancaire (Stripe), PayPal et espèces au retrait. Aucun moyen de paiement n'est présélectionné : le client doit faire un choix explicite.
- Le démarrage et la confirmation des paiements sont préparés côté Edge Functions ; les URL de retour prennent en charge `https://tammythaifood.fr/`, `www` et le chemin V3 GitHub Pages pour les essais.
- La migration est reconstruite depuis la fonction SQL actuellement en production afin de conserver les règles récentes (prix public des brochettes satay, sauce du Bò Bún, notes par article, promotion nems). Elle retarde l'e-mail de confirmation d'une commande en ligne jusqu'au statut payé et conserve l'e-mail de commande espèces et l'e-mail « prêt au retrait ».
- La migration `v3_08_payment_provider` est appliquée dans Supabase et les Edge Functions `payment-start`, `payment-confirm` et `payment-webhook` sont déployées (v1). Le site client reste inchangé car le checkout V3 modifié est isolé dans cette branche. Les secrets Stripe de test, le webhook Stripe et les essais sandbox restent à configurer/valider avant activation.

## 2026-10-21 — La V3 devient le site public à la racine

- Décision validée : `https://tammythaifood.fr/` sert désormais l’interface client V3 au lieu de l’ancienne page V1.
- `index.html` à la racine reprend le HTML actuel de `v3/index.html`, avec les feuilles CSS et modules JavaScript explicitement chargés depuis `/v3/` afin que les chemins relatifs des ressources restent valides.
- Le répertoire `v3/` est conservé pour les tests et retours arrière. Les fichiers historiques de la V1 ne sont pas supprimés du dépôt, mais ne sont plus utilisés par la page d’accueil du domaine.
- La V2 collègues reste accessible à `https://sarcke1.github.io/tammy-thai-food/v2/`; l’administration reste à `https://sarcke1.github.io/tammy-thai-food/v2/admin/`.
- Fichiers modifiés : `index.html`, `CHANGELOG.md`, `PROJECT_MEMORY.md`. V2 et V3 ne sont pas modifiées dans cette intervention.
- Contrôles nécessaires après publication : accueil, images, catégories, choix du piment et des viandes, panier, créneaux de retrait, création d’une commande test, PC et mobile.

## 2026-10-21 — Correctifs photos et connexion administration

- Photos V2/V3 : suppression des guillemets qui cassaient l’attribut HTML `style` autour de `background-image`; chemins conservés selon GitHub Pages ou le domaine personnalisé.
- Administration V2 : `changeOrderStatus` est maintenant déclarée `async`, car elle utilise `await`. L’erreur de syntaxe empêchait le module `admin.js` de s’exécuter, donc le gestionnaire du formulaire de connexion ne s’installait pas et le navigateur rechargeait la page.
- Cache renouvelé dans `v2/index.html`, `v3/index.html` et `v2/admin/index.html`.
- Fichiers modifiés : `v2/js/app.js`, `v3/js/app.js`, `v2/index.html`, `v3/index.html`, `v2/admin/admin.js`, `v2/admin/index.html`, `CHANGELOG.md`, `PROJECT_MEMORY.md`.
- V1 non modifiée. Déploiement GitHub confirmé ; test navigateur réel PC/mobile et connexion admin à effectuer.

## 2026-10-21 — Ajustement du chemin des photos

- Le chemin des images est maintenant calculé explicitement selon l’adresse ouverte : `/tammy-thai-food/v2/` sur GitHub Pages et `/v2/` sur le domaine personnalisé.
- Les images des fiches et les miniatures du panier utilisent la même base. Les paramètres de cache des moteurs V2/V3 sont renouvelés.
- Fichiers modifiés : `v2/js/app.js`, `v2/index.html`, `v3/js/app.js`, `v3/index.html`, `CHANGELOG.md`, `PROJECT_MEMORY.md`.
- V1 et l’authentification admin ne sont pas modifiées. Test réel PC/mobile encore requis.

## 2026-10-21 — Correction des chemins des photos V2/V3

- Cause : les images du menu et les miniatures du panier utilisaient un chemin absolu fixe `/tammy-thai-food/v2/`, incompatible avec le domaine personnalisé à la racine `tammythaifood.fr`.
- Correction : le moteur V2 et V3 construit désormais le chemin des images depuis l’URL du module JavaScript. Les photos restent stockées dans `v2/` et sont accessibles depuis les deux adresses, GitHub Pages et le domaine personnalisé.
- Cache du moteur actualisé dans `v2/index.html` et `v3/index.html`.
- Fichiers modifiés : `v2/js/app.js`, `v2/index.html`, `v3/js/app.js`, `v3/index.html`, `CHANGELOG.md`, `PROJECT_MEMORY.md`.
- V1 et la logique de commande/authentification ne sont pas modifiées. Vérification du code faite ; affichage réel des photos à tester sur les deux domaines, PC et mobile.

## V2.07 — E-mail client lorsque la commande est prête

- L’e-mail de confirmation reste envoyé à la création de la commande.
- Lors du passage du statut à `ready` (« En attente de retrait »), un e-mail distinct est envoyé au client avec le numéro de commande, le retrait prévu et le récapitulatif.
- Le déclenchement est limité à une transition vers `ready` afin d’éviter les envois à chaque actualisation.
- Fonction Supabase `notify-order-email` déployée en version 13 ; déclencheur PostgreSQL étendu aux changements de statut.

## V2.04 — Tri des commandes par retrait

- Dans tous les onglets de l’administration V2, les commandes sont triées par date de retrait puis par heure de retrait, les créneaux les plus proches apparaissant en premier.
- À date et heure de retrait identiques, la commande passée la première apparaît en premier.
- Les commandes sans date de retrait sont placées après celles dont le créneau est renseigné.

## V2 collègues — Correction de la validation du panier (20 octobre 2026)

- Cause : le moteur du menu transmettait la valeur par défaut « Sauce non pimentée » pour tous les plats, y compris le rouleau de printemps et la soupe de nouilles au bœuf. La fonction Supabase `create_pending_order` refuse un choix de sauce pour les produits autres que le Bò Bún, ce qui déclenchait « Choix de sauce invalide ».
- Correction : le menu ne transmet une sauce que pour les plats proposant ce choix ; le checkout n’envoie le champ `sauce` et la note associée que pour le Bò Bún. Pour les anciens paniers locaux, les valeurs de sauce obsolètes des autres plats sont ignorées à la validation.
- Fichiers modifiés : `v2/js/app.js`, `v2/js/checkout.js`, `v2/index.html`, `CHANGELOG.md`, `PROJECT_MEMORY.md`. V1 inchangée. Correction ciblée au site collègue V2.

## V3.14 — Correction du sélecteur individuel de sauce du Bò Bún

- Cause : le moteur du menu remplace l’identifiant local du plat par l’UUID Supabase. Les conditions qui testaient `dish.id === "bo-bun"` ne pouvaient donc pas reconnaître le Bò Bún chargé depuis la base ; il affichait le sélecteur générique au lieu d’un choix par unité.
- Correction : conserver `localId` dans les objets du menu et l’utiliser pour afficher un choix de sauce « Plat 1 », « Plat 2 », etc., puis transmettre la sauce correspondante à chaque ligne du panier.
- Cache du moteur menu actualisé. V1 et V2 non modifiées.

## V3.13 — Sauce individuelle du Bò Bún et nom du plat enfant

- Bò Bún : le choix de sauce est désormais individuel pour chaque unité ajoutée. Après avoir choisi une quantité, chaque ligne « Plat 1 », « Plat 2 », etc. permet de choisir sauce pimentée ou non pimentée. Chaque Bò Bún est ajouté au panier avec sa propre sauce.
- Plat enfant : le nom affiché devient « Ailes de poulet frit », sans la mention « Menu enfant ». La référence du produit dans Supabase est conservée pour préserver le chargement des données.
- La sauce choisie pour chaque Bò Bún est enregistrée dans la note de commande pour être visible lors de la préparation. Le nom affiché « Ailes de poulet frit » est également converti vers le nom source Supabase à la validation de la commande.
- Fichiers concernés : `v3/js/app.js`, `v3/js/checkout.js`, `v3/js/data.js`, `v3/index.html`, `CHANGELOG.md`, `PROJECT_MEMORY.md`. V1 et V2 non modifiées.
- Validation visuelle sur PC et mobile encore nécessaire.

## V3.12 — Correction de la catégorie Enfants

- Correction du chargement du menu client V3 : les produits actifs de la catégorie « Enfants » ne sont plus exclus des produits récupérés depuis Supabase.
- Le menu enfant « Menu enfant — ailes de poulet frit » redevient visible lorsque sa fiche est active.
- Aucun changement apporté à V1 ni à V2. Cache du moteur V3 actualisé.

## V3.11 — Disponibilité du bœuf dans la soupe de nouilles (2026-10-20)

- La « Soupe de nouilles au bœuf » est désormais reconnue comme un plat à protéine fixe « Bœuf » dans le menu V3.
- Si le bœuf est désactivé dans l’administration, la fiche est masquée, une ligne déjà présente au panier est retirée au rafraîchissement et la validation vérifie aussi cette indisponibilité.
- V1 et V2 non modifiées. Contrôles navigateur PC/mobile à effectuer après publication.

## 2026-10-20 — Validation du Tom kha kai en rupture de poulet

- Le contrôle à la validation reconnaît le Tom kha kai comme un plat à poulet fixe, même si le choix de viande n’est pas affiché sur sa fiche.

## 2026-10-20 — Rupture des plats à protéine fixe

- La rupture de poulet masque également le Tom kha kai, dont la recette utilise du poulet sans proposer de choix de viande.
- La protéine obligatoire est distinguée de l’affichage du choix afin de conserver l’interface actuelle des fiches.

## 2026-10-20 — Affichage des protéines en rupture

- Les options de protéines indisponibles sont visuellement atténuées et portent explicitement la mention « Indisponible ».
- Les contrôles de quantité ne sont pas proposés pour une protéine désactivée.

## 2026-10-20 — Préservation du panier entre V2 et V3

- La synchronisation des ruptures ne retire plus un produit actif simplement parce qu’il n’est pas affiché dans la version visitée (ex. produit réservé à la V3).
- Les lignes sont retirées uniquement si le produit est désactivé ou si la protéine réellement choisie est indisponible.

## 2026-10-20 — Contrôle des ruptures à la commande

- La validation V2 et V3 vérifie que chaque produit du panier est encore actif et que la protéine choisie est disponible.
- Les articles devenus indisponibles sont retirés du panier local et la validation est interrompue pour laisser le client vérifier le nouveau panier.
- En cas d’erreur lors de la lecture des disponibilités, la commande est bloquée par sécurité.

## 2026-10-20 — Disponibilités côté menu

- Les menus V2 et V3 rechargent les produits actifs et l’état des protéines depuis Supabase.
- Les plats à protéine fixe sont masqués lorsque cette protéine est en rupture.
- Dans les plats à choix multiple, la protéine en rupture reste visible avec le libellé « Indisponible » et ne peut plus être sélectionnée.
- Les lignes de panier déjà enregistrées localement sont retirées lorsqu’elles correspondent à un produit ou une protéine indisponible.
- Actualisation automatique des disponibilités toutes les 60 secondes ; validation serveur/client à compléter dans l’étape suivante.

## 2026-10-20 — Disponibilité produits (première étape)

- Ajout d’un onglet « Disponibilité » dans l’administration commune.
- Préparation de la gestion centralisée de l’activation des produits et des protéines via Supabase.
- Les produits ne sont pas supprimés : leur fiche et leurs données sont conservées pour réactivation.
- La V1 reste inchangée. La propagation complète au menu, au panier et à la validation des commandes est réalisée dans les étapes suivantes.

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

## 2026-10-18 — Ajout du Tom Yum sur V2 et V3

- Nouveau plat : « Tom Yum aux crevettes, poulet et poisson ».
- Description commerciale : soupe Tom Yum au lait de coco, crevettes, poulet, poisson, champignons, tomate et coriandre ; piment au choix.
- Tarifs enregistrés : 10 € collègues (V2) et 11 € clients (V3).
- Le produit est ajouté au catalogue Supabase avec tarif collègue, tarif public, options de piment et temps de préparation initial estimé à 10 minutes.
- Allergènes indiqués dans le volet de bas de page : crustacés et poisson.
- La photo n’est pas encore raccordée au dépôt ; une vignette de remplacement s’affiche en attendant l’ajout du fichier image.
- V1 inchangée. Tests de commande et vérifications visuelles PC/mobile encore à effectuer.

## 2026-10-17 — Bò Bún : description et choix de sauce sur V2/V3

- Descriptions V2 et V3 harmonisées : présentation gourmande, sans poids ni mention d’allergènes.
- Sélection explicite sur les deux sites : « Sauce non pimentée » ou « Sauce pimentée » ; le Bò Bún n’affiche pas de contrôle générique de niveau de piment.
- Le choix est conservé dans le panier et transmis dans les détails de l’article de la commande ; l’administration affiche la sauce choisie.
- Allergènes retirés de la fiche produit et placés dans le menu déroulant « Allergènes » en bas de page. Seule la présence d’arachides est identifiée comme certaine ; les nems, marinades et sauces restent à confirmer sur les fiches fournisseurs.
- V1 inchangée. À vérifier après publication : affichage PC/mobile, sélection de sauce, panier, commande et administration.

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

- Remplacement du pilotage hebdomadaire visible par un planning sur 60 jours, avec une ligne par date et deux commandes indépendantes : Midi et Soir.
- L’activation d’un service génère ses créneaux de 15 minutes ; la désactivation ferme les créneaux de cette date sans supprimer les commandes déjà enregistrées.
- Les fonctions Supabase publiques ne se basent plus sur `weekly_opening_hours` : le statut actif des créneaux datés devient la source de vérité.
- Horaires conservés : midi 11 h–14 h ; soir 17 h 30–21 h en semaine et 17 h 30–22 h le week-end. Site public : aujourd’hui et demain uniquement.
- Fichiers : `v2/admin/slots.js`, `v2/admin/index.html`, `v2/admin/admin.js`, `v2/admin/admin.css`. Supabase : fonctions `get_public_pickup_slots` et `create_public_order_in_slot`.
- V1 et fichiers client V2 inchangés. Tests de commande et vérifications visuelles PC/mobile encore requis ; ne pas déclarer stable avant validation.

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

## V3.01 — Première fiche du catalogue public (2026-10-15)

- Ajout de la fiche Nems maison façon thaï dans `v3/index.html`.
- Prix public explicite : 1,00 € la pièce ; prix collègue V2 de 0,75 € non réutilisé.
- Promotion affichée : « 4 achetés + 1 offert ». Son calcul automatique n'est pas encore implémenté.
- Photo existante `v2/Nem.png` réutilisée en lecture seule.
- Bouton de commande désactivé : aucun panier ni enregistrement de commande n'est encore actif.
- Fichiers modifiés : `v3/index.html`, `v3/css/style.css`, `v3/js/app.js`, `v3/README.md`, `V3_SPECIFICATIONS.md`, `ROADMAP_V3.md`, `CHANGELOG.md`, `PROJECT_MEMORY.md`. Aucun fichier V1/V2 ni aucune donnée Supabase modifiés.
- Tests visuels PC/mobile et vérification du chargement de la photo à effectuer après publication.

## Documentation V3 — exigences fonctionnelles client public (2026-10-15)

- Ajout de `V3_SPECIFICATIONS.md` : parcours de commande, services midi/soir, créneaux de retrait, calendrier de fermetures/vacances, capacité, paiement sur place au démarrage, paiement en ligne sécurisé à préparer, administration Kanban et séparation des données internes.
- `ROADMAP_V3.md` réorganisé en étapes catalogue, commande, planning, administration et paiement.
- Exemples d'horaires provisoires : midi, commande entre 00 h et 13 h potentiellement pour le jour même ; soir, commande dès le matin pour un retrait entre 18 h et 21 h. Les heures limites et capacités restent à confirmer avant activation.
- Aucun code fonctionnel de V1 ou V2 modifié ; aucun panier, commande ni paiement activé par cette documentation.

## V3.00 — Création du socle indépendant du site client public

- Création de `v3/index.html`, `v3/css/style.css`, `v3/js/app.js` et `v3/README.md`.
- Page d’accueil responsive avec identité Tammy Thai Food, bannière visuelle, présentation et mention explicite que les commandes ne sont pas encore disponibles.
- Aucun panier, aucune commande, aucun accès Supabase et aucun paiement activés.
- Sauvegarde de l’état antérieur sur la branche `backup/v2-stable-2026-10-15`, basée sur le commit `c1a2d79296335c33ded39f6faf7f16f081a36215`.
- Fichiers modifiés : `v3/index.html`, `v3/css/style.css`, `v3/js/app.js`, `v3/README.md`, `ROADMAP_V3.md`, `CHANGELOG.md`, `PROJECT_MEMORY.md`. V1 et V2 inchangées.
- À tester : rendu PC/mobile et chargement de la bannière. La page est une base de développement, pas un site de commande prêt à ouvrir au public.

## V2.06.45 — Petite bannière et accord de la salade

- Prospectus : ajout d’une petite bannière verte et or « Tammy Thai Food », conservant l’espace principal disponible pour les photos et descriptions.
- Carte V2 : le badge de la salade thaïe de viande hachée affiche désormais « Servie avec du riz » ; les autres plats gardent leur accord actuel.
- Fichiers modifiés : `v2/prospectus.html`, `v2/js/app.js`, `v2/index.html`, `CHANGELOG.md`. V1 inchangée.
- À contrôler sur PC/mobile et dans l’aperçu d’impression A4.

## V2.06.44 — Libellé unitaire harmonisé

- Sous-titre des nems et rouleaux de printemps : « Vendu à la pièce ».
- Descriptions vérifiées sans répétition de cette information ; la description des nems précise bien qu’ils sont au poulet.
- Fichiers modifiés : `v2/js/app.js`, `v2/index.html`, `CHANGELOG.md`. V1 inchangée.

## V2.06.43 — Prospectus sans bannière, fiches agrandies

- Suppression de la bannière haute et de son ruban : l’espace est réaffecté à la carte et aux fiches produits.
- Photos plus hautes et descriptions plus lisibles à l’écran ; tailles des photos, titres, descriptions et étiquettes augmentées dans l’impression A4.
- QR code, prix collègues, données dynamiques Supabase, règles de retrait et site client inchangés.
- Fichiers modifiés : `v2/prospectus.html`, `CHANGELOG.md`. V1 et logique de commande inchangées.
- Vérifier l’aperçu d’impression : une seule page A4, sans débordement ni fiche coupée.

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


## V3.08.01 — Choix explicite du paiement (2026-10-21)

- Suppression de la présélection du paiement en espèces dans le formulaire V3.
- Cache-busting des fichiers CSS du panier et JavaScript du checkout pour le prochain déploiement de test.
- Modifications limitées à `v3/js/checkout.js`, `v3/index.html` et `CHANGELOG.md` ; aucune modification de V1, V2 ou de l'administration.


## V3.08.02 — Heure de retrait dans les e-mails (2026-10-22)

- Les e-mails de nouvelle commande, de confirmation client et de commande prête utilisent désormais `pickup_time` enregistré en base, au lieu d'afficher systématiquement « midi ».
- Fonction Supabase `notify-order-email` redéployée en version 16.
- Aucun changement du fonctionnement V1/V2 ni de la logique de prix.


## Correctif tarif V2 — salade thaïe (2026-10-22)

- La V2 affiche explicitement 8 € pour la salade thaïe de viande hachée aux herbes fraîches, mais le tarif serveur `products.price` était resté à 10 €. Le RPC recalculait donc le prix à 10 € au moment de la commande.
- Mise à jour de `products.price` à 8 €, sans modifier `products.public_price` (10 €), qui reste le tarif public V3.
- Migration appliquée en Supabase et enregistrée dans `supabase/migrations/20261022150000_v2_fix_colleague_price_salad.sql`.


## V2 — Créneaux de retrait synchronisés avec l’administration (2026-10-22)

- Le checkout V2 lit maintenant les créneaux actifs générés dans `service_slots` et filtre les jours/services selon `weekly_opening_hours`, comme le calendrier administrateur.
- Le client choisit un créneau daté et horodaté, pas uniquement une date générique à midi.
- La RPC `create_pending_order` valide le créneau actif, sa date, l’ouverture midi/soir correspondante et la capacité de préparation ; elle enregistre aussi l’heure réelle dans `orders.pickup_time`.
- Cache V2 actualisé dans `v2/index.html`.
- V1 et le checkout V3 inchangés.


## V2 — Règles de livraison collègues restaurées (2026-10-22)

- La V2 n'utilise plus les créneaux individuels du planning public : elle affiche uniquement la prochaine date de livraison au midi.
- Commande exigée avant 18 h la veille ; après 18 h, la livraison est décalée au prochain jour admissible.
- Jours de livraison : lundi, mardi, jeudi et vendredi ; aucun mercredi, samedi ni dimanche.
- La validation Supabase recalcule cette date côté serveur, enregistre `pickup_time=12:00` et ne demande plus d'identifiant `service_slots` pour les commandes collègues.
- Le checkout V3 et le planning client V3 restent inchangés.


## V2 — Choix du jour de livraison sur 7 jours glissants (2026-10-22)

- Les collègues peuvent choisir une date parmi les jours de livraison admissibles dans les 7 prochains jours calendaires.
- Jours proposés : lundi, mardi, jeudi, vendredi ; pas de mercredi ni de week-end.
- Avant 18 h, première date possible = lendemain ; à partir de 18 h, première date possible = surlendemain, puis prochaine date admissible.
- La RPC Supabase valide côté serveur que la date choisie respecte le délai, la fenêtre de 7 jours et les jours autorisés.
