"use client";

import DefaultLoading from "@/app/components/DefaultLoading";
import {
  getMoodsThisWeek,
  getMoodTimeSeries,
  MoodTimeSeriesData,
  TimeRange,
} from "@/app/components/MoodTracker/MoodTrackerActions";
import { DailyMood, UserType } from "@/app/generated/prisma";
import { createClient } from "@/lib/supabase/client";
import { Chart } from "chart.js";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

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

const MOOD_COLORS = {
  Angry: {
    background: "rgba(251, 146, 60, 0.2)",
    border: "rgba(251, 146, 60, 1)",
  },
  Sad: {
    background: "rgba(96, 165, 250, 0.2)",
    border: "rgba(96, 165, 250, 1)",
  },
  Disgust: {
    background: "rgba(74, 222, 128, 0.2)",
    border: "rgba(74, 222, 128, 1)",
  },
  Joy: {
    background: "rgba(251, 191, 36, 0.2)",
    border: "rgba(251, 191, 36, 1)",
  },
  Fear: {
    background: "rgba(244, 114, 182, 0.2)",
    border: "rgba(244, 114, 182, 1)",
  },
};

const MoodTracker = () => {
  const session = useSession();
  const moodChartRef = useRef<HTMLCanvasElement>(null);
  const moodChartInstanceRef = useRef<Chart | null>(null);
  const [moodData, setMoodData] = useState<DailyMood[] | undefined>(undefined);
  const [timeSeriesData, setTimeSeriesData] = useState<
    MoodTimeSeriesData | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);

  // Filters
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [department, setDepartment] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"combined" | "separate">("combined");
  const [selectedMoods, setSelectedMoods] = useState<string[]>([
    "Angry",
    "Sad",
    "Disgust",
    "Joy",
    "Fear",
  ]);

  // Fetch initial mood data for real-time updates
  useEffect(() => {
    async function fetchMoodData() {
      const moodResult = await getMoodsThisWeek();
      if (!moodResult.success) {
        console.error("Failed to fetch mood data:", moodResult.message);
        return;
      }
      setMoodData(moodResult.data);
    }

    fetchMoodData();
  }, []);

  // Fetch time series data based on filters
  useEffect(() => {
    async function fetchTimeSeriesData() {
      setLoading(true);
      try {
        const data = await getMoodTimeSeries(timeRange, department);
        setTimeSeriesData(data);
      } catch (error) {
        console.error("Failed to fetch mood time series:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTimeSeriesData();
  }, [timeRange, department]);

  // Real-time updates via Supabase
  useEffect(() => {
    if (!session.data?.supabaseAccessToken || session.data?.user.deactivated)
      return;
    const supabase = createClient(session.data?.supabaseAccessToken);

    const testChannel = supabase
      .channel("daily-mood-events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "DailyMood" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMoodData((prevMoodData) => {
              if (!prevMoodData) return prevMoodData;
              return [...prevMoodData, payload.new as DailyMood];
            });
          } else if (payload.eventType === "UPDATE") {
            setMoodData((prevMoodData) => {
              if (!prevMoodData) return prevMoodData;
              return prevMoodData.map((mood) =>
                mood.id === (payload.new as DailyMood).id
                  ? (payload.new as DailyMood)
                  : mood
              );
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(testChannel);
    };
  }, [session.data?.supabaseAccessToken]);

  // Render chart
  useEffect(() => {
    if (!timeSeriesData || !moodChartRef.current) {
      return;
    }

    const ctx = moodChartRef.current.getContext("2d");
    if (ctx) {
      // Destroy existing chart if it exists
      if (moodChartInstanceRef.current) {
        moodChartInstanceRef.current.destroy();
      }

      const labels = timeSeriesData.dataPoints.map((dp) => dp.date);

      let datasets;

      if (viewMode === "combined") {
        // Combined view - single line showing total moods
        const totalData = timeSeriesData.dataPoints.map((dp) => {
          let total = 0;
          if (selectedMoods.includes("Angry")) total += dp.Angry;
          if (selectedMoods.includes("Sad")) total += dp.Sad;
          if (selectedMoods.includes("Disgust")) total += dp.Disgust;
          if (selectedMoods.includes("Joy")) total += dp.Joy;
          if (selectedMoods.includes("Fear")) total += dp.Fear;
          return total;
        });

        datasets = [
          {
            label: "Total Moods",
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
        // Separate view - one line per mood
        datasets = Object.keys(MOOD_COLORS)
          .filter((mood) => selectedMoods.includes(mood))
          .map((mood) => ({
            label: mood,
            data: timeSeriesData.dataPoints.map(
              (dp) => dp[mood as keyof typeof MOOD_COLORS]
            ),
            borderColor: MOOD_COLORS[mood as keyof typeof MOOD_COLORS].border,
            backgroundColor:
              MOOD_COLORS[mood as keyof typeof MOOD_COLORS].background,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 5,
          }));
      }

      // Create new chart and store the instance
      moodChartInstanceRef.current = new Chart(ctx, {
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
      if (moodChartInstanceRef.current) {
        moodChartInstanceRef.current.destroy();
        moodChartInstanceRef.current = null;
      }
    };
  }, [timeSeriesData, viewMode, selectedMoods]);

  const toggleMood = (mood: string) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  const isAdmin = session.data?.user?.type === UserType.Admin;

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

          {/* Department Select (Admin only) */}
          {isAdmin && (
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
          )}
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
            Per Mood
          </button>
        </div>
      </div>

      {/* Mood Filter Checkboxes */}
      <div className="flex flex-wrap gap-3">
        {Object.keys(MOOD_COLORS).map((mood) => (
          <label
            key={mood}
            className="flex items-center gap-2 cursor-pointer text-xs"
          >
            <input
              type="checkbox"
              className="checkbox checkbox-xs"
              checked={selectedMoods.includes(mood)}
              onChange={() => toggleMood(mood)}
              style={{
                borderColor:
                  MOOD_COLORS[mood as keyof typeof MOOD_COLORS].border,
                backgroundColor: selectedMoods.includes(mood)
                  ? MOOD_COLORS[mood as keyof typeof MOOD_COLORS].background
                  : "transparent",
              }}
            />
            <span
              className="font-medium"
              style={{
                color: MOOD_COLORS[mood as keyof typeof MOOD_COLORS].border,
              }}
            >
              {mood}
            </span>
          </label>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center">
        {loading ? (
          <DefaultLoading message="Loading mood data..." />
        ) : timeSeriesData ? (
          <canvas ref={moodChartRef} className="w-full"></canvas>
        ) : (
          <DefaultLoading message="Loading mood data..." />
        )}
      </div>
    </div>
  );
};

export default MoodTracker;
