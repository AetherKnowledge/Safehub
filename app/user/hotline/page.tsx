import HotlinePage from "@/app/pages/Hotline";
import { getAllHotline } from "@/app/pages/Hotline/HotlineActions";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const hotlines = await getAllHotline();
  console.log("Fetched hotlines:", hotlines);

  const session = await auth();
  if (!session || !session.user.type) redirect("/api/auth/signin");

  return <HotlinePage hotlines={hotlines} userType={session?.user.type} />;
};

export default page;
