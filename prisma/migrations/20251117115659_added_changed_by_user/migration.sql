/*
  Warnings:

  - Added the required column `changedBy` to the `AppointmentLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."AppointmentLog" ADD COLUMN     "changedBy" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."AppointmentLog" ADD CONSTRAINT "AppointmentLog_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
