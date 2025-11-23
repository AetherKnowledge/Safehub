/*
  Warnings:

  - You are about to drop the column `focus` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `hadCounselingBefore` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `room` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `urgencyLevel` on the `Appointment` table. All the data in the column will be lost.
  - Made the column `sessionPreference` on table `Appointment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Appointment" DROP COLUMN "focus",
DROP COLUMN "hadCounselingBefore",
DROP COLUMN "notes",
DROP COLUMN "room",
DROP COLUMN "urgencyLevel",
ALTER COLUMN "sessionPreference" SET NOT NULL,
ALTER COLUMN "sessionPreference" SET DEFAULT 'Either';
