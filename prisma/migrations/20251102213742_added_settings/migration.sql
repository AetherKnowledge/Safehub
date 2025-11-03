-- CreateEnum
CREATE TYPE "public"."Tools" AS ENUM ('WebSearch', 'Calculator', 'GetPosts', 'GetHotlines', 'QueryVault');

-- CreateTable
CREATE TABLE "public"."AiPreset" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "tasks" TEXT,
    "rules" TEXT,
    "limits" TEXT,
    "examples" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiPreset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AiSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "presetId" UUID NOT NULL,
    "tools" "public"."Tools"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiSettings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."AiSettings" ADD CONSTRAINT "AiSettings_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "public"."AiPreset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
