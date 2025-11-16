-- CreateEnum
CREATE TYPE "public"."FormType" AS ENUM ('BOOKING', 'EVALUATION', 'CANCELATION');

-- CreateTable
CREATE TABLE "public"."FormSchema" (
    "id" SERIAL NOT NULL,
    "type" "public"."FormType" NOT NULL,
    "schema" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormSchema_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormSchema_type_key" ON "public"."FormSchema"("type");
