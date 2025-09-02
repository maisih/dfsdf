-- Fix OTP expiry warning by setting a more reasonable expiry time
-- This reduces the security risk of long-lived OTP tokens

UPDATE auth.config 
SET 
  otp_expiry = 300  -- 5 minutes instead of the default longer period
WHERE true;