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

# Tammy Thai Food — V3 (site client public)

## État
V3.03 : catalogue public complet intégré (14 fiches). Le panier, les créneaux, les commandes et les paiements ne sont pas activés.

## Catalogue public
- Nems maison façon thaï : 1,00 € la pièce.
- Promotion affichée : 4 achetés + 1 offert.
- Description commerciale : nems maison au poulet, croustillants, préparés selon une recette thaïlandaise.
- Photo : fichier existant `v2/Nem.png`, référencé depuis la V3 sans modifier la V2.
- Le tarif public est défini explicitement dans la V3 et n'est pas repris du prix collègue V2 (0,75 €).

## Règles d'architecture
- Le site public vit dans `v3/`.
- La V1 et la V2 restent intactes.
- Ne pas importer directement le catalogue V2 pour afficher les tarifs : la V2 utilise des prix collègues. La carte publique et ses prix doivent être définis explicitement.
- Aucun secret Supabase dans le navigateur. Les opérations privilégiées et la création des paiements devront être vérifiées côté serveur.
- N'activer les paiements réels qu'après validation du parcours de commande, de la sécurité et des remboursements/annulations.
- Une fonctionnalité à la fois ; mettre à jour `CHANGELOG.md` et ce document à chaque décision importante.
- Valider sur PC et mobile avant de déclarer une version stable.

## Périmètre prévu
- Catalogue public, prix publics, photos, descriptions et allergènes vérifiés.
- Choix des options de viande et du piment.
- Panier et récapitulatif.
- Créneaux de retrait, calendrier d'ouverture et capacité.
- Commande et confirmation.
- Paiement en ligne sécurisé dans une étape séparée.
- Suivi client et intégration à l'administration sans mélanger les règles de prix V2/V3.

## Étape suivante
Vérifier et intégrer les autres fiches du catalogue public, sans reprendre les prix collègues de V2.


## V3.02 — Base de styles

Les styles modulaires de V2 sont copiés indépendamment dans `css/` (variables, layout, header, hero, menu, footer, responsive). `css/style.css` est chargé en dernier pour conserver les adaptations spécifiques du site public. Les fonctions panier/commande ne sont pas activées par cette étape.


## Catalogue V3.03

Les fiches et tarifs publics sont définis dans `js/data.js`, indépendamment des prix collègues de V2. Les catégories sont filtrables. Les boutons restent désactivés tant que le panier et le parcours de commande ne sont pas prêts. Les photos sont référencées depuis les images V2 sans modification de celles-ci.


## V3.04 — Base V2 copiée

V3 reprend maintenant une copie isolée de la structure HTML, des styles et du moteur menu/panier de V2. Les prix clients sont propres à `js/data.js`. Le formulaire s’affiche, mais l’envoi de commande est bloqué jusqu’à la mise en place des créneaux publics. Les visuels et photos réutilisent les ressources de V2 en lecture seule.
