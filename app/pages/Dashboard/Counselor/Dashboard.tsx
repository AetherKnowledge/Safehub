import { UserType } from "@/app/generated/prisma/browser";
import { sortPosts } from "@/lib/client-utils";
import { getPosts } from "../../Post/PostActions";
import MoodTracker from "../Admin/MoodTracker";
import AppointmentTimeSeriesChart from "../AppointmentTimeSeriesChart";
import DashboardPosts from "../DashboardPosts";
import { Order, SortBy } from "../Student/Dashboard";
import UpcomingAppointments from "../UpcomingAppointments";

type Props = { searchParams: { sortBy?: SortBy; order?: Order } };

const Dashboard = async ({ searchParams: { sortBy, order } }: Props) => {
  const posts = sortPosts(await getPosts(), sortBy, order);

  return (
    <div className="flex items-center justify-center h-full min-h-0 pb-1 pr-1">
      <div className="flex flex-1 flex-row gap-4 h-full min-h-0 w-auto justify-center">
        <DashboardPosts
          posts={posts}
          sortBy={sortBy}
          order={order}
          userType={UserType.Counselor}
        />

        <div className="flex-col gap-4 hidden 2xl:flex min-w-[420px] overflow-y-auto">
          {/* Upcoming Appointments Card */}
          <UpcomingAppointments />

          {/* Student Mood Tracker Card */}
          <div className="bg-linear-to-br from-base-100 to-base-200/50 rounded-xl p-5 w-full flex flex-col h-[420px] border border-base-content/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <div>
                <h3 className="font-bold text-lg">Student Mood Overview</h3>
                <p className="text-xs text-base-content/60">
                  Track student wellness trends over time
                </p>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <MoodTracker />
            </div>
          </div>

          {/* Appointment Statistics Card */}
          <div className="flex flex-col bg-linear-to-br from-base-100 to-base-200/50 rounded-xl p-5 gap-3 w-full border border-base-content/5 h-[420px]">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <div>
                <h2 className="font-bold text-lg">Appointment Statistics</h2>
                <p className="text-xs text-base-content/60">
                  Track appointment trends by status over time
                </p>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <AppointmentTimeSeriesChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
