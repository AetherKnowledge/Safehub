"use client";

import DefaultLoading from "@/app/components/DefaultLoading";
import { getMoodsThisWeek } from "@/app/components/MoodTracker/MoodTrackerActions";
import { DailyMood, MoodType } from "@/app/generated/prisma";
import { createClient } from "@/lib/supabase/client";
import { Chart } from "chart.js";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

const MoodTracker = () => {
  const moodChartRef = useRef<HTMLCanvasElement>(null);
  const moodChartInstanceRef = useRef<Chart | null>(null);
  const [moodData, setMoodData] = useState<DailyMood[] | undefined>(undefined);
  const session = useSession();

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

  useEffect(() => {
    if (!session.data?.supabaseAccessToken) return;
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

  useEffect(() => {
    // Mood of all students chart
    if (!moodData) {
      // If no mood data is available, we can return early or set a default state
      return;
    }

    const moodCounts: Record<MoodType, number> = Object.values(MoodType)
      .filter((mood) => mood !== MoodType.Skip)
      .reduce(
        (acc, mood) => {
          acc[mood] = 0;
          return acc;
        },
        {} as Record<MoodType, number>
      );

    moodData.forEach((mood) => {
      if (mood.mood in moodCounts) {
        moodCounts[mood.mood as MoodType]++;
      }
    });

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
            labels: Object.values(MoodType).filter(
              (mood) => mood !== MoodType.Skip
            ),
            datasets: [
              {
                data: Object.values(moodCounts),
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
  }, [moodData]);

  return (
    <>
      {moodData ? (
        <canvas ref={moodChartRef} className="w-full"></canvas>
      ) : (
        <DefaultLoading message="Loading mood data..." />
      )}
    </>
  );
};

export default MoodTracker;
