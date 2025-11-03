/*
  Warnings:

  - The values [Calculator] on the enum `Tools` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Tools_new" AS ENUM ('WebSearch', 'GetPosts', 'GetHotlines', 'QueryVault');
ALTER TABLE "public"."AiSettings" ALTER COLUMN "tools" TYPE "public"."Tools_new"[] USING ("tools"::text::"public"."Tools_new"[]);
ALTER TYPE "public"."Tools" RENAME TO "Tools_old";
ALTER TYPE "public"."Tools_new" RENAME TO "Tools";
DROP TYPE "public"."Tools_old";
COMMIT;
