/*
  Warnings:

  - You are about to drop the column `imagesCount` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "imagesCount",
ADD COLUMN     "imageCount" INTEGER NOT NULL DEFAULT 0;
