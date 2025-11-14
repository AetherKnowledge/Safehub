-- AlterTable
ALTER TABLE "public"."Appointment" ALTER COLUMN "focus" DROP NOT NULL,
ALTER COLUMN "hadCounselingBefore" DROP NOT NULL,
ALTER COLUMN "urgencyLevel" DROP NOT NULL,
ALTER COLUMN "sessionPreference" DROP NOT NULL;
