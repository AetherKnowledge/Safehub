/*
  Warnings:

  - A unique constraint covering the columns `[socketId]` on the table `Call` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `socketId` to the `Call` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Call" ADD COLUMN     "socketId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Call_socketId_key" ON "Call"("socketId");
