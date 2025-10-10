-- AlterTable: Rename 'details' column to 'metadata' and change type to JSONB
-- Also make userId NOT NULL and remove ipAddress column

-- First, check if the 'details' column exists and rename it to 'metadata'
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'ActivityLog' 
        AND column_name = 'details'
    ) THEN
        -- Rename column from 'details' to 'metadata'
        ALTER TABLE "ActivityLog" RENAME COLUMN "details" TO "metadata";
        
        -- Change the column type to JSONB if it's not already
        ALTER TABLE "ActivityLog" ALTER COLUMN "metadata" TYPE JSONB USING 
            CASE 
                WHEN "metadata" IS NULL THEN NULL::JSONB
                WHEN "metadata"::text = '' THEN NULL::JSONB
                ELSE jsonb_build_object('details', "metadata")
            END;
    END IF;
    
    -- Make userId NOT NULL (update any NULL values first)
    UPDATE "ActivityLog" SET "userId" = 'cmghqe4so0000jv0480fe8pgt' WHERE "userId" IS NULL;
    ALTER TABLE "ActivityLog" ALTER COLUMN "userId" SET NOT NULL;
    
    -- Drop ipAddress column if it exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'ActivityLog' 
        AND column_name = 'ipAddress'
    ) THEN
        ALTER TABLE "ActivityLog" DROP COLUMN "ipAddress";
    END IF;
END $$;

