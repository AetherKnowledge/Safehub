/*
  Warnings:

  - You are about to drop the column `observations` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `recommendations` on the `Appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Appointment" DROP COLUMN "observations",
DROP COLUMN "recommendations";
