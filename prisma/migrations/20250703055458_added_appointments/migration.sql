-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('student', 'counselor', 'admin');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('confirmed', 'pending', 'done');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "type" "UserType" NOT NULL DEFAULT 'student';

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "counselorId" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'pending',
    "schedule" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_counselorId_fkey" FOREIGN KEY ("counselorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
