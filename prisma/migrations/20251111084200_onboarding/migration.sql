/*
  Warnings:

  - You are about to drop the column `recoveryEmail` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "recoveryEmail",
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "completedOnboarding" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "guardianContact" TEXT,
ADD COLUMN     "guardianEmail" TEXT,
ADD COLUMN     "guardianFirstName" TEXT,
ADD COLUMN     "guardianLastName" TEXT,
ADD COLUMN     "guardianMiddleName" TEXT,
ADD COLUMN     "guardianName" TEXT,
ADD COLUMN     "guardianSuffix" TEXT,
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "relationToGuardian" TEXT,
ADD COLUMN     "suffix" TEXT;
