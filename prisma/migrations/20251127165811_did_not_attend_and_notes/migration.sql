-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "didNotAttend" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "didNotAttendReason" TEXT,
ADD COLUMN     "notes" TEXT;
