/*
  Warnings:

  - You are about to drop the column `images` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "images",
ADD COLUMN     "imagesCount" INTEGER NOT NULL DEFAULT 0;
