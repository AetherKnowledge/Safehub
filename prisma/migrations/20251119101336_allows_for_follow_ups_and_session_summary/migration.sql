/*
  Warnings:

  - A unique constraint covering the columns `[followUpId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "followUpId" UUID,
ADD COLUMN     "observations" TEXT,
ADD COLUMN     "recommendations" TEXT,
ADD COLUMN     "summary" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_followUpId_key" ON "public"."Appointment"("followUpId");

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_followUpId_fkey" FOREIGN KEY ("followUpId") REFERENCES "public"."Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
