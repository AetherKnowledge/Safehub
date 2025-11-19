"use client";

import LineChart from "@/app/components/Charts/LineChart";
import { Chart, registerables } from "chart.js";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LogsTable from "../../Appointment/LogsTable";
import { getLogs } from "../../Appointment/LogsTable/LogActions";
import { AppointmentLogsResult } from "../../Appointment/LogsTable/schema";
import { AppointmentLogSortBy } from "../../Appointment/LogsTable/sort";
import { Order } from "../Student/Dashboard";

Chart.register(...registerables);

const Dashboard = () => {
  const moodChartRef = useRef<HTMLCanvasElement>(null);
  const moodChartInstanceRef = useRef<Chart | null>(null);
  const searchParams = useSearchParams();
  const [logsLoading, setLogsLoading] = useState(true);
  const [logs, setLogs] = useState<AppointmentLogsResult>({
    logs: [],
    totalCount: 0,
  });

  useEffect(() => {
    async function fetchLogs() {
      setLogsLoading(true);

      const perPageNum = parseInt(searchParams.get("perPage") || "5");
      const pageNum = parseInt(searchParams.get("page") || "1");
      const sortBy =
        searchParams.get("sortBy") || AppointmentLogSortBy.AppointmentDate;
      const order = searchParams.get("order") || Order.Desc;

      const perPage =
        !Number.isNaN(perPageNum) && perPageNum > 0 ? perPageNum : 5;
      const page = !Number.isNaN(pageNum) && pageNum > 0 ? pageNum : 1;

      const result = await getLogs({
        perPage,
        page,
        sortBy: sortBy as AppointmentLogSortBy,
        order: order as Order,
      });
      if (result.success && result.data) {
        setLogs(result.data);
      }
    }
    fetchLogs().finally(() => setLogsLoading(false));
  }, [searchParams]);

  useEffect(() => {
    // Mood of all students chart
    if (moodChartRef.current) {
      const ctx = moodChartRef.current.getContext("2d");
      if (ctx) {
        // Destroy existing chart if it exists
        if (moodChartInstanceRef.current) {
          moodChartInstanceRef.current.destroy();
        }

        // Create new chart and store the instance
        moodChartInstanceRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Angry", "Sad", "Neutral", "Happy", "Lovely"],
            datasets: [
              {
                data: [40, 100, 60, 30, 10],
                backgroundColor: [
                  "#fb923c",
                  "#60a5fa",
                  "#4ade80",
                  "#fbbf24",
                  "#f472b6",
                ],
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(255, 255, 255, 0.1)",
                },
                ticks: {
                  color: "#9ca3af",
                },
              },
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: "#9ca3af",
                },
              },
            },
          },
        });
      }
    }

    // Cleanup function to destroy chart when component unmounts
    return () => {
      if (moodChartInstanceRef.current) {
        moodChartInstanceRef.current.destroy();
        moodChartInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-auto">
      {/* Top Grid - Charts */}
      <div className="grid grid-cols-2 gap-4">
        {/* Mood Chart */}
        <div className="bg-base-100 rounded-lg p-4 w-full flex flex-col">
          <h3 className="text-sm font-semibold mb-4">
            Total Mood of all students
          </h3>
          <div className="flex-1">
            <canvas ref={moodChartRef} className="w-full h-full"></canvas>
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
      <LogsTable
        logs={logs.logs || []}
        totalCount={logs.totalCount || 0}
        isLoading={logsLoading}
      />
    </div>
  );
};

export default Dashboard;
