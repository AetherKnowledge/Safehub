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
    <div className="flex items-center justify-center h-full min-h-0 overflow-y-auto pb-1 pr-1">
      <div className="flex flex-1 flex-row gap-4 h-full min-h-0 w-auto justify-center">
        <DashboardPosts posts={posts} sortBy={sortBy} order={order} />

        <div className="flex-col gap-4 hidden 2xl:flex min-w-[420px]">
          {/* Upcoming Appointments Card */}
          <div className="flex flex-col bg-gradient-to-br from-base-100 to-base-200/50 shadow-xl rounded-xl p-5 gap-3 w-full flex-1 min-h-30 border border-base-content/5">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <h2 className="font-bold text-lg">Upcoming Appointments</h2>
            </div>
            <div className="flex flex-row min-w-150 gap-5 w-full flex-1 min-h-20">
              <Suspense>
                <ThisWeeksAppointments />
              </Suspense>
            </div>
          </div>

          {/* Student Mood Tracker Card */}
          <div className="bg-gradient-to-br from-base-100 to-base-200/50 rounded-xl p-5 w-full flex flex-col h-60 pb-21 2xl:flex-1 shadow-xl border border-base-content/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <h3 className="font-bold text-lg">Student Mood Overview</h3>
            </div>
            <p className="text-sm text-base-content/70 mb-4">
              Aggregate mood data from all students
            </p>
            <MoodTracker />
          </div>

          {/* Satisfactory Rating Card */}
          <div className="flex flex-col bg-gradient-to-br from-base-100 to-base-200/50 shadow-xl rounded-xl p-5 gap-3 w-full border border-base-content/5">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <div>
                <h2 className="font-bold text-lg">Satisfactory Rating</h2>
                <p className="text-xs text-base-content/60">
                  Verified ratings from service users
                </p>
              </div>
            </div>
            <p className="text-sm text-base-content/70 mb-2">
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
