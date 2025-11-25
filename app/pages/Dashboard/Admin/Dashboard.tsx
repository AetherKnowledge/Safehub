"use client";

import { Chart, registerables } from "chart.js";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LogsTable from "../../Appointment/LogsTable";
import { getLogs } from "../../Appointment/LogsTable/LogActions";
import { ParsedAppointmentLog } from "../../Appointment/LogsTable/schema";
import { AppointmentLogSortBy } from "../../Appointment/LogsTable/sort";
import { Order } from "../Student/Dashboard";
import MoodTracker from "./MoodTracker";

Chart.register(...registerables);

const Dashboard = () => {
  const searchParams = useSearchParams();
  const [logsLoading, setLogsLoading] = useState(true);
  const [logs, setLogs] = useState<ParsedAppointmentLog[]>([]);

  useEffect(() => {
    async function fetchLogs() {
      setLogsLoading(true);

      const sortBy =
        searchParams.get("sortBy") || AppointmentLogSortBy.AppointmentDate;
      const order = searchParams.get("order") || Order.Desc;

      const result = await getLogs({
        sortBy: sortBy as AppointmentLogSortBy,
        order: order as Order,
      });
      if (result.success && result.data) {
        setLogs(result.data);
      }
    }

    fetchLogs().finally(() => setLogsLoading(false));
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-xl shadow-md border border-base-content/5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-primary rounded-full"></div>
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-base-content/70">
              Monitor system overview and student wellness metrics
            </p>
          </div>
        </div>
      </div>

      {/* Top Grid - Charts */}
      <div className="grid grid-cols-1 gap-4 min-h-0">
        {/* Mood Chart */}
        <div className="bg-gradient-to-br from-base-100 to-base-200/50 rounded-xl p-6 w-full flex h-100 flex-col shadow-xl pb-20 border border-base-content/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            <div>
              <h3 className="font-bold text-lg">Student Mood Analytics</h3>
              <p className="text-xs text-base-content/60">
                Aggregate wellness data across all students
              </p>
            </div>
          </div>
          <MoodTracker />
        </div>
        {/* <div className="flex flex-col gap-4">
          <LineChart
            data={Array.from({ length: 30 }, () =>
              Math.floor(Math.random() * 3 + 30)
            )}
            total={192}
          />
          <LineChart
            data={Array.from({ length: 30 }, () =>
              Math.floor(Math.random() * 10 + 60)
            )}
            total={192}
          />
          <LineChart
            data={Array.from({ length: 30 }, () =>
              Math.floor(Math.random() * 3 + 10)
            )}
            total={192}
          />
        </div> */}
      </div>

      {/* Latest Appointments Table */}
      <div className="bg-gradient-to-br from-base-100 to-base-200/50 rounded-xl shadow-xl border border-base-content/5 overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="p-5 border-b border-base-content/5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            <div>
              <h2 className="font-bold text-xl">Appointment Logs</h2>
              <p className="text-sm text-base-content/60">
                Recent appointment status changes and history
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <LogsTable logs={logs} isLoading={logsLoading} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
