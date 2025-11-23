/*
  Warnings:

  - The primary key for the `DailyMood` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "public"."DailyMood" DROP CONSTRAINT "DailyMood_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "DailyMood_pkey" PRIMARY KEY ("id");
