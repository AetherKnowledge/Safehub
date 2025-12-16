import Divider from "@/app/components/Divider";
import AddPostButton from "@/app/components/Post/AddPostButton";
import PostBox from "@/app/components/Post/PostBox";
import { UserType } from "@/app/generated/prisma/browser";
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
    <div className="flex flex-col min-w-0 w-full max-w-2xl gap-4 flex-1 min-h-0">
      {/* Post Header */}
      <div className="flex flex-row justify-between items-center bg-linear-to-r from-primary/10 via-primary/5 to-transparent shadow-md rounded-xl px-6 py-4 w-full border border-base-content/5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-primary rounded-full"></div>
          <p className="text-base-content font-bold text-2xl">Newsfeed</p>
        </div>
        <div className="flex flex-row gap-2 items-center">
          {/* <Sorter sortBy={sortBy} order={order} /> */}
          {userType !== UserType.Student && <AddPostButton />}
        </div>
      </div>

      {/* Post Content */}
      <div className="flex flex-col bg-linear-to-br from-base-100 to-base-200/30 shadow-xl rounded-xl overflow-y-auto flex-1 min-h-0 w-full border border-base-content/5">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={post.id} className="inline w-full">
              <PostBox post={post} />
              {index !== posts.length - 1 && <Divider />}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 text-base-content/50">
            <svg
              className="w-24 h-24 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <p className="text-lg font-semibold mb-2">No posts yet</p>
            <p className="text-sm">Check back later for updates</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPosts;
