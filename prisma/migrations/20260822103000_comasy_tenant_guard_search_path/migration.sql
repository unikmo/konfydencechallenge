-- Security hardening: prevent object shadowing through a mutable search_path.
ALTER FUNCTION public.comasy_enforce_tenant_consistency()
  SET search_path = pg_catalog, public;
