/*
  Warnings:

  - You are about to drop the column `concern` on the `Appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "concern",
ADD COLUMN     "concerns" TEXT;
