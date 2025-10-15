import { getPosts } from "@/app/pages/Post/PostActions";
import { sortPosts } from "@/lib/utils";
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
  const posts = sortPosts(await getPosts(), sortBy, order);

  return (
    <div className="flex flex-col gap-3 flex-1 min-h-0">
      <DashboardPosts posts={posts} sortBy={sortBy} order={order} />
    </div>
  );
};

export default Dashboard;
