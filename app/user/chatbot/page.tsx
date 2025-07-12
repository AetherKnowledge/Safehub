import StudentChatbotPage from "@/app/components/Student/Chatbot/AiChatbotPage";
import { UserType } from "@/app/generated/prisma";
import authOptions from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const ChatbotPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session || session.user.type !== UserType.Student)
    return redirect("/user/dashboard");

  return <StudentChatbotPage />;
};

export default ChatbotPage;
