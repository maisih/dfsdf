-- Fix security vulnerability: Remove public access to invitation codes
-- Only engineers should be able to view invitation codes to prevent unauthorized access

DROP POLICY IF EXISTS "Anyone can read unused invitation codes" ON public.invitation_codes;

-- The existing "Engineers can manage invitation codes" policy already provides 
-- appropriate read access for authorized users