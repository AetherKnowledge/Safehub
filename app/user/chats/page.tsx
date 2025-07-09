import { redirect } from "next/navigation";

const page = () => {
  redirect("/user/chats/-1");
};

export default page;
