/*
  Warnings:

  - You are about to drop the column `approved` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `needsApproval` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Post" DROP COLUMN "approved",
DROP COLUMN "needsApproval";
