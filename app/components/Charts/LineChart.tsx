"use client";
import { Chart } from "chart.js";
import { useEffect, useRef } from "react";

const LineChart = ({ data, total }: { data: number[]; total: number }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // borderColor: "#ef4444",
  // backgroundColor: "rgba(239, 68, 68, 0.2)",

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        // Destroy existing chart if it exists
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        // Create new chart and store the instance
        chartInstanceRef.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: Array.from({ length: 7 }, (_, i) => i + 1),
            datasets: [
              {
                data,
                borderColor: "#4ade80",
                backgroundColor: "rgba(74, 222, 128, 0.1)",
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              intersect: false,
              mode: "index",
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: true,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                titleColor: "#fff",
                bodyColor: "#fff",
                yAlign: "top",
                borderColor: "#4ade80",
                displayColors: false,
                callbacks: {
                  title: function (context) {
                    return `Day ${context[0].label}`;
                  },
                  label: function (context) {
                    return `Students: ${context.parsed.y}`;
                  },
                },
              },
            },
            scales: {
              y: {
                display: false,
                beginAtZero: true,
              },
              x: {
                display: false,
              },
            },
            elements: {
              line: {
                borderWidth: 2,
              },
            },
          },
        });
      }
    }

    // Cleanup function to destroy chart when component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data]);

  return (
    <div className="bg-base-100 rounded-lg p-0 pt-6 gap-0">
      <div className="px-6">
        <h3 className="text-sm text-gray-400 mb-1">Active Students</h3>
        <div className="text-3xl font-bold mb-2">
          {data.length > 0 ? data[data.length - 1] : 0}
        </div>
        <div className="text-sm text-green-500 mb-3 flex items-center gap-1">
          <span>
            {data.length > 0 ? data[data.length - 1] : 0} out of {total}
          </span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
      </div>
      <div className="h-20 rounded-b-lg overflow-visible">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default LineChart;
