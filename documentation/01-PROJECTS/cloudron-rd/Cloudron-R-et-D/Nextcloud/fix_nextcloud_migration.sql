-- Fix for Nextcloud Gestion App Migration Error
-- Run these commands in your Nextcloud database

-- First, check how many null values exist in the problematic column
SELECT COUNT(*) as null_count FROM oc_gestion_produit WHERE id_configuration IS NULL;

-- Option 1: Set a default value for all null entries
-- Replace '1' with an appropriate default id_configuration value
UPDATE oc_gestion_produit SET id_configuration = 1 WHERE id_configuration IS NULL;

-- Option 2: If you want to be more specific, you could set different values based on other columns
-- UPDATE oc_gestion_produit SET id_configuration = (SELECT id FROM oc_gestion_configuration LIMIT 1) WHERE id_configuration IS NULL;

-- Verify the fix worked
SELECT COUNT(*) as remaining_nulls FROM oc_gestion_produit WHERE id_configuration IS NULL;

-- After running this, you should be able to complete the Nextcloud upgrade
