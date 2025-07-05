import StudentChatbotPage from "@/app/components/Student/Chatbot/ChatbotPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserType } from "@/app/generated/prisma";
import { redirect } from "next/navigation";

const ChatbotPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session || session.user.type !== UserType.Student)
    return redirect("/user/dashboard");

  return <StudentChatbotPage />;
};

export default ChatbotPage;
