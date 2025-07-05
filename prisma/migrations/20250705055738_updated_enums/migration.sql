/*
  Warnings:

  - The values [approved,pending,completed,rejected] on the enum `AppointmentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [student,counselor,admin] on the enum `UserType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AppointmentStatus_new" AS ENUM ('APPROVED', 'PENDING', 'COMPLETED', 'REJECTED');
ALTER TABLE "Appointment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Appointment" ALTER COLUMN "status" TYPE "AppointmentStatus_new" USING ("status"::text::"AppointmentStatus_new");
ALTER TYPE "AppointmentStatus" RENAME TO "AppointmentStatus_old";
ALTER TYPE "AppointmentStatus_new" RENAME TO "AppointmentStatus";
DROP TYPE "AppointmentStatus_old";
ALTER TABLE "Appointment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserType_new" AS ENUM ('Student', 'Counselor', 'Admin');
ALTER TABLE "User" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "type" TYPE "UserType_new" USING ("type"::text::"UserType_new");
ALTER TYPE "UserType" RENAME TO "UserType_old";
ALTER TYPE "UserType_new" RENAME TO "UserType";
DROP TYPE "UserType_old";
ALTER TABLE "User" ALTER COLUMN "type" SET DEFAULT 'Student';
COMMIT;

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "type" SET DEFAULT 'Student';
