import { auth } from "@/auth";
import { sortPosts } from "@/lib/utils";
import { Order, SortBy } from "../Dashboard/Student/Dashboard";
import DashboardPosts from "../Dashboard/Student/DashboardPosts";
import { getPosts } from "./PostActions";

const PostPage = async ({
  searchParams: { sortBy, order },
}: {
  searchParams: { sortBy?: SortBy; order?: Order };
}) => {
  const posts = sortPosts(await getPosts(), sortBy, order);
  const session = await auth();

  return (
    <div className="flex flex-col gap-3 flex-1 min-h-0">
      <DashboardPosts
        posts={posts}
        sortBy={sortBy}
        order={order}
        userType={session?.user?.type}
      />
    </div>
  );
};

export default PostPage;
