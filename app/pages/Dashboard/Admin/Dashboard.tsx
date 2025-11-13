"use client";

import LineChart from "@/app/components/Charts/LineChart";
import { Chart, registerables } from "chart.js";
import { useEffect, useRef } from "react";

Chart.register(...registerables);

const Dashboard = () => {
  const moodChartRef = useRef<HTMLCanvasElement>(null);
  const moodChartInstanceRef = useRef<Chart | null>(null);

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

  const appointments = [
    {
      date: "May 21, 2024",
      number: "QP10408",
      student: "Loraine Reyes",
      status: "Open",
      counselor: "Ms. Rosuelo",
    },
    {
      date: "May 19, 2024",
      number: "QP01037",
      student: "Isabelle Cruz",
      status: "Pending",
      counselor: "Mr. Rosuelo",
    },
    {
      date: "May 19, 2024",
      number: "QP03573",
      student: "Maria Pearl Jr.",
      status: "Pending",
      counselor: "Mr. Rosuelo",
    },
    {
      date: "May 19, 2024",
      number: "QP04818",
      student: "Prof Bryan Reyes",
      status: "Confirmed",
      counselor: "Mr. Rosuelo",
    },
    {
      date: "May 18, 2024",
      number: "QP04023",
      student: "Emma Longpre",
      status: "Canceled",
      counselor: "Mr. Rosuelo",
    },
  ];

  return (
    <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-auto p-4">
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
      <div className="bg-base-100 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-base-300">
          <h3 className="text-lg font-semibold">Latest Appointments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-neutral">
              <tr>
                <th className="font-semibold">Appointment Date</th>
                <th className="font-semibold">Appointment Number</th>
                <th className="font-semibold">Student</th>
                <th className="font-semibold">Status</th>
                <th className="font-semibold">Assigned Counselor</th>
                <th className="font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={index} className="hover:bg-base-300">
                  <td>{appointment.date}</td>
                  <td>{appointment.number}</td>
                  <td>{appointment.student}</td>
                  <td>
                    <span
                      className={`badge badge-sm ${
                        appointment.status === "Open"
                          ? "badge-success"
                          : appointment.status === "Pending"
                          ? "badge-warning"
                          : appointment.status === "Confirmed"
                          ? "badge-info"
                          : "badge-error"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td>{appointment.counselor}</td>
                  <td>
                    <button className="btn btn-ghost btn-xs">Open</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex justify-between items-center border-t border-base-300 text-sm">
          <span>Showing 5 to 10 of 43 Results</span>
          <div className="flex gap-2">
            <button className="btn btn-ghost btn-xs">1</button>
            <button className="btn btn-ghost btn-xs">2</button>
            <button className="btn btn-ghost btn-xs">3</button>
            <button className="btn btn-ghost btn-xs">4</button>
            <button className="btn btn-ghost btn-xs">10</button>
            <button className="btn btn-ghost btn-xs">25</button>
            <button className="btn btn-ghost btn-xs">50</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
