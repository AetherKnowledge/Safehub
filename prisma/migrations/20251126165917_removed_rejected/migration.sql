/*
  Warnings:

  - The values [Rejected] on the enum `AppointmentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."AppointmentStatus_new" AS ENUM ('Approved', 'Pending', 'Completed', 'Cancelled');
ALTER TABLE "public"."Appointment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Appointment" ALTER COLUMN "status" TYPE "public"."AppointmentStatus_new" USING ("status"::text::"public"."AppointmentStatus_new");
ALTER TABLE "public"."AppointmentLog" ALTER COLUMN "from" TYPE "public"."AppointmentStatus_new" USING ("from"::text::"public"."AppointmentStatus_new");
ALTER TABLE "public"."AppointmentLog" ALTER COLUMN "to" TYPE "public"."AppointmentStatus_new" USING ("to"::text::"public"."AppointmentStatus_new");
ALTER TYPE "public"."AppointmentStatus" RENAME TO "AppointmentStatus_old";
ALTER TYPE "public"."AppointmentStatus_new" RENAME TO "AppointmentStatus";
DROP TYPE "public"."AppointmentStatus_old";
ALTER TABLE "public"."Appointment" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;
