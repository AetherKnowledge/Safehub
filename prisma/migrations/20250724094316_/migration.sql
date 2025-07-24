/*
  Warnings:

  - You are about to drop the column `imageCount` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "imageCount",
ADD COLUMN     "images" VARCHAR(255)[];
