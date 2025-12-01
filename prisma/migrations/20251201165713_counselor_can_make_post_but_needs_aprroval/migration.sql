-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "approved" BOOLEAN,
ADD COLUMN     "needsApproval" BOOLEAN NOT NULL DEFAULT false;
