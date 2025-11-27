/*
  Warnings:

  - You are about to drop the column `didNotAttend` on the `Appointment` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "public"."AppointmentStatus" ADD VALUE 'DidNotAttend';

-- AlterTable
ALTER TABLE "public"."Appointment" DROP COLUMN "didNotAttend";
