create extension if not exists vector;

-- CreateTable
CREATE TABLE "public"."documents" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT,
    "metadata" JSONB,
    "embedding" vector(3072),

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);
