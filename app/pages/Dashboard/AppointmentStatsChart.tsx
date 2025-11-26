"use client";

import DefaultLoading from "@/app/components/DefaultLoading";
import { Chart } from "chart.js";
import { useEffect, useRef, useState } from "react";
import {
  AppointmentStatsData,
  getAppointmentStats,
} from "./AppointmentStatsActions";

const AppointmentStatsChart = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [statsData, setStatsData] = useState<AppointmentStatsData | undefined>(
    undefined
  );

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getAppointmentStats();
        setStatsData(data);
      } catch (error) {
        console.error("Failed to fetch appointment stats:", error);
      }
    }

    fetchStats();
  }, []);

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

      // Create new chart and store the instance
      chartInstanceRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["This Week", "This Month", "All Time"],
          datasets: [
            {
              label: "Appointments",
              data: [statsData.week, statsData.month, statsData.allTime],
              backgroundColor: [
                "rgba(59, 130, 246, 0.8)", // blue
                "rgba(16, 185, 129, 0.8)", // green
                "rgba(139, 92, 246, 0.8)", // purple
              ],
              borderColor: [
                "rgba(59, 130, 246, 1)",
                "rgba(16, 185, 129, 1)",
                "rgba(139, 92, 246, 1)",
              ],
              borderWidth: 2,
              borderRadius: 8,
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
                  size: 12,
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
                  size: 12,
                },
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
  }, [statsData]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      {statsData ? (
        <canvas ref={chartRef} className="w-full"></canvas>
      ) : (
        <DefaultLoading message="Loading appointment statistics..." />
      )}
    </div>
  );
};

export default AppointmentStatsChart;
