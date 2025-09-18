/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Appointment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `AvailableSlot` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Call` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CallMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Chat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ChatMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ChatMessage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Counselor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Dislike` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `VerificationToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `chathistory` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Admin" DROP CONSTRAINT "Admin_adminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Appointment" DROP CONSTRAINT "Appointment_counselorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Appointment" DROP CONSTRAINT "Appointment_studentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AvailableSlot" DROP CONSTRAINT "AvailableSlot_counselorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Call" DROP CONSTRAINT "Call_callerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Call" DROP CONSTRAINT "Call_chatId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CallMember" DROP CONSTRAINT "CallMember_callId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CallMember" DROP CONSTRAINT "CallMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ChatMember" DROP CONSTRAINT "ChatMember_chatId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ChatMember" DROP CONSTRAINT "ChatMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ChatMessage" DROP CONSTRAINT "ChatMessage_chatId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ChatMessage" DROP CONSTRAINT "ChatMessage_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Counselor" DROP CONSTRAINT "Counselor_counselorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Dislike" DROP CONSTRAINT "Dislike_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Dislike" DROP CONSTRAINT "Dislike_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Like" DROP CONSTRAINT "Like_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Student" DROP CONSTRAINT "Student_studentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."chathistory" DROP CONSTRAINT "chathistory_session_id_fkey";

-- AlterTable
ALTER TABLE "public"."Account" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."Admin" DROP CONSTRAINT "Admin_pkey",
ALTER COLUMN "adminId" DROP DEFAULT,
ALTER COLUMN "adminId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminId");

-- AlterTable
ALTER TABLE "public"."Appointment" DROP CONSTRAINT "Appointment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "studentId" SET DATA TYPE TEXT,
ALTER COLUMN "counselorId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."AvailableSlot" DROP CONSTRAINT "AvailableSlot_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "counselorId" SET DATA TYPE TEXT,
ADD CONSTRAINT "AvailableSlot_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Call" DROP CONSTRAINT "Call_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "chatId" SET DATA TYPE TEXT,
ALTER COLUMN "callerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Call_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."CallMember" DROP CONSTRAINT "CallMember_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "callId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "CallMember_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Chat" DROP CONSTRAINT "Chat_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Chat_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."ChatMember" DROP CONSTRAINT "ChatMember_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "chatId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ChatMember_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."ChatMessage" DROP CONSTRAINT "ChatMessage_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "chatId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "postId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Counselor" DROP CONSTRAINT "Counselor_pkey",
ALTER COLUMN "counselorId" DROP DEFAULT,
ALTER COLUMN "counselorId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Counselor_pkey" PRIMARY KEY ("counselorId");

-- AlterTable
ALTER TABLE "public"."Dislike" DROP CONSTRAINT "Dislike_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "postId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Dislike_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Like" DROP CONSTRAINT "Like_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "postId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Like_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "authorId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_pkey",
ALTER COLUMN "sessionToken" DROP DEFAULT,
ALTER COLUMN "sessionToken" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionToken");

-- AlterTable
ALTER TABLE "public"."Student" DROP CONSTRAINT "Student_pkey",
ALTER COLUMN "studentId" DROP DEFAULT,
ALTER COLUMN "studentId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("studentId");

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."VerificationToken" DROP CONSTRAINT "VerificationToken_pkey",
ALTER COLUMN "identifier" SET DATA TYPE TEXT,
ALTER COLUMN "token" SET DATA TYPE TEXT,
ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier", "token");

-- AlterTable
ALTER TABLE "public"."chathistory" DROP CONSTRAINT "chathistory_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "session_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "chathistory_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Counselor" ADD CONSTRAINT "Counselor_counselorId_fkey" FOREIGN KEY ("counselorId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Admin" ADD CONSTRAINT "Admin_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChatMember" ADD CONSTRAINT "ChatMember_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChatMember" ADD CONSTRAINT "ChatMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChatMessage" ADD CONSTRAINT "ChatMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Call" ADD CONSTRAINT "Call_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Call" ADD CONSTRAINT "Call_callerId_fkey" FOREIGN KEY ("callerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CallMember" ADD CONSTRAINT "CallMember_callId_fkey" FOREIGN KEY ("callId") REFERENCES "public"."Call"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CallMember" ADD CONSTRAINT "CallMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AvailableSlot" ADD CONSTRAINT "AvailableSlot_counselorId_fkey" FOREIGN KEY ("counselorId") REFERENCES "public"."Counselor"("counselorId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Dislike" ADD CONSTRAINT "Dislike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Dislike" ADD CONSTRAINT "Dislike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chathistory" ADD CONSTRAINT "chathistory_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("studentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_counselorId_fkey" FOREIGN KEY ("counselorId") REFERENCES "public"."Counselor"("counselorId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
