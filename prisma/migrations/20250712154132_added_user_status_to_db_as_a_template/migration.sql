-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Online', 'Offline');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'Offline';
