import Divider from "@/app/components/Divider";
import AddPostButton from "@/app/components/Post/AddPostButton";
import PostBox from "@/app/components/Post/PostBox";
import { UserType } from "@/app/generated/prisma";
import { PostData } from "../Post/PostActions";
import { Order, SortBy } from "./Student/Dashboard";

const DashboardPosts = async ({
  posts,
  sortBy,
  order,
  userType = UserType.Student,
}: {
  posts: PostData[];
  sortBy?: SortBy;
  order?: Order;
  userType?: UserType;
}) => {
  return (
    <div className="flex flex-col min-w-0 w-full max-w-2xl gap-3 flex-1 min-h-0">
      {/* Post Header */}
      <div className="flex flex-row justify-between items-center bg-base-100 shadow-br rounded-xl px-4 w-full">
        <p className="text-base-content font-bold text-xl py-2">Newsfeed</p>
        <div className="flex flex-row gap-2 items-center">
          {/* <Sorter sortBy={sortBy} order={order} /> */}
          {userType === UserType.Admin && <AddPostButton />}
        </div>
      </div>

      {/* Post Content */}
      <div className="flex flex-col bg-base-100 shadow-br rounded-xl overflow-y-auto flex-1 min-h-0 w-full">
        {posts.map((post) => (
          <div key={post.id} className="inline w-full">
            <PostBox post={post} />
            {post.id !== posts[posts.length - 1].id && <Divider />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPosts;
