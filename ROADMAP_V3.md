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

## V3.04 — Base complète reprise de V2

La structure HTML, les modules CSS et le moteur JavaScript du menu/panier sont copiés indépendamment dans `v3/`. Les prix publics restent définis dans le catalogue V3. L’envoi des commandes reste bloqué jusqu’à l’adaptation des créneaux publics et du traitement des commandes. Test PC/mobile nécessaire.

## Étape V3.03 — Catalogue public complet

Catalogue public dynamique ajouté avec catégories, photos, descriptions et tarifs explicites indépendants de V2. Les boutons de commande restent désactivés. Validation PC/mobile nécessaire.

## Étape V3.02 — Base de styles modulaire

Les styles de base de V2 sont copiés dans `v3/css/` sans dépendance directe sur les fichiers CSS V2. `v3/css/style.css` reste chargé en dernier pour les adaptations publiques. Cette étape ne raccorde pas encore le moteur JavaScript, le panier ou les commandes.

# ROADMAP V3 — Site client public

## État actuel
- **V3.00 — Socle du site public** : structure indépendante, styles responsive et initialisation JavaScript. Aucun panier, aucune commande et aucun paiement actif.
- Point de restauration créé : branche `backup/v2-stable-2026-10-15`, basée sur le commit existant avant le démarrage V3.
- Les exigences fonctionnelles détaillées sont consignées dans `V3_SPECIFICATIONS.md`. Les horaires et capacités exacts de retrait restent à valider.

## Versions prévues
- **V3.01 — Première fiche catalogue public** : Nems maison façon thaï, prix public 1,00 € la pièce, promotion affichée 4 achetés + 1 offert ; bouton de commande désactivé tant que le panier n'est pas développé. Les autres fiches restent à vérifier.
- **V3.02 — Panier et commande** : panier, coordonnées, numéro de commande et confirmations au client et à Tammy.
- **V3.03 — Retrait et planning** : choix de créneaux midi/soir, horaires limites, calendrier des fermetures/vacances et capacité maximale par créneau.
- **V3.04 — Administration cuisine** : file Kanban, statuts de préparation et notifications.
- **V3.05 — Paiement en ligne** : étude puis intégration sécurisée côté serveur ; paiement sur place au démarrage. Ne pas activer de paiement réel avant validation sécurité.

## Garde-fous obligatoires
- V1 inchangée ; V2 conservée et traitée comme version verrouillée.
- Tout le nouveau code client public se trouve sous `v3/`.
- Ne jamais réutiliser directement les prix V2 pour les clients : les prix collègues et les prix publics doivent rester distincts.
- Recettes, quantités de préparation et coûts restent internes ; le client ne voit que les informations commerciales et nécessaires à sa commande.
- Aucun secret Supabase ou secret de paiement dans le frontend ; opérations privilégiées et paiement validés côté serveur.
- Une fonctionnalité par intervention ; relire les fichiers GitHub avant toute modification.
- Mettre à jour `CHANGELOG.md` et `PROJECT_MEMORY.md` pour les décisions importantes.
- Tester PC et mobile avant de déclarer une version stable.
