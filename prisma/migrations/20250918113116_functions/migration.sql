-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================
-- Functions
-- ================================

-- Function public.uid()
CREATE OR REPLACE FUNCTION public.uid() RETURNS uuid
    LANGUAGE sql STABLE
AS $$
  SELECT
    COALESCE(
      NULLIF(current_setting('request.jwt.claim.sub', true), ''),
      (NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
    )::uuid
$$;

-- Function public.role()
CREATE OR REPLACE FUNCTION public.role() RETURNS text
    LANGUAGE sql STABLE
AS $$
  SELECT
    COALESCE(
      NULLIF(current_setting('request.jwt.claim.type', true), ''),
      (NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'type')
    )::text
$$;

-- ================================
-- Grants
-- ================================
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON SCHEMA public TO postgres;

GRANT ALL ON TABLE public."User" TO postgres;
GRANT ALL ON TABLE public."User" TO service_role;

GRANT ALL ON TABLE public."Session" TO postgres;
GRANT ALL ON TABLE public."Session" TO service_role;

GRANT ALL ON TABLE public."Account" TO postgres;
GRANT ALL ON TABLE public."Account" TO service_role;

GRANT ALL ON TABLE public."VerificationToken" TO postgres;
GRANT ALL ON TABLE public."VerificationToken" TO service_role;

-- ================================
-- Row Level Security (RLS)
-- ================================
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can view own user data."
ON public."User" FOR SELECT
USING (public.uid() = id);

CREATE POLICY "Can update own user data."
ON public."User" FOR UPDATE
USING (public.uid() = id);
