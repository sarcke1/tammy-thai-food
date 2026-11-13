-- HACCP security: trigger function is internal only
revoke execute on function public.set_haccp_temperature_conformity() from public, anon, authenticated;
