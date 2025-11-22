"use client";

import LineChart from "@/app/components/Charts/LineChart";
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
    <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-auto">
      {/* Top Grid - Charts */}
      <div className="grid grid-cols-2 gap-4">
        {/* Mood Chart */}
        <div className="bg-base-100 rounded-lg p-4 w-full flex flex-col shadow-br">
          <h3 className="text-sm font-semibold mb-4">
            Total Mood of all students
          </h3>
          <div className="flex-1">
            <MoodTracker />
          </div>
        </div>
        {/* Active Students */}
        <div className="flex flex-col gap-4">
          <LineChart
            data={Array.from({ length: 30 }, () =>
              Math.floor(Math.random() * 3 + 30)
            )}
            total={192}
          />
          {/* Rate of Booking */}
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
        </div>
      </div>

      {/* Latest Appointments Table */}
      <LogsTable logs={logs} isLoading={logsLoading} />
    </div>
  );
};

export default Dashboard;
