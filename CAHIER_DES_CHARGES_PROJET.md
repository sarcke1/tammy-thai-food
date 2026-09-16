# Cahier des charges évolutif — Tammy Thai Food

Dernière mise à jour : 16 septembre 2026
Version de référence : V2.02 — correction fiche Nems

## 1. Objectif du projet
Créer un site professionnel de commande en ligne pour Tammy Thai Food, spécialisé dans la cuisine thaïlandaise à Champhol, avec fonctionnement Click & Collect.

## 2. Règles absolues
1. La V1 ne doit jamais être modifiée.
2. Une seule zone ou fonctionnalité à la fois.
3. Lire les fichiers réels GitHub avant toute modification.
4. Relire chaque fichier après modification.
5. Préserver toutes les fonctions validées.
6. En cas de problème, restaurer la dernière base fonctionnelle avant de poursuivre.
7. Ne jamais mettre de clé secrète Supabase dans le frontend.
8. Toujours préciser les fichiers modifiés, les impacts et l’URL de test.

## 3. Versions
- V2.01 : base fonctionnelle menu, quantités, piment, panier, Supabase et administration.
- V2.02 : fiche unique Nems avec trois compteurs de garniture indépendants.
- V2.03 et suivantes : une seule évolution à la fois, après validation de V2.02.

Une version n’est stable qu’après validation PC et mobile.

## 4. Architecture
- `v2/index.html` : structure générale.
- `v2/js/data.js` : catalogue, prix, descriptions, photos et options.
- `v2/js/app.js` : moteur principal du menu et interactions.
- `v2/js/menu-fallback.js` : secours temporaire du menu.
- `v2/js/cart.js` : panier, stockage local, quantités et total.
- `v2/js/spice.js` : gestion du piment.
- `v2/js/checkout.js` : commande.
- `v2/js/supabase.js` : connexion publique Supabase.
- `v2/admin/` : administration indépendante.
- CSS séparés par zone : variables, layout, header, hero, menu, cart, footer et responsive.

## 5. Fonctions à préserver
Affichage du menu, catégories, boutons `- / +`, piment, ajout au panier, compteur, total, suppression, vidage du panier, sauvegarde locale, Supabase, commande `pending_payment`, administration, PC et mobile.

## 6. Catalogue actuel
Pad Thaï 11 €, Plat thaï du jour 9 €, Menu enfant 6 €, Nems 1 €, Samoussa 1,50 €, Spring roll 3 €, Sticky rice mangue 4 €, Cola 2 €, Ice Tea 2 €, Thai Iced Tea 3 €.

## 7. V2.02 — Fiche unique Nems avec garnitures

Il doit y avoir **une seule fiche produit Nems**, et non trois fiches séparées.

Présentation attendue :

```text
Nems
1,00 €
Nems thaïlandais, à l’unité.

Nems porc       Quantité  − 0 +
Nems poulet     Quantité  − 0 +
Nems crevette   Quantité  − 0 +

Ajouter au panier
```

Règles :
- une seule carte visuelle « Nems » ;
- trois compteurs indépendants : porc, poulet, crevette ;
- chaque compteur démarre à 0 ;
- chaque `+` augmente uniquement sa garniture ;
- chaque `-` diminue uniquement sa garniture ;
- le bouton d’ajout est désactivé tant qu’aucun nem n’est sélectionné ;
- chaque variété est ajoutée séparément au panier avec son nom complet ;
- prix de chaque nem : 1 € ;
- aucun changement sur les autres produits ;
- l’ancien produit Supabase générique « Nems » ne doit pas créer une seconde carte.

## 8. Variantes futures
Ne pas généraliser automatiquement ce système aux autres produits. Toute nouvelle option ou garniture doit faire l’objet d’une décision spécifique et d’une version dédiée.

## 9. Développements futurs
Créneaux Click & Collect, délais de préparation, formulaire client, paiement, confirmation, suivi de commande et administration avancée seront développés progressivement, sans déstabiliser la base validée.

## 10. Méthode obligatoire
1. Identifier la demande exacte.
2. Lire le cahier des charges.
3. Lire les fichiers concernés sur GitHub.
4. Vérifier les dépendances.
5. Définir ce qui ne doit pas changer.
6. Modifier uniquement le nécessaire.
7. Relire les fichiers modifiés.
8. Vérifier la logique et les risques de régression.
9. Incrémenter les cache-busters si nécessaire.
10. Donner URL et liste des tests.
11. Mettre à jour ce cahier après chaque décision validée.

## 11. Validation
Une évolution est validée seulement si le menu, les catégories, les quantités, le panier, le total, les autres produits, le PC, le mobile et l’administration restent fonctionnels.

## 12. Principe anti-régression
Aucune nouvelle fonctionnalité sur une base instable. En cas de régression, restaurer la dernière version fonctionnelle puis reprendre isolément.
