## 2026-10-19 — Brochettes de filet de poulet satay sur V2 et V3

- Deux choix au menu pour rendre la promotion simple à commander sans changer le moteur de panier : 1 brochette et un lot de 3 brochettes.
- Recette décrite comme filet de poulet mariné, grillé et accompagné d’une sauce satay à part ; produit non épicé.
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

- Recette : 2 crevettes, ½ tomate, 1 champignon, 50 g de poulet, 50 g de poisson, 1 gousse d’ail, ¼ d’oignon, 1 branche de coriandre, 1 c. à café de pâte de piment et 10 cl de lait de coco.
- Description client : « Soupe thaïlandaise Tom Yum au lait de coco, garnie de crevettes, de poulet tendre, de poisson, de champignons et de tomate. La coriandre fraîche apporte une note herbacée, tandis que la pâte de piment relève le bouillon selon votre goût. Piment au choix. »
- Tarifs : 10 € V2 collègues ; 11 € V3 clients.
- Piment au choix ; temps de préparation provisoire : 10 minutes.
- Allergènes à afficher : crustacés et poisson.
- Photo à raccorder au dépôt avant validation visuelle finale.

## 2026-10-17 — Fiche Bò Bún

- Description sans poids ni allergènes.
- Sauce à sélectionner explicitement : « Sauce non pimentée » ou « Sauce pimentée ». Ce choix remplace toute option générique de niveau de piment pour ce plat.
- Choix visible dans le panier et dans les détails de commande côté administration.
- Allergènes présentés uniquement dans le menu déroulant en bas de page, avec les allergènes des fournisseurs à confirmer.

## V3.07 — Planning journalier par service (2026-10-16)

- L’administration présente 60 jours sous forme de lignes datées avec deux états indépendants : Midi et Soir.
- Midi : 11:00–14:00. Soir : 17:30–21:00 du lundi au vendredi, 17:30–22:00 le samedi et dimanche. Créneaux de 15 minutes.
- L’ouverture d’un service génère/réactive les créneaux de cette date ; sa fermeture les désactive. Les commandes déjà enregistrées restent intactes.
- La V3 publique propose uniquement les créneaux actifs d’aujourd’hui et demain et filtre selon la charge de préparation. Les fonctions Supabase ne consultent plus le calendrier hebdomadaire pour autoriser un créneau.
- Capacité par créneau : 45 minutes provisoires, ajustables en administration. Les estimations doivent être confirmées par des tests en cuisine.

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

## V3.05 — Activation sécurisée des commandes publiques (2026-10-16)

- Activation du formulaire de commande dans `v3/js/checkout.js` avec l’appel RPC séparé `create_public_pending_order`.
- Migration Supabase : ajout de `products.public_price` pour isoler les prix publics des prix collègues et de `orders.sales_channel` (valeur par défaut `colleague` pour préserver les commandes V2 existantes).
- Les 14 produits actifs disposent d’un tarif public renseigné. La fonction serveur recalcule le total avec ces tarifs, contrôle les produits actifs, les options de viande, le piment, la date de retrait midi et la promotion des nems.
- Les commandes V3 sont enregistrées avec `sales_channel='public'`, statut `pending_payment` et paiement `unpaid` (paiement au retrait). Les commandes V2 continuent d’utiliser leur fonction existante et le tarif collègue.
- L’import du panier dans le checkout V3 utilise la même version de module que le moteur du panier afin de lire le même stockage local.
- Aucun ordre de test n’a été créé en base. Vérification effectuée par lecture : RPC présente, permission d’exécution anon active, tarifs publics renseignés, fichiers V2 inchangés.
- Limite : le parcours actuellement activé concerne le retrait du midi uniquement. Le site est accessible sur GitHub Pages ; les essais PC/mobile et la vérification visuelle dans l’administration restent à faire. Ne pas déclarer V3.05 stable avant ces essais.

# V3 — Spécifications fonctionnelles du site client public

État : exigences retenues pour cadrer le développement. Les exemples horaires ci-dessous sont provisoires et devront être confirmés avant l'activation des commandes réelles.

## 1. Périmètre et séparation des versions

- La V3 est le site client public.
- La V1 ne doit jamais être modifiée.
- La V2 reste le site collègues et ne doit pas changer de comportement.
- Les prix publics, descriptions commerciales et options V3 sont définis et vérifiés indépendamment des tarifs collègues V2.
- Les recettes, quantités de préparation et informations de coût restent internes. Le client ne voit que les informations commerciales et celles nécessaires à sa commande.

