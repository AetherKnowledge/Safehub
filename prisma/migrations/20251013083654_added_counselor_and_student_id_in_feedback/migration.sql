/*
  Warnings:

  - Added the required column `counselorId` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Feedback" ADD COLUMN     "counselorId" UUID NOT NULL,
ADD COLUMN     "studentId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Feedback" ADD CONSTRAINT "Feedback_counselorId_fkey" FOREIGN KEY ("counselorId") REFERENCES "public"."Counselor"("counselorId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Feedback" ADD CONSTRAINT "Feedback_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("studentId") ON DELETE CASCADE ON UPDATE CASCADE;
