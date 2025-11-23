-- CreateEnum
CREATE TYPE "public"."MoodType" AS ENUM ('Angry', 'Sad', 'Disgust', 'Joy', 'Fear', 'Skip');

-- CreateTable
CREATE TABLE "public"."DailyMood" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "mood" "public"."MoodType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyMood_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."DailyMood" ADD CONSTRAINT "DailyMood_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