## 2. Parcours de commande

- Panier avec quantités, options choisies et total.
- Collecte des coordonnées nécessaires.
- Création d'un numéro de commande.
- Confirmation au client et notification à Tammy.
- Gestion distincte des services du midi et du soir.

## 3. Retrait et créneaux

Contrairement au site collègues, le client public choisit un créneau horaire proposé par le système.

Règles de cadrage fournies :
- Midi : exemple provisoire, une commande passée entre 00 h 00 et 13 h 00 peut être proposée pour le service du midi du jour même.
- Soir : une commande pour le soir du jour même peut être passée dès le matin ; exemple provisoire de retrait entre 18 h et 21 h.
- Le client ne peut choisir que parmi les créneaux encore ouverts et disponibles.
- Les services du midi et du soir sont gérés séparément.
- Le calendrier doit permettre de définir les jours de fermeture, vacances et indisponibilités.
- Chaque créneau possède une capacité maximale ; une fois la capacité atteinte, il ne doit plus être sélectionnable.
- Les heures limites, durées des créneaux et capacités exactes restent à définir/valider avant activation.

## 4. Paiement

- Au démarrage : paiement sur place.
- Prévoir ensuite un paiement en ligne sécurisé, notamment Stripe et les portefeuilles compatibles selon les moyens réellement pris en charge.
- Aucun paiement réel ne doit être activé avant la validation du parcours et de la sécurité côté serveur.
- Aucune clé secrète Supabase ou clé secrète de paiement ne doit être exposée dans le frontend.

## 5. Administration

- File de commandes de type Kanban avec statuts de préparation.
- Notifications des nouvelles commandes et des changements utiles.
- Gestion des ouvertures, fermetures, vacances et capacités par créneau.
- Séparation stricte des informations internes de préparation et des données visibles par le client.

## 6. Ordre de réalisation

1. Vérifier l'existant sur GitHub et conserver le point de restauration V2 stable.
2. Développer uniquement dans le répertoire `v3/`.
3. Vérifier le catalogue public : plats, descriptions, photos, prix publics, options de viande et de piment.
4. Développer le panier, les coordonnées, le calcul des créneaux et la confirmation.
5. Préparer le paiement et l'administration, avec validation serveur avant tout paiement en ligne.
6. Tester sur PC et mobile avant toute déclaration de stabilité et publication sous le domaine définitif.

## 7. Premier produit intégré — V3.01

- Nems maison façon thaï, vendus à la pièce.
- Prix public retenu pour la fiche : 1,00 € par nem ; le prix collègue V2 de 0,75 € ne doit pas être repris.
- Promotion affichée : 4 achetés + 1 offert. Le calcul automatique de cette promotion devra être implémenté et testé dans le panier/serveur avant d'ouvrir les commandes.
- Description publique : nems maison au poulet, croustillants, préparés selon une recette thaïlandaise.
- Photo réutilisée depuis le dépôt : `v2/Nem.png`, sans modification du fichier.
- Le bouton de commande reste désactivé tant que le parcours panier/commande n'est pas prêt.

## 8. Validation

Une version n'est stable qu'après des tests PC et mobile du catalogue, des options, du panier, des créneaux, des limites de capacité, des confirmations et des vues d'administration concernées.

## 9. Catalogue public V3.03

- Les fiches publiques sont définies dans `v3/js/data.js`, indépendamment du catalogue collègue V2.
- Prix publics utilisés : Pad Thaï 10 €, Chicken Massena 9 €, sauté de poulet aux noix de cajou 8 €, bœuf sauté sauce huître 10 €, riz sauté 7 €, Tom Kha Kai 9 €, soupe de nouilles de riz au bœuf 9 €, salade thaïe de viande hachée 10 €, salade de papaye 7 €, soupes curry rouge/vert 8 €, rouleau de printemps 2 €, riz gluant à la mangue 4 €, nems 1 € la pièce.
- Options viande et piment affichées à titre informatif ; le panier et les commandes ne sont pas activés. La promotion nems est affichée mais son calcul n'est pas actif.
- Les photos référencent les fichiers V2 existants en lecture seule. Contrôler les photos et les prix sur PC/mobile avant validation.
