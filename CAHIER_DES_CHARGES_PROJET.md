# Cahier des charges évolutif — Tammy Thai Food

Dernière mise à jour : 16 septembre 2026
Version de référence : V2.01

## 1. Objectif du projet

Créer un site professionnel de commande en ligne pour Tammy Thai Food, spécialisé dans la cuisine thaïlandaise à Champhol, avec fonctionnement Click & Collect.

Le site doit être simple, rapide, responsive, fiable sur ordinateur et mobile, et permettre à terme la gestion complète des commandes, du paiement et de la préparation.

## 2. Règles absolues de développement

1. La V1 est une référence fonctionnelle et ne doit jamais être modifiée pendant le développement de la V2.
2. Une modification ciblée ne doit toucher qu'à la zone concernée.
3. Ne jamais modifier simultanément plusieurs modules fonctionnels sans nécessité.
4. Avant toute modification, lire les fichiers réels présents sur GitHub. Ne jamais se baser uniquement sur une ancienne version supposée.
5. Après chaque modification GitHub, relire le fichier modifié pour vérifier le contenu réellement enregistré.
6. Toute nouvelle fonction doit être testée avant de passer à la suivante.
7. Ne jamais supprimer une fonction existante pour en ajouter une autre sans validation explicite.
8. En cas d'erreur, conserver un mécanisme de secours visible plutôt que laisser une page vide.
9. Les clés secrètes Supabase/service_role ne doivent jamais être intégrées au frontend.
10. Toute modification doit préciser les fichiers touchés et son impact.

## 3. Gestion des versions

Le projet utilise des versions fonctionnelles validées :

- V2.01 : base stable actuelle — menu visible, quantités, piment, panier de base.
- V2.02 et suivantes : une évolution fonctionnelle ou visuelle à la fois.

Chaque version doit être considérée comme validée uniquement après test PC et mobile.

Les paramètres de cache HTML/CSS/JS doivent être incrémentés à chaque changement important afin d'éviter les anciennes versions mises en cache par GitHub Pages.

## 4. Architecture technique

La V2 doit rester modulaire :

- `v2/index.html` : structure générale uniquement.
- `v2/js/data.js` : catalogue local, contenu, prix, descriptions, photos et options produits.
- `v2/js/app.js` : moteur principal du menu et raccordement des interactions.
- `v2/js/menu-fallback.js` : affichage de secours du menu si le moteur principal échoue.
- `v2/js/cart.js` : panier, quantités, stockage local et total.
- `v2/js/spice.js` : gestion des niveaux de piment.
- `v2/js/checkout.js` : formulaire et création de commande.
- `v2/js/supabase.js` : connexion publique Supabase uniquement.
- `v2/admin/` : administration séparée du site public.
- `v2/css/variables.css` : variables graphiques.
- `v2/css/layout.css` : structure générale.
- `v2/css/header.css` : en-tête.
- `v2/css/hero.css` : bannière.
- `v2/css/menu.css` : cartes et zone menu.
- `v2/css/cart.css` : panier.
- `v2/css/footer.css` : pied de page.
- `v2/css/responsive.css` : adaptation mobile.

## 5. Fonctionnalités déjà présentes ou à préserver

- Affichage du catalogue par catégories.
- Photos et descriptions des plats.
- Quantité `- / +` sur les plats.
- Choix du niveau de piment pour les plats concernés.
- Ajout au panier.
- Affichage du compteur du panier.
- Affichage du total.
- Suppression d'articles.
- Vidage du panier.
- Persistance locale du panier.
- Connexion à Supabase.
- Création de commande en statut `pending_payment`.
- Administration séparée fonctionnelle.
- Responsive PC/mobile.

## 6. Catalogue et options produits

Le catalogue doit pouvoir gérer :

- nom du produit ;
- catégorie ;
- prix ;
- description ;
- photo ;
- ordre d'affichage ;
- produit épicé ou non ;
- niveau de piment par portion ;
- options de garniture ;
- suppléments éventuels ;
- disponibilité temporaire.

Pour les produits avec plusieurs portions, chaque portion doit pouvoir avoir son propre niveau de piment.

## 7. Garnitures et variantes

Prévoir un système propre pour les plats concernés, notamment :

- choix de la viande ou garniture ;
- poulet ;
- porc ;
- crevettes ;
- quantité indépendante par garniture si nécessaire ;
- supplément tarifaire éventuel ;
- affichage clair dans le panier et dans la commande administrateur.

Le système de garnitures ne doit pas casser les contrôles de quantité classiques des autres produits.

## 8. Commande et Click & Collect

À développer progressivement :

- choix du service midi ou soir ;
- génération des créneaux de retrait ;
- détection du prochain créneau disponible ;
- délai de préparation ;
- formulaire client ;
- validation de commande ;
- numéro de commande ;
- paiement en ligne ;
- confirmation client ;
- enregistrement complet dans Supabase.

## 9. Administration

L'administration doit rester indépendante du site public et permettre progressivement :

- connexion sécurisée ;
- liste des commandes ;
- détail d'une commande ;
- statut en attente ;
- statut en préparation ;
- statut prête ;
- estimation du temps ;
- gestion des produits et disponibilités ;
- statistiques simples.

Toute modification du site public doit vérifier qu'elle ne casse pas l'administration, notamment le module partagé Supabase.

## 10. Méthode obligatoire avant chaque changement

Avant modification :

1. Identifier précisément la fonctionnalité demandée.
2. Identifier le ou les fichiers réellement concernés.
3. Lire leur contenu actuel sur GitHub.
4. Vérifier les dépendances avec les autres modules.
5. Définir ce qui ne doit absolument pas changer.
6. Modifier uniquement la zone nécessaire.
7. Relire le fichier après écriture.
8. Vérifier les éventuelles erreurs de syntaxe ou de logique.
9. Incrémenter le cache-buster si nécessaire.
10. Donner à Cédric l'URL de test et les points précis à contrôler.

## 11. Critères de validation

Une évolution n'est pas considérée comme terminée tant que :

- le menu s'affiche ;
- les catégories fonctionnent ;
- les quantités `- / +` fonctionnent ;
- le piment fonctionne si concerné ;
- l'ajout au panier fonctionne ;
- le panier s'ouvre ;
- aucun autre plat ou module n'a régressé ;
- le rendu PC est correct ;
- le rendu mobile est correct ;
- l'administration fonctionne toujours si Supabase a été touché.

## 12. Priorité de développement

Ordre recommandé :

1. Stabiliser totalement V2.01.
2. Finaliser les cartes produits et garnitures.
3. Stabiliser panier et variantes.
4. Créneaux Click & Collect.
5. Checkout complet.
6. Paiement.
7. Confirmation et suivi de commande.
8. Administration avancée.
9. Optimisation visuelle et performance.
10. Tests finaux PC/mobile.

## 13. Principe de sécurité contre les régressions

Aucune nouvelle fonction ne doit être développée sur une base non validée. Si une modification casse une fonction existante, il faut d'abord restaurer la dernière version fonctionnelle, puis reprendre la modification de manière isolée.

Ce document est évolutif : toute nouvelle décision importante, contrainte ou fonctionnalité validée doit y être ajoutée avant de poursuivre le développement.
