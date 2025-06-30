-- DropForeignKey
ALTER TABLE "chathistory" DROP CONSTRAINT "chathistory_session_id_fkey";

-- AddForeignKey
ALTER TABLE "chathistory" ADD CONSTRAINT "chathistory_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
