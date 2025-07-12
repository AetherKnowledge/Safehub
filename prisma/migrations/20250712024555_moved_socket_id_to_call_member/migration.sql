/*
  Warnings:

  - You are about to drop the column `socketId` on the `Call` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[socketId]` on the table `CallMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `socketId` to the `CallMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Call_socketId_key";

-- AlterTable
ALTER TABLE "Call" DROP COLUMN "socketId";

-- AlterTable
ALTER TABLE "CallMember" ADD COLUMN     "socketId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CallMember_socketId_key" ON "CallMember"("socketId");
