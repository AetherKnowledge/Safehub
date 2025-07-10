-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('Pending', 'Accepted', 'Rejected', 'Ended');

-- AlterTable
ALTER TABLE "ChatMember" ADD COLUMN     "onCall" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Call" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "status" "CallStatus" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Call_chatId_key" ON "Call"("chatId");

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
