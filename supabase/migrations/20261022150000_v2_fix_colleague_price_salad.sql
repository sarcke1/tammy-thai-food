-- Align the V2 colleague server price with its explicit menu override.
-- Keep the public V3 price independent and unchanged.
UPDATE public.products
SET price = 8.00
WHERE name = 'Salade thaïe de viande hachée aux herbes fraîches'
  AND price IS DISTINCT FROM 8.00;
