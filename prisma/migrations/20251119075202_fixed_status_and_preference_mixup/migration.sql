-- AlterTable
ALTER TABLE "public"."Appointment" ALTER COLUMN "status" SET DEFAULT 'Pending',
ALTER COLUMN "sessionPreference" DROP DEFAULT;
