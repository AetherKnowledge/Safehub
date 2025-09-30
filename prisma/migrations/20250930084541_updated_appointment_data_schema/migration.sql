/*
  Warnings:

  - You are about to drop the column `concerns` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `focus` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hadCounselingBefore` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notes` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urgencyLevel` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Appointment" DROP COLUMN "concerns",
ADD COLUMN     "focus" TEXT NOT NULL,
ADD COLUMN     "hadCounselingBefore" BOOLEAN NOT NULL,
ADD COLUMN     "notes" TEXT NOT NULL,
ADD COLUMN     "urgencyLevel" INTEGER NOT NULL;
