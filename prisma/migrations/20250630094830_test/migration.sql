-- CreateTable
CREATE TABLE "chathistory" (
    "id" SERIAL NOT NULL,
    "session_id" VARCHAR(255) NOT NULL,
    "message" JSONB NOT NULL,

    CONSTRAINT "chathistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chathistory" ADD CONSTRAINT "chathistory_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
