# Tammy Thai Food — V2 architecture / transfer plan

V2 is a clean rebuild. V1 remains the functional reference and must not be modified during V2 development.

## Rule

**One modification = one zone/module.**

- Content changes: `js/data.js`
- Banner: `css/hero.css` + hero markup only when necessary
- Global visual tokens: `css/variables.css`
- General layout: `css/layout.css`
- Header: `css/header.css`
- Menu cards: `css/menu.css`
- Footer: `css/footer.css`
- Mobile: `css/responsive.css`
- Cart: future dedicated JS module
- Ordering/checkout: future dedicated JS module
- Payment: future dedicated JS module
- Tracking/admin: future dedicated JS modules

## V1 inventory to transfer

### Catalogue / content
- [x] Pad Thaï — 11 €
- [x] Plat thaï du jour — 9 €
- [x] Menu enfant — 6 €
- [x] Nems — 1 €
- [x] Samoussa — 1.50 €
- [x] Spring roll — 3 €
- [x] Sticky rice mangue — 4 €
- [x] Cola — 2 €
- [x] Ice Tea — 2 €
- [x] Thai Iced Tea — 3 €
- [ ] Finaliser les vraies photos dans un système d'assets propre

### Produit / piment
- [x] Identifier les plats concernés par le piment
- [x] Identifier le niveau de piment 1–3
- [ ] Recréer le composant piment `- / +` dans V2
- [ ] Gérer plusieurs portions d'un même plat avec un niveau de piment différent
- [ ] Afficher le niveau choisi dans le panier

### Quantités / panier
- [ ] Quantité `- / +` pour les produits non épicés
- [ ] Ajout au panier
- [ ] Suppression / décrément
- [ ] Compteur d'articles
- [ ] Total panier
- [ ] Affichage des lignes du panier

### Commande
- [x] Services midi 11:30–14:00 et soir 18:30–21:00 identifiés
- [ ] Génération des créneaux de 15 min
- [ ] Détection du service actuel / prochain service
- [ ] Estimation de préparation
- [ ] File de commandes et estimation d'attente
- [ ] Checkout
- [ ] Validation de commande
- [ ] Persistance localStorage

### Suivi
- [ ] Numéro de commande
- [ ] Statuts attente / préparation / prête
- [ ] Barre de progression
- [ ] Estimation / position dans la file
- [ ] Page de suivi

### Administration
- [ ] Connexion/admin
- [ ] Liste des commandes
- [ ] Passage en préparation
- [ ] Passage en prête
- [ ] Statistiques

### Visuel V2
- [x] Structure indépendante
- [x] Bannière isolée
- [x] Fond/global design isolé
- [x] Header isolé
- [x] Cartes menu isolées
- [x] Footer isolé
- [x] Responsive isolé
- [ ] Remplacer les placeholders par les visuels définitifs
- [ ] Reprendre les bonnes idées visuelles de V1 sans reprendre ses dépendances CSS

## Principe de transfert

V1 sert de **référence fonctionnelle**. On transfère une fonction à la fois dans V2, en la reconnectant à des composants indépendants. Le code V1 n'est pas copié en bloc dans V2.
