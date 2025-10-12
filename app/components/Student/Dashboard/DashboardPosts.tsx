import Divider from "../../Divider";
import { PostProps } from "../../Posts/PostActions";
import EventBox from "../../Posts/PostBox";
import { Order, SortBy } from "./Dashboard";
import Sorter from "./Sorter";

const DashboardPosts = ({
  posts,
  sortBy,
  order,
}: {
  posts: PostProps[];
  sortBy?: SortBy;
  order?: Order;
}) => {
  return (
    <div className="flex flex-col min-w-0 w-full max-w-2xl gap-3 flex-1 min-h-0">
      {/* Post Header */}
      <div className="flex flex-row justify-between items-center bg-base-100 shadow-br rounded-xl px-4 w-full">
        <p className="text-base-content font-bold">Newsfeed</p>
        <div className="flex flex-row gap-2 bg-base-200 px-2 py-1 rounded my-1 items-center">
          <Sorter sortBy={sortBy} order={order} />
        </div>
      </div>

      {/* Post Content */}
      <div className="flex flex-col bg-base-100 shadow-br rounded-xl overflow-y-auto flex-1 min-h-0 w-full">
        {posts.map((post) => (
          <div key={post.id} className="inline w-full">
            <EventBox {...post} />
            {post.id !== posts[posts.length - 1].id && <Divider />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPosts;
