/*
  Warnings:

  - You are about to drop the `ChatEncryptionKey` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserKeyPair` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatEncryptionKey" DROP CONSTRAINT "ChatEncryptionKey_chatId_fkey";

-- DropForeignKey
ALTER TABLE "UserKeyPair" DROP CONSTRAINT "UserKeyPair_userId_fkey";

-- DropTable
DROP TABLE "ChatEncryptionKey";

-- DropTable
DROP TABLE "UserKeyPair";
