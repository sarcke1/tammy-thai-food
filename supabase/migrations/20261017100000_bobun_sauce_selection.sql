-- Tammy Thai Food — Bò Bún sauce selection for public orders
-- Validates the explicit sauce choice and stores it on the matching order item.
CREATE OR REPLACE FUNCTION public.create_public_order_in_slot(p_first_name text, p_last_name text, p_email text, p_phone text, p_service_slot_id uuid, p_items jsonb, p_customer_note text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_slot public.service_slots%rowtype;
  v_local_now timestamp without time zone;
  v_customer_id uuid;
  v_order_id uuid;
  v_order_number bigint;
  v_total numeric(10,2) := 0;
  v_prep_minutes integer := 0;
  v_existing_minutes integer := 0;
  v_item jsonb;
  v_product public.products%rowtype;
  v_qty integer;
  v_spice integer;
  v_protein text;
  v_is_nems boolean;
  v_bonus integer;
  v_note text;
begin
  if coalesce(jsonb_typeof(p_items), '') <> 'array'
     or jsonb_array_length(coalesce(p_items, '[]'::jsonb)) = 0
     or jsonb_array_length(p_items) > 100 then
    raise exception 'Le panier est vide ou trop volumineux.';
  end if;
  if length(trim(coalesce(p_first_name, ''))) < 2 then
    raise exception 'Indiquez votre nom.';
  end if;
  if coalesce(trim(p_email), '') !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' then
    raise exception 'Adresse email invalide.';
  end if;
  if length(regexp_replace(coalesce(p_phone, ''), '\s', '', 'g')) < 10 then
    raise exception 'Numéro de téléphone invalide.';
  end if;

  select * into v_slot
  from public.service_slots
  where id = p_service_slot_id
  for update;
  if not found or not v_slot.active then
    raise exception 'Ce créneau n’est plus disponible.';
  end if;

  v_local_now := timezone('Europe/Paris', now());
  if v_slot.service_date < v_local_now::date or v_slot.service_date > v_local_now::date + 1 then
    raise exception 'Les commandes publiques sont limitées à aujourd’hui et demain.';
  end if;
  if v_slot.service_date = v_local_now::date and v_slot.start_time <= v_local_now::time then
    raise exception 'Ce créneau est déjà commencé ou passé.';
  end if;
  if v_slot.end_time - v_slot.start_time <> interval '15 minutes' then
    raise exception 'Le créneau doit durer 15 minutes.';
  end if;
  for v_item in select value from jsonb_array_elements(p_items)
  loop
    select * into v_product
    from public.products
    where id = (v_item->>'product_id')::uuid and active = true;
    if not found or v_product.public_price is null then
      raise exception 'Un produit du panier est indisponible.';
    end if;
    v_qty := coalesce((v_item->>'quantity')::integer, 0);
    v_spice := coalesce((v_item->>'spice_level')::integer, 0);
    v_protein := nullif(trim(coalesce(v_item->>'protein', '')), '');
    if nullif(trim(coalesce(v_item->>'sauce', '')), '') is not null
       and (lower(v_product.name) not like 'bò bún%'
            or trim(v_item->>'sauce') not in ('Sauce non pimentée', 'Sauce pimentée')) then
      raise exception 'Choix de sauce invalide.';
    end if;
    if v_qty < 1 or v_qty > 100 then
      raise exception 'Quantité invalide.';
    end if;
    if v_spice < 0 or v_spice > 3 or (v_spice > 0 and not v_product.supports_spice) then
      raise exception 'Niveau de piment invalide.';
    end if;
    if jsonb_typeof(v_product.protein_options) = 'array'
       and jsonb_array_length(v_product.protein_options) > 0
       and (v_protein is null or not exists (
         select 1 from jsonb_array_elements_text(v_product.protein_options) opt where opt = v_protein
       )) then
      raise exception 'Choix de viande invalide pour un produit.';
    end if;
    v_is_nems := lower(v_product.name) like 'nems maison%';
    v_bonus := case when v_is_nems then floor(v_qty / 4.0)::integer else 0 end;
    v_total := v_total + (v_qty * v_product.public_price);
    v_prep_minutes := v_prep_minutes + ((v_qty + v_bonus) * greatest(v_product.preparation_minutes, 1));
  end loop;

  select coalesce(sum(greatest(coalesce(o.estimated_preparation_minutes, 0), 0)), 0)::integer
  into v_existing_minutes
  from public.orders o
  where o.service_slot_id = v_slot.id
    and o.status not in ('cancelled', 'completed');

  if v_existing_minutes + v_prep_minutes > v_slot.max_preparation_minutes then
    raise exception 'Ce créneau est complet. Choisissez une autre heure.';
  end if;

  select id into v_customer_id
  from public.customers
  where lower(email) = lower(trim(p_email))
  order by created_at desc
  limit 1;

  if v_customer_id is null then
    insert into public.customers(first_name,last_name,email,phone)
    values(trim(p_first_name),trim(coalesce(p_last_name,'')),lower(trim(p_email)),trim(p_phone))
    returning id into v_customer_id;
  else
    update public.customers
    set first_name=trim(p_first_name),
        last_name=trim(coalesce(p_last_name,'')),
        phone=trim(p_phone),
        updated_at=now()
    where id=v_customer_id;
  end if;

  insert into public.orders(
    customer_id,service_slot_id,customer_first_name,customer_last_name,
    customer_email,customer_phone,status,subtotal,service_fee,total,
    payment_status,customer_note,pickup_date,pickup_time,sales_channel,
    estimated_preparation_minutes
  )
  values(
    v_customer_id,v_slot.id,trim(p_first_name),trim(coalesce(p_last_name,'')),
    lower(trim(p_email)),trim(p_phone),'pending_payment',v_total,0,v_total,
    'unpaid',nullif(trim(coalesce(p_customer_note,'')),''),v_slot.service_date,
    v_slot.start_time,'public',v_prep_minutes
  )
  returning id,order_number into v_order_id,v_order_number;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    select * into v_product from public.products where id=(v_item->>'product_id')::uuid;
    v_qty := (v_item->>'quantity')::integer;
    v_spice := coalesce((v_item->>'spice_level')::integer,0);
    v_protein := nullif(trim(coalesce(v_item->>'protein','')),'');
    v_is_nems := lower(v_product.name) like 'nems maison%';
    v_bonus := case when v_is_nems then floor(v_qty/4.0)::integer else 0 end;
    v_note := case when v_protein is not null then 'Viande : '||v_protein else null end;
    if lower(v_product.name) like 'bò bún%' then
      v_note := concat_ws(' — ',v_note,'Sauce : '||coalesce(nullif(trim(v_item->>'sauce'),''),'Sauce non pimentée'));
    end if;
    if nullif(trim(coalesce(p_customer_note,'')),'') is not null then
      v_note := concat_ws(' — ',v_note,trim(p_customer_note));
    end if;

    insert into public.order_items(
      order_id,product_id,product_name,quantity,unit_price,line_total,
      spice_level,preparation_minutes,customer_note
    )
    values(
      v_order_id,v_product.id,v_product.name,v_qty,v_product.public_price,
      v_qty*v_product.public_price,v_spice,greatest(v_product.preparation_minutes,1),v_note
    );

    if v_bonus > 0 then
      insert into public.order_items(
        order_id,product_id,product_name,quantity,unit_price,line_total,
        spice_level,preparation_minutes,customer_note
      )
      values(
        v_order_id,v_product.id,v_product.name,v_bonus,0,0,v_spice,
        greatest(v_product.preparation_minutes,1),v_note
      );
    end if;
  end loop;

  return jsonb_build_object('order_number',v_order_number,'total',v_total);
end;
$function$
;
