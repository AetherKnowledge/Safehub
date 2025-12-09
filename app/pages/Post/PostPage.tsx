import { auth } from "@/auth";
import { sortPosts } from "@/lib/client-utils";
import DashboardPosts from "../Dashboard/DashboardPosts";
import { Order, SortBy } from "../Dashboard/Student/Dashboard";
import { getPosts } from "./PostActions";

const PostPage = async ({
  searchParams: { sortBy, order },
}: {
  searchParams: { sortBy?: SortBy; order?: Order };
}) => {
  const posts = sortPosts(await getPosts(), sortBy, order);
  const session = await auth();

  return (
    <div className="flex items-center justify-center h-full min-h-0 overflow-y-auto pb-1 pr-1">
      <div className="flex flex-1 flex-row gap-3 h-full min-h-0 w-auto justify-center">
        <DashboardPosts
          posts={posts}
          sortBy={sortBy}
          order={order}
          userType={session?.user?.type}
        />
      </div>
    </div>
  );
};

export default PostPage;
