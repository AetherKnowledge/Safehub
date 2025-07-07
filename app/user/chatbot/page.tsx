import StudentChatbotPage from "@/app/components/Student/Chatbot/AiChatbotPage";
import { getServerSession } from "next-auth";
import AuthOptions from "@/app/components/AuthOptions";
import { UserType } from "@/app/generated/prisma";
import { redirect } from "next/navigation";

const ChatbotPage = async () => {
  const session = await getServerSession(AuthOptions);
  if (!session || session.user.type !== UserType.Student)
    return redirect("/user/dashboard");

  return <StudentChatbotPage />;
};

export default ChatbotPage;
