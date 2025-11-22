import RatingSummary from "@/app/components/RatingSummary";
import { sortPosts } from "@/lib/utils";
import { Suspense } from "react";
import { getEvaluationTableData } from "../../Appointment/Evaluation/EvaluationActions";
import { ThisWeeksAppointments } from "../../Appointment/Student/AppointmentPage";
import { getPosts } from "../../Post/PostActions";
import MoodTracker from "../Admin/MoodTracker";
import DashboardPosts from "../DashboardPosts";
import { Order, SortBy } from "../Student/Dashboard";

type Props = { searchParams: { sortBy?: SortBy; order?: Order } };

const Dashboard = async ({ searchParams: { sortBy, order } }: Props) => {
  const posts = sortPosts(await getPosts(), sortBy, order);
  const result = await getEvaluationTableData();
  let ratings: number[] = [];

  if (result.success && result.data) {
    ratings = (result.data || [])
      .filter((item) => item.rating != null)
      .map((item) => item.rating as number);
  }

  return (
    <div className="flex items-center justify-center h-full min-h-0">
      <div className="flex flex-1 flex-row gap-3 h-full min-h-0 w-auto justify-center overflow-y-auto pb-1">
        <DashboardPosts posts={posts} sortBy={sortBy} order={order} />

        <div className="flex-col gap-3 hidden 2xl:flex">
          <div className="flex flex-col bg-base-100 shadow-br rounded p-3 gap-1 max-w-3xl w-full flex-1 min-h-0">
            <h2 className="font-bold">Upcoming Appointments</h2>
            <div className="flex flex-row min-w-150 gap-5 w-full flex-1 min-h-0">
              <Suspense>
                <ThisWeeksAppointments />
              </Suspense>
            </div>
          </div>

          <div className="bg-base-100 rounded-lg p-4 w-full flex flex-col h-60 pb-12 2xl:flex-1 shadow-br">
            <h3 className="text-sm font-semibold mb-4">
              Total Mood of all students
            </h3>
            <MoodTracker />
          </div>

          <div className="flex flex-col bg-base-100 shadow-br rounded p-3 gap-1 w-full h-[244px]">
            <h2 className="font-semibold text-2xl">Satisfactory Rating</h2>
            <p className="text-sm mb-2">
              Rating and reviews are verified and are from people who use the
              service. Higher score, higher satisfaction.
            </p>
            <RatingSummary ratings={ratings} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
