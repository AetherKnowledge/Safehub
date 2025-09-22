import Divider from "../../Divider";
import { getPosts, PostProps } from "../../Posts/PostActions";
import EventBox from "../../Posts/PostBox";
import Sorter from "./Sorter";

export enum SortBy {
  Date = "Date",
  Likes = "Likes",
  Comments = "Comments",
}
export enum Order {
  Asc = "Asc",
  Desc = "Desc",
}

type Props = { searchParams: { sortBy?: SortBy; order?: Order } };

const Dashboard = async ({ searchParams: { sortBy, order } }: Props) => {
  const posts = sort(await getPosts(), sortBy, order);

  return (
    <div className="flex flex-col max-w-2xl gap-3">
      <div className="flex flex-row justify-between items-center bg-base-100 shadow-br rounded-xl px-4">
        <p className="text-base-content font-bold">Newsfeed</p>
        <div className="flex flex-row gap-2 bg-base-200 px-2 py-1 rounded my-1 items-center">
          <Sorter sortBy={sortBy} order={order} />
        </div>
      </div>
      <div className="bg-base-100 shadow-br rounded-xl">
        {posts.map((post) => (
          <div key={post.id}>
            <EventBox {...post} />
            {post.id !== posts[posts.length - 1].id && <Divider />}
          </div>
        ))}
      </div>
    </div>
  );
};

function sort(posts: PostProps[], sortBy?: SortBy, order?: Order) {
  if (!posts) return [];
  if (!sortBy || !order) return posts;

  const sortedPosts = [...posts];

  if (sortBy === SortBy.Date) {
    sortedPosts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return order === Order.Asc ? dateA - dateB : dateB - dateA;
    });
  } else if (sortBy === SortBy.Likes) {
    sortedPosts.sort((a, b) => {
      const likesA = a.likesStats.count;
      const likesB = b.likesStats.count;
      return order === Order.Asc ? likesA - likesB : likesB - likesA;
    });
  } else if (sortBy === SortBy.Comments) {
    sortedPosts.sort((a, b) => {
      const commentsA = a.comments.length;
      const commentsB = b.comments.length;
      return order === Order.Asc
        ? commentsA - commentsB
        : commentsB - commentsA;
    });
  }

  return sortedPosts;
}

export default Dashboard;
