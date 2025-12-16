import MoodTrackerBox from "@/app/components/MoodTracker/MoodTrackerBox";
import { getPosts } from "@/app/pages/Post/PostActions";
import { sortPosts } from "@/lib/client-utils";
import { ThisWeeksAppointments } from "../../Appointment/Student/AppointmentPage";
import DashboardPosts from "../DashboardPosts";
import HotlineBar from "./HotlineBar";

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
    <div className="flex items-center justify-center h-full min-h-0 pb-1 pr-1">
      <div className="flex flex-1 flex-row gap-4 h-full min-h-0 w-auto justify-center">
        <DashboardPosts posts={posts} sortBy={sortBy} order={order} />

        <div className="flex-col gap-4 hidden 2xl:flex min-w-[420px]">
          {/* Upcoming Appointments Card */}
          <div className="flex flex-col bg-linear-to-br from-base-100 to-base-200/50 shadow-xl rounded-xl p-5 gap-3 w-full flex-1 min-h-30 border border-base-content/5">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <h2 className="font-bold text-lg">Upcoming Appointments</h2>
            </div>
            <div className="flex flex-row min-w-150 gap-5 w-full flex-1 min-h-20">
              <ThisWeeksAppointments />
            </div>
          </div>

          {/* Mood Tracker Card */}
          <MoodTrackerBox
            className="text-left w-full bg-linear-to-br from-base-100 to-base-200/50 shadow-xl border border-base-content/5"
            defaultWeekly
          />

          {/* Hotline Card */}
          <HotlineBar />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
