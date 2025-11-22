import MoodTrackerBox from "@/app/components/MoodTracker/MoodTrackerBox";
import { getPosts } from "@/app/pages/Post/PostActions";
import { sortPosts } from "@/lib/utils";
import { Suspense } from "react";
import { ThisWeeksAppointments } from "../../Appointment/Student/AppointmentPage";
import DashboardPosts from "../DashboardPosts";

export enum SortBy {
  Date = "Date",
  Likes = "Likes",
  Comments = "Comments",
}
export enum Order {
  Asc = "asc",
  Desc = "desc",
}

type Props = { searchParams: { sortBy?: SortBy; order?: Order } };

const Dashboard = async ({ searchParams: { sortBy, order } }: Props) => {
  const posts = sortPosts(await getPosts(), sortBy, order);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-1 flex-row gap-3 h-full min-h-0 w-auto justify-center">
        <DashboardPosts posts={posts} sortBy={sortBy} order={order} />

        <div className="flex-col gap-3 hidden 2xl:flex">
          <div className="flex flex-col bg-base-100 shadow-br rounded p-3 gap-1 max-w-3xl w-full">
            <h2 className="font-bold">Upcoming Appointments</h2>
            <div className="flex flex-row min-w-150 gap-5 w-full">
              <Suspense>
                <ThisWeeksAppointments />
              </Suspense>
            </div>
          </div>
          <MoodTrackerBox className="text-left max-w-3xl w-full" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
