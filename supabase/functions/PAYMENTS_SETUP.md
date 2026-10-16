# Paiements V3.08 — configuration serveur

Les fichiers de ce dossier sont préparés sur la branche `v3.08-payment`. Ils ne sont pas encore déployés.

## Secrets à configurer dans Supabase

Dans le projet Supabase `ugarjrbtvwbwppfeusgd`, ajouter les secrets via la configuration Edge Functions (ne jamais les committer dans GitHub) :

- `STRIPE_SECRET_KEY` — clé secrète Stripe du compte marchand.
- `STRIPE_WEBHOOK_SECRET` — secret de signature de l'endpoint webhook Stripe.
- `PAYPAL_CLIENT_ID` — identifiant API REST PayPal.
- `PAYPAL_CLIENT_SECRET` — secret API REST PayPal.
- `PAYPAL_WEBHOOK_ID` — identifiant du webhook PayPal configuré dans le compte marchand.

Les variables `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont fournies par l'environnement Edge Functions Supabase.

## Déploiement après validation

Déployer les fonctions suivantes avec `verify_jwt=false`, car elles sont appelées depuis GitHub Pages ou par les webhooks. Chaque fonction doit conserver ses contrôles internes :
- `payment-start`
- `payment-confirm`
- `payment-webhook`

Créer ensuite deux endpoints webhook côté prestataires pointant vers :
`https://ugarjrbtvwbwppfeusgd.supabase.co/functions/v1/payment-webhook`

Stripe : événements `checkout.session.completed` et `checkout.session.async_payment_succeeded`.
PayPal : événement `PAYMENT.CAPTURE.COMPLETED`.

## Tests obligatoires

1. En environnement de test, Stripe réussi / refusé / annulé.
2. PayPal approuvé / annulé / capture déjà effectuée.
3. Vérifier que le montant et la devise sont validés côté serveur.
4. Vérifier le statut affiché dans l'administration.
5. Paiement espèces : commande à régler, puis action manuelle d'encaissement.
6. Vérifier les notifications webhook répétées sans effets secondaires.
7. Tester PC et mobile avant publication.

Ne jamais coller les clés privées dans le code, les commits, les tickets ou la conversation.
