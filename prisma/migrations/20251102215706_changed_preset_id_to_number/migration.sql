/*
  Warnings:

  - The primary key for the `AiPreset` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `AiPreset` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `presetId` on the `AiSettings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."AiSettings" DROP CONSTRAINT "AiSettings_presetId_fkey";

-- AlterTable
ALTER TABLE "public"."AiPreset" DROP CONSTRAINT "AiPreset_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "AiPreset_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."AiSettings" DROP COLUMN "presetId",
ADD COLUMN     "presetId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."AiSettings" ADD CONSTRAINT "AiSettings_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "public"."AiPreset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
