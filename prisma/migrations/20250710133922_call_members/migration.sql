/*
  Warnings:

  - You are about to drop the column `onCall` on the `ChatMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChatMember" DROP COLUMN "onCall";

-- CreateTable
CREATE TABLE "CallMember" (
    "id" TEXT NOT NULL,
    "callId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CallMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CallMember_callId_userId_key" ON "CallMember"("callId", "userId");

-- AddForeignKey
ALTER TABLE "CallMember" ADD CONSTRAINT "CallMember_callId_fkey" FOREIGN KEY ("callId") REFERENCES "Call"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallMember" ADD CONSTRAINT "CallMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
