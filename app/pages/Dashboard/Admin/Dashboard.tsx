"use client";

import { Chart, registerables } from "chart.js";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LogsTable from "../../Appointment/LogsTable";
import { getLogs } from "../../Appointment/LogsTable/LogActions";
import { ParsedAppointmentLog } from "../../Appointment/LogsTable/schema";
import { AppointmentLogSortBy } from "../../Appointment/LogsTable/sort";
import AppointmentTimeSeriesChart from "../AppointmentTimeSeriesChart";
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

  const [activeTab, setActiveTab] = useState<"mood" | "appointments">("mood");

  return (
    <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-auto">
      {/* Main Content - Desktop: Side by Side, Mobile: Stacked */}
      <div className="flex flex-col xl:flex-row gap-4 flex-1 min-h-0">
        {/* Left Side - Charts (50% on desktop) */}
        <div className="flex flex-col gap-4 xl:w-1/2 min-h-0">
          {/* Mobile Tabs */}
          <div className="flex xl:hidden gap-2 bg-base-100/50 rounded-lg p-1">
            <button
              className={`btn btn-sm flex-1 ${
                activeTab === "mood" ? "btn-primary" : "btn-ghost"
              }`}
              onClick={() => setActiveTab("mood")}
            >
              Mood Analytics
            </button>
            <button
              className={`btn btn-sm flex-1 ${
                activeTab === "appointments" ? "btn-primary" : "btn-ghost"
              }`}
              onClick={() => setActiveTab("appointments")}
            >
              Appointments
            </button>
          </div>

          {/* Mood Chart - Always visible on desktop, tab on mobile */}
          <div
            className={`bg-gradient-to-br from-base-100 to-base-200/50 rounded-xl p-6 w-full flex flex-col shadow-xl border border-base-content/5 flex-1 min-h-0 ${
              activeTab === "mood" ? "flex" : "hidden xl:flex"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <div>
                <h3 className="font-bold text-lg">Student Mood Analytics</h3>
                <p className="text-xs text-base-content/60">
                  Track student wellness trends over time
                </p>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <MoodTracker />
            </div>
          </div>

          {/* Appointment Statistics Card - Always visible on desktop, tab on mobile */}
          <div
            className={`bg-gradient-to-br from-base-100 to-base-200/50 rounded-xl p-6 shadow-xl border border-base-content/5 flex flex-col flex-1 min-h-0 ${
              activeTab === "appointments" ? "flex" : "hidden xl:flex"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <div>
                <h3 className="font-bold text-lg">Appointment Statistics</h3>
                <p className="text-xs text-base-content/60">
                  System-wide appointment trends with department filtering
                </p>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <AppointmentTimeSeriesChart />
            </div>
          </div>
        </div>

        {/* Right Side - Logs Table (50% on desktop) */}
        <div className="bg-gradient-to-br from-base-100 to-base-200/50 rounded-xl shadow-xl border border-base-content/5 overflow-hidden flex flex-col xl:w-1/2 min-h-0 flex-1">
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
    </div>
  );
};

export default Dashboard;
