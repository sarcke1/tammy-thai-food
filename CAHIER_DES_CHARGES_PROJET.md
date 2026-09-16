# Cahier des charges évolutif — Tammy Thai Food

Dernière mise à jour : 16 septembre 2026
Version de référence : V2.02

## 1. Objectif du projet

Créer un site professionnel de commande en ligne pour Tammy Thai Food, spécialisé dans la cuisine thaïlandaise à Champhol, avec fonctionnement Click & Collect.

Le site doit être simple, rapide, responsive, fiable sur ordinateur et mobile, et permettre à terme la gestion complète des commandes, du paiement et de la préparation.

## 2. Règles absolues de développement

1. La V1 est une référence fonctionnelle et ne doit jamais être modifiée pendant le développement de la V2.
2. Une modification ciblée ne doit toucher qu'à la zone concernée.
3. Ne jamais modifier simultanément plusieurs modules fonctionnels sans nécessité.
4. Avant toute modification, lire les fichiers réels présents sur GitHub.
5. Après chaque modification GitHub, relire le fichier modifié pour vérifier le contenu réellement enregistré.
6. Toute nouvelle fonction doit être testée avant de passer à la suivante.
7. Ne jamais supprimer une fonction existante pour en ajouter une autre sans validation explicite.
8. En cas d'erreur, conserver un mécanisme de secours visible plutôt que laisser une page vide.
9. Les clés secrètes Supabase/service_role ne doivent jamais être intégrées au frontend.
10. Toute modification doit préciser les fichiers touchés et son impact.

## 3. Gestion des versions

- V2.01 : base fonctionnelle avec menu, quantités, piment, panier, Supabase et administration.
- V2.02 : séparation des nems en trois variantes avec compteurs indépendants.
- V2.03 et suivantes : une seule évolution fonctionnelle ou visuelle à la fois.

Une version n'est considérée comme stable qu'après validation PC et mobile.
Les cache-busters HTML/CSS/JS doivent être incrémentés après chaque changement important.

## 4. Architecture technique

- `v2/index.html` : structure générale uniquement.
- `v2/js/data.js` : catalogue local, contenu, prix, descriptions, photos et options produits.
- `v2/js/app.js` : moteur principal du menu et interactions.
- `v2/js/menu-fallback.js` : affichage de secours du menu si le moteur principal échoue.
- `v2/js/cart.js` : panier, quantités, stockage local et total.
- `v2/js/spice.js` : niveaux de piment.
- `v2/js/checkout.js` : formulaire et création de commande.
- `v2/js/supabase.js` : connexion publique Supabase uniquement.
- `v2/admin/` : administration séparée.
- CSS séparés par zone : variables, layout, header, hero, menu, cart, footer et responsive.

## 5. Fonctions à préserver

- Affichage du catalogue par catégories.
- Photos et descriptions.
- Contrôles `- / +` sur les produits.
- Choix du piment pour les plats concernés.
- Ajout au panier.
- Compteur et total.
- Suppression et vidage du panier.
- Persistance locale.
- Connexion Supabase.
- Création de commande `pending_payment`.
- Administration fonctionnelle.
- Affichage PC et mobile.

## 6. Catalogue actuel

Le catalogue comprend notamment :

- Pad Thaï — 11 €
- Plat thaï du jour — 9 €
- Menu enfant — 6 €
- Nems poulet — 1 € l'unité
- Nems porc — 1 € l'unité
- Nems crevette — 1 € l'unité
- Samoussa — 1,50 €
- Spring roll — 3 €
- Sticky rice mangue — 4 €
- Cola — 2 €
- Ice Tea — 2 €
- Thai Iced Tea — 3 €

## 7. Évolution V2.02 — variantes des nems

Le produit unique « Nems » est remplacé dans la V2 par trois variantes indépendantes :

```text
Nems poulet       - 0 +
Nems porc         - 0 +
Nems crevette     - 0 +
```

Règles :

- chaque variante possède son propre compteur ;
- les quantités sont indépendantes ;
- chaque variante est ajoutée séparément au panier ;
- le prix est de 1 € par unité ;
- le nom de la variante doit apparaître dans le panier et la commande ;
- cette évolution ne doit pas modifier les autres entrées ou plats ;
- le système doit fonctionner avec le moteur principal et le fallback ;
- l'ancien produit générique « Nems » provenant de Supabase ne doit pas remplacer les trois variantes locales.

## 8. Garnitures et variantes futures

Un système plus général pourra être développé ultérieurement pour d'autres produits, mais il ne doit pas être généralisé automatiquement à partir de la V2.02.

Les futures options pourront inclure :

- poulet ;
- porc ;
- crevettes ;
- quantités indépendantes ;
- suppléments éventuels ;
- affichage détaillé dans le panier et l'administration.

## 9. Commande et Click & Collect

À développer progressivement :

- choix du service midi ou soir ;
- génération des créneaux de retrait ;
- prochain créneau disponible ;
- délai de préparation ;
- formulaire client ;
- validation ;
- numéro de commande ;
- paiement en ligne ;
- confirmation client ;
- enregistrement complet dans Supabase.

## 10. Administration

L'administration doit rester indépendante et permettre progressivement :

- connexion sécurisée ;
- liste et détail des commandes ;
- statuts en attente, préparation et prête ;
- estimation du temps ;
- gestion des produits et disponibilités ;
- statistiques simples.

Toute modification publique doit vérifier qu'elle ne casse pas le module Supabase partagé ni l'administration.

## 11. Méthode obligatoire avant chaque changement

1. Identifier précisément la fonctionnalité demandée.
2. Lire le cahier des charges.
3. Lire les fichiers réels concernés sur GitHub.
4. Vérifier leurs dépendances.
5. Définir ce qui ne doit pas changer.
6. Modifier uniquement le nécessaire.
7. Relire chaque fichier modifié après écriture.
8. Vérifier syntaxe et logique.
9. Incrémenter le cache-buster si nécessaire.
10. Donner l'URL de test et les contrôles à effectuer.
11. Mettre à jour ce cahier après chaque décision ou fonctionnalité validée.

## 12. Critères de validation

Une évolution n'est terminée que si :

- le menu s'affiche ;
- les catégories fonctionnent ;
- les contrôles `- / +` fonctionnent ;
- le piment fonctionne si concerné ;
- l'ajout au panier fonctionne ;
- le panier s'ouvre ;
- aucun autre produit ou module ne régresse ;
- le PC fonctionne ;
- le mobile fonctionne ;
- l'administration fonctionne toujours si Supabase a été touché.

## 13. Priorité de développement

1. Stabiliser V2.02.
2. Tester les trois variantes de nems et leur panier.
3. Finaliser les cartes et options produits.
4. Stabiliser panier et variantes.
5. Créneaux Click & Collect.
6. Checkout complet.
7. Paiement.
8. Confirmation et suivi.
9. Administration avancée.
10. Optimisation et tests finaux.

## 14. Principe anti-régression

Aucune nouvelle fonction ne doit être développée sur une base non validée. Si une modification casse une fonction existante, restaurer d'abord la dernière version fonctionnelle puis reprendre la modification de manière isolée.

Ce document est évolutif et constitue la référence fonctionnelle du projet. Toute nouvelle décision importante, contrainte ou fonctionnalité validée doit y être ajoutée.
