import { Order, SortBy } from "@/app/pages/Dashboard/Student/Dashboard";
import PostPage from "@/app/pages/Post/PostPage";
import { auth } from "@/auth";

type Props = { searchParams: Promise<{ sortBy?: SortBy; order?: Order }> };

const page = async ({ searchParams }: Props) => {
  const session = await auth();
  if (!session) return;

  return <PostPage searchParams={await searchParams} />;
};

export default page;
