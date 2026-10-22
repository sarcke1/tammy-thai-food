-- Make V2 colleague orders use the same admin-generated service slots as V3.
-- Preserve colleague pricing, product validation, promotions and email triggers.
-- Preserve the Bò Bún sauce selection in colleague-site orders.
CREATE OR REPLACE FUNCTION public.create_pending_order(p_first_name text, p_last_name text, p_email text, p_phone text, p_service_slot_id uuid, p_items jsonb, p_customer_note text DEFAULT NULL::text, p_pickup_date date DEFAULT NULL::date)
 RETURNS TABLE(order_id uuid, order_number bigint, total numeric, preparation_minutes integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_order_id uuid;
  v_customer_id uuid;
  v_total numeric(10,2) := 0;
  v_preparation_minutes integer := 0;
  v_item jsonb;
  v_product record;
  v_quantity integer;
  v_bonus integer;
  v_delivered_quantity integer;
  v_spice_level integer;
  v_protein text;
  v_item_note text;
  v_line_total numeric(10,2);
  v_unit_price numeric(10,2);
  v_local_now timestamp without time zone;
  v_expected_date date;
  v_candidate_date date;
  v_open_found boolean := false;
  v_day_offset integer;
  v_slot public.service_slots%rowtype;
  v_existing_minutes integer := 0;
  v_service_period text;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Le panier est vide';
  end if;

  v_local_now := timezone('Europe/Paris', now());
  v_candidate_date := v_local_now::date
    + case when extract(hour from v_local_now) >= 18 then 2 else 1 end;

  for v_day_offset in 0..13 loop
    if exists (
      select 1
      from public.weekly_opening_hours h
      where h.day_of_week = extract(dow from v_candidate_date)::integer
        and h.service_period = 'midi'
        and h.is_open = true
    ) then
      v_expected_date := v_candidate_date;
      v_open_found := true;
      exit;
    end if;
    v_candidate_date := v_candidate_date + 1;
  end loop;

  if not v_open_found
    or p_pickup_date is null
    or p_pickup_date < v_expected_date
    or p_pickup_date > (date_trunc('week', v_local_now)::date + 7)
    or not exists (
      select 1 from public.weekly_opening_hours h
      where h.day_of_week = extract(dow from p_pickup_date)::integer
        and h.service_period = 'midi'
        and h.is_open = true
    ) then
    raise exception 'Date de retrait invalide. Actualisez la page et réessayez.';
  end if;

  if p_service_slot_id is null then
    raise exception 'Choisissez un créneau de retrait disponible.';
  end if;

  select * into v_slot
  from public.service_slots
  where id = p_service_slot_id and active = true
  for update;
  if not found or v_slot.service_date <> p_pickup_date then
    raise exception 'Ce créneau n’est plus disponible. Actualisez la page et réessayez.';
  end if;

  if v_slot.service_date < v_expected_date
     or v_slot.service_date > (date_trunc('week', v_local_now)::date + 7)
     or (v_slot.service_date = v_local_now::date and v_slot.start_time <= v_local_now::time) then
    raise exception 'Ce créneau n’est plus disponible.';
  end if;

  v_service_period := case when v_slot.start_time < time '15:00' then 'midi' else 'soir' end;
  if not exists (
    select 1 from public.weekly_opening_hours h
    where h.day_of_week = extract(dow from v_slot.service_date)::integer
      and h.service_period = v_service_period
      and h.is_open = true
  ) then
    raise exception 'Ce service est fermé selon le planning. Actualisez la page.';
  end if;

  for v_item in select value from jsonb_array_elements(p_items) loop
    v_quantity := (v_item->>'quantity')::integer;
    v_spice_level := coalesce((v_item->>'spice_level')::integer, 0);
    v_protein := nullif(trim(v_item->>'protein'),'');
    if v_quantity is null or v_quantity <= 0 then raise exception 'Quantité invalide'; end if;
    if v_spice_level < 0 or v_spice_level > 3 then raise exception 'Niveau de piment invalide'; end if;

    select * into v_product from public.products where id=(v_item->>'product_id')::uuid and active=true;
    if not found then raise exception 'Produit inexistant ou indisponible'; end if;
    if nullif(trim(coalesce(v_item->>'sauce','')), '') is not null
       and (lower(trim(v_product.name)) not like 'bò bún%'
            or trim(v_item->>'sauce') not in ('Sauce non pimentée','Sauce pimentée')) then
      raise exception 'Choix de sauce invalide';
    end if;

    if v_spice_level > 0 and v_product.supports_spice = false then raise exception 'Ce produit ne permet pas le choix du piment'; end if;

    if v_protein is not null then
      if v_product.protein_options is null or jsonb_typeof(v_product.protein_options) <> 'array'
         or not (v_product.protein_options @> jsonb_build_array(v_protein)) then
        raise exception 'Choix de viande invalide pour ce produit';
      end if;
    elsif v_product.protein_options is not null and jsonb_typeof(v_product.protein_options) = 'array'
      and jsonb_array_length(v_product.protein_options) > 0 then
      raise exception 'Choix de viande requis pour ce produit';
    end if;

    v_bonus := case when lower(trim(v_product.name)) like 'nems maison%' then floor(v_quantity / 4.0)::integer else 0 end;
    v_delivered_quantity := v_quantity + v_bonus;
    v_total := v_total + (v_product.price * v_quantity);
    v_preparation_minutes := v_preparation_minutes + (v_product.preparation_minutes * v_delivered_quantity);
  end loop;

  select coalesce(sum(greatest(coalesce(o.estimated_preparation_minutes, 0), 0)), 0)::integer
  into v_existing_minutes
  from public.orders o
  where o.service_slot_id = v_slot.id
    and o.status not in ('cancelled', 'completed');

  if v_existing_minutes + v_preparation_minutes > v_slot.max_preparation_minutes then
    raise exception 'Ce créneau est complet. Choisissez une autre heure.';
  end if;

  if p_email is not null or p_phone is not null then
    insert into public.customers(first_name,last_name,email,phone)
    values(p_first_name,p_last_name,p_email,p_phone)
    returning id into v_customer_id;
  end if;

  insert into public.orders(
    customer_id,service_slot_id,pickup_date,pickup_time,customer_first_name,customer_last_name,customer_email,customer_phone,
    status,payment_status,subtotal,service_fee,total,estimated_preparation_minutes,customer_note
  )
  values(v_customer_id,p_service_slot_id,p_pickup_date,v_slot.start_time,p_first_name,p_last_name,p_email,p_phone,
    'pending_payment','unpaid',v_total,0,v_total,v_preparation_minutes,p_customer_note)
  returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items) loop
    v_quantity := (v_item->>'quantity')::integer;
    v_spice_level := coalesce((v_item->>'spice_level')::integer, 0);
    v_protein := nullif(trim(v_item->>'protein'),'');
    select * into v_product from public.products where id=(v_item->>'product_id')::uuid and active=true;

    v_bonus := case when lower(trim(v_product.name)) like 'nems maison%' then floor(v_quantity / 4.0)::integer else 0 end;
    v_delivered_quantity := v_quantity + v_bonus;
    v_line_total := v_product.price * v_quantity;
    v_unit_price := v_product.price;
    v_item_note := null;
    if v_protein is not null then v_item_note := 'Viande : ' || v_protein; end if;
    if lower(trim(v_product.name)) like 'bò bún%' then
      v_item_note := concat_ws(' — ',v_item_note,'Sauce : '||coalesce(nullif(trim(v_item->>'sauce'),''),'Sauce non pimentée'));
    end if;
    if v_bonus > 0 then
      v_item_note := concat_ws(' — ', v_item_note, 'Promotion : ', v_bonus, ' unité(s) supplémentaire(s) incluse(s)');
    end if;

    insert into public.order_items(
      order_id,product_id,product_name,quantity,unit_price,line_total,spice_level,preparation_minutes,customer_note
    )
    values(v_order_id,v_product.id,v_product.name,v_quantity,v_unit_price,v_line_total,v_spice_level,
      v_product.preparation_minutes * v_quantity,v_item_note);

    if v_bonus > 0 then
      insert into public.order_items(
        order_id,product_id,product_name,quantity,unit_price,line_total,spice_level,preparation_minutes,customer_note
      )
      values(v_order_id,v_product.id,v_product.name,v_bonus,0,0,v_spice_level,
        v_product.preparation_minutes * v_bonus,
        concat('Promotion : ', v_bonus, ' unité(s) supplémentaire(s) incluse(s)'));
    end if;
  end loop;

  return query
  select o.id,o.order_number,o.total,o.estimated_preparation_minutes
  from public.orders o where o.id=v_order_id;
end;
$function$
;
