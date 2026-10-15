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
