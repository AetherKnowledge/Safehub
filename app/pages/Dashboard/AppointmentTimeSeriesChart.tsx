"use client";

import DefaultLoading from "@/app/components/DefaultLoading";
import { Chart, registerables } from "chart.js";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import {
  getAppointmentTimeSeries,
  TimeRange,
  TimeSeriesData,
} from "./AppointmentStatsActions";

Chart.register(...registerables);

const DEPARTMENTS = [
  { value: "all", label: "All Departments" },
  { value: "cithm", label: "CITHM" },
  { value: "cbea", label: "CBEA" },
  { value: "camp", label: "CAMP" },
  { value: "case", label: "CASE" },
  { value: "cite", label: "CITE" },
  { value: "com", label: "COM" },
];

const TIME_RANGES = [
  { value: "day" as TimeRange, label: "Last 24 Hours" },
  { value: "week" as TimeRange, label: "Last 7 Days" },
  { value: "month" as TimeRange, label: "Last 30 Days" },
  { value: "alltime" as TimeRange, label: "All Time" },
];

const STATUS_COLORS = {
  Approved: {
    background: "rgba(16, 185, 129, 0.2)",
    border: "rgba(16, 185, 129, 1)",
  },
  Pending: {
    background: "rgba(251, 191, 36, 0.2)",
    border: "rgba(251, 191, 36, 1)",
  },
  Completed: {
    background: "rgba(59, 130, 246, 0.2)",
    border: "rgba(59, 130, 246, 1)",
  },
  Cancelled: {
    background: "rgba(239, 68, 68, 0.2)",
    border: "rgba(239, 68, 68, 1)",
  },
  DidNotAttend: {
    background: "rgba(168, 85, 247, 0.2)",
    border: "rgba(168, 85, 247, 1)",
  },
};

const AppointmentTimeSeriesChart = () => {
  const { data: session } = useSession();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [statsData, setStatsData] = useState<TimeSeriesData | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);

  // Filters
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [department, setDepartment] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"combined" | "separate">("combined");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    "Approved",
    "Pending",
    "Completed",
    "Cancelled",
    "DidNotAttend",
  ]);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const data = await getAppointmentTimeSeries(timeRange, department);
        setStatsData(data);
      } catch (error) {
        console.error("Failed to fetch appointment time series:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [timeRange, department]);

  useEffect(() => {
    if (!statsData || !chartRef.current) {
      return;
    }

    const ctx = chartRef.current.getContext("2d");
    if (ctx) {
      // Destroy existing chart if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const labels = statsData.dataPoints.map((dp) => dp.date);

      let datasets;

      if (viewMode === "combined") {
        // Combined view - single line showing total appointments
        const totalData = statsData.dataPoints.map((dp) => {
          let total = 0;
          if (selectedStatuses.includes("Approved")) total += dp.Approved;
          if (selectedStatuses.includes("Pending")) total += dp.Pending;
          if (selectedStatuses.includes("Completed")) total += dp.Completed;
          if (selectedStatuses.includes("Cancelled")) total += dp.Cancelled;
          if (selectedStatuses.includes("DidNotAttend"))
            total += dp.DidNotAttend;
          return total;
        });

        datasets = [
          {
            label: "Total Appointments",
            data: totalData,
            borderColor: "rgba(139, 92, 246, 1)",
            backgroundColor: "rgba(139, 92, 246, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ];
      } else {
        // Separate view - one line per status
        datasets = Object.keys(STATUS_COLORS)
          .filter((status) => selectedStatuses.includes(status))
          .map((status) => ({
            label: status,
            data: statsData.dataPoints.map(
              (dp) => dp[status as keyof typeof STATUS_COLORS]
            ),
            borderColor:
              STATUS_COLORS[status as keyof typeof STATUS_COLORS].border,
            backgroundColor:
              STATUS_COLORS[status as keyof typeof STATUS_COLORS].background,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 5,
          }));
      }

      // Create new chart and store the instance
      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false,
          },
          plugins: {
            legend: {
              display: viewMode === "separate",
              position: "top",
              labels: {
                color: "#9ca3af",
                font: {
                  size: 11,
                },
                usePointStyle: true,
                padding: 15,
              },
            },
            title: {
              display: false,
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              padding: 12,
              titleColor: "#fff",
              bodyColor: "#fff",
              borderColor: "rgba(255, 255, 255, 0.1)",
              borderWidth: 1,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: "#9ca3af",
                font: {
                  size: 11,
                },
                stepSize: 1,
              },
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
            },
            x: {
              ticks: {
                color: "#9ca3af",
                font: {
                  size: 10,
                },
                maxRotation: 45,
                minRotation: 45,
              },
              grid: {
                display: false,
              },
            },
          },
        },
      });
    }

    // Cleanup function to destroy chart when component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [statsData, viewMode, selectedStatuses]);

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3 items-center">
          {/* Time Range Select */}
          <select
            className="select select-sm select-bordered bg-base-100/50 text-xs"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          >
            {TIME_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          {/* Department Select */}
          <select
            className="select select-sm select-bordered bg-base-100/50 text-xs"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept.value} value={dept.value}>
                {dept.label}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2 bg-base-100/50 rounded-lg p-1">
          <button
            className={`btn btn-xs ${
              viewMode === "combined" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setViewMode("combined")}
          >
            Combined
          </button>
          <button
            className={`btn btn-xs ${
              viewMode === "separate" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setViewMode("separate")}
          >
            Per Status
          </button>
        </div>
      </div>

      {/* Status Filter Checkboxes */}
      <div className="flex flex-wrap gap-3">
        {Object.keys(STATUS_COLORS).map((status) => (
          <label
            key={status}
            className="flex items-center gap-2 cursor-pointer text-xs"
          >
            <input
              type="checkbox"
              className="checkbox checkbox-xs"
              checked={selectedStatuses.includes(status)}
              onChange={() => toggleStatus(status)}
              style={{
                borderColor:
                  STATUS_COLORS[status as keyof typeof STATUS_COLORS].border,
                backgroundColor: selectedStatuses.includes(status)
                  ? STATUS_COLORS[status as keyof typeof STATUS_COLORS]
                      .background
                  : "transparent",
              }}
            />
            <span
              className="font-medium"
              style={{
                color:
                  STATUS_COLORS[status as keyof typeof STATUS_COLORS].border,
              }}
            >
              {status === "DidNotAttend" ? "Did Not Attend" : status}
            </span>
          </label>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center">
        {loading ? (
          <DefaultLoading message="Loading appointment data..." />
        ) : statsData ? (
          <canvas ref={chartRef} className="w-full"></canvas>
        ) : (
          <DefaultLoading message="Loading appointment data..." />
        )}
      </div>
    </div>
  );
};

export default AppointmentTimeSeriesChart;
