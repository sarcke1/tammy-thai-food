# PROJECT MEMORY

V2 : sauvegarde

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
