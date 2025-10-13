import { getPosts, PostProps } from "@/app/pages/Post/PostActions";
import DashboardPosts from "./DashboardPosts";

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
    <div className="flex flex-col gap-3 flex-1 min-h-0">
      <DashboardPosts posts={posts} sortBy={sortBy} order={order} />
    </div>
  );
};

function sort(posts: PostProps[], sortBy = SortBy.Date, order = Order.Desc) {
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
