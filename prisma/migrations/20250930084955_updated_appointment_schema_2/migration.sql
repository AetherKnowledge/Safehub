/*
  Warnings:

  - Added the required column `sessionPreference` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."SessionPreference" AS ENUM ('InPerson', 'Online', 'Either');

-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "sessionPreference" "public"."SessionPreference" NOT NULL;
