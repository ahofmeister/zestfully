-- Migration: Convert celebrations from integer[] to jsonb
-- File: drizzle/migrations/XXXX_celebrations_to_jsonb.sql

-- Step 1: Add temporary jsonb column
ALTER TABLE "milestone" ADD COLUMN "celebrations_new" jsonb;
--> statement-breakpoint

-- Step 2: Convert and copy data to new column
UPDATE "milestone"
SET celebrations_new = (
    SELECT jsonb_agg(
                   CASE
                       WHEN day_value = 1 THEN jsonb_build_object('value', 1, 'unit', 'days')
                       WHEN day_value = 7 THEN jsonb_build_object('value', 1, 'unit', 'weeks')
                       WHEN day_value = 30 THEN jsonb_build_object('value', 1, 'unit', 'months')
                       WHEN day_value = 100 THEN jsonb_build_object('value', 100, 'unit', 'days')
                       WHEN day_value = 365 THEN jsonb_build_object('value', 1, 'unit', 'years')
                       ELSE jsonb_build_object('value', day_value, 'unit', 'days')
                       END
           )
    FROM unnest(celebrations) AS day_value
)
WHERE celebrations IS NOT NULL;
--> statement-breakpoint

-- Step 3: Drop old column
ALTER TABLE "milestone" DROP COLUMN "celebrations";
--> statement-breakpoint

-- Step 4: Rename new column
ALTER TABLE "milestone" RENAME COLUMN "celebrations_new" TO "celebrations";