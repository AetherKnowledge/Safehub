-- CreateTable
CREATE TABLE "ChatEncryptionKey" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "keyData" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "ChatEncryptionKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserKeyPair" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserKeyPair_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChatEncryptionKey_chatId_isActive_idx" ON "ChatEncryptionKey"("chatId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ChatEncryptionKey_chatId_version_key" ON "ChatEncryptionKey"("chatId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "UserKeyPair_userId_key" ON "UserKeyPair"("userId");

-- AddForeignKey
ALTER TABLE "ChatEncryptionKey" ADD CONSTRAINT "ChatEncryptionKey_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserKeyPair" ADD CONSTRAINT "UserKeyPair_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
