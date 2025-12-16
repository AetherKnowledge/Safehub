"use client";

import { MoodType } from "@/app/generated/prisma/browser";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  getCurrentUserMoodThisWeek,
  MoodWithDate,
  upsertMood,
} from "./MoodTrackerActions";

const MoodTrackerBox = ({
  onClose,
  canSkip = false,
  className = "",
  defaultWeekly = false,
}: {
  onClose?: () => void;
  canSkip?: boolean;
  className?: string;
  defaultWeekly?: boolean;
}) => {
  const [showWeekly, setShowWeekly] = useState(defaultWeekly);
  const [weeklyMoods, setWeeklyMoods] = useState<MoodWithDate[]>([]);
  const session = useSession();

  function setCurrentMood(mood: MoodType) {
    setWeeklyMoods((prevMoods) => {
      const today = new Date();
      const updatedMoods = [...prevMoods];
      const existingIndex = updatedMoods.findIndex((moodWithDate) => {
        const moodDate = new Date(moodWithDate.date);
        return (
          moodDate.getFullYear() === today.getFullYear() &&
          moodDate.getMonth() === today.getMonth() &&
          moodDate.getDate() === today.getDate()
        );
      });

      if (existingIndex !== -1) {
        // Update existing mood for today
        updatedMoods[existingIndex].mood = mood;
      } else {
        // Add new mood for today
        updatedMoods.push({ date: today, mood });
      }

      return updatedMoods;
    });
  }

  async function handleMoodClick(mood: MoodType) {
    await upsertMood(mood);
    setCurrentMood(mood);

    await session.update();
    onClose?.();
  }

  useEffect(() => {
    if (session.data?.user.moodToday) {
      setCurrentMood(session.data.user.moodToday);
    }
  }, [session.data?.user.moodToday]);

  useEffect(() => {
    async function fetchWeeklyMoods() {
      const result = await getCurrentUserMoodThisWeek();
      if (result.success && result.data) {
        setWeeklyMoods(result.data);
      }
    }

    fetchWeeklyMoods();
  }, []);

  return (
    <div
      className={`${className} bg-base-100 p-2 rounded-lg text-center text-base-content`}
    >
      <h2 className="font-semibold text-lg text-base-content px-2">
        Mood Tracking
      </h2>
      <p className="mb-6 text-base-content px-2">
        {showWeekly ? "Your moods for the week" : "What are you feeling today?"}
      </p>
      <div className="flex justify-center gap-2 mb-4">
        {showWeekly ? (
          [0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
            <WeeklyMoodRow
              key={dayIndex}
              dayIndex={dayIndex}
              mood={
                weeklyMoods.find((moodWithDate) => {
                  if (!moodWithDate?.date) return false;
                  const moodDate = new Date(moodWithDate.date);
                  return moodDate.getDay() === dayIndex;
                })?.mood
              }
            />
          ))
        ) : (
          <>
            {Object.values(MoodType).map((mood) => {
              if (mood === MoodType.Skip) return null; // Skip the "Skip" mood

              return (
                <button
                  key={mood}
                  className="flex flex-col items-center p-3 rounded-lg cursor-pointer shadow-br text-center w-17 h-20
                         transition-transform transform 
                         hover:scale-110 hover:bg-base-200
                         active:scale-95 active:bg-base-300"
                  onClick={() => handleMoodClick(mood)}
                >
                  <span className="text-3xl">{moodToEmoji(mood)}</span>
                  <span className="mt-1 text-base-content">{mood}</span>
                </button>
              );
            })}
          </>
        )}
      </div>
      <div className="flex flex-row justify-between items-center mb-2">
        <div className="w-20"></div>
        <button
          className="text-primary text-sm hover:underline cursor-pointer"
          onClick={() => setShowWeekly(!showWeekly)}
        >
          see your moods for the week &rarr;
        </button>
        {canSkip ? (
          <button
            className="btn btn-ghost w-20"
            onClick={() => handleMoodClick(MoodType.Skip)}
          >
            Skip
          </button>
        ) : (
          <div className="w-20"></div>
        )}
      </div>
    </div>
  );
};

export function WeeklyMoodRow({
  dayIndex,
  mood,
}: {
  dayIndex: number;
  mood?: MoodType;
}) {
  return (
    <div className="flex flex-col items-center">
      <span className="mb-1 text-sm text-base-content">
        {getDayLabel(dayIndex)}
      </span>
      <button className="flex flex-col items-center p-3 rounded-lg shadow-br w-18 h-20">
        <span className="text-3xl">{moodToEmoji(mood)}</span>
        <span className="mt-1 text-base-content">{mood}</span>
      </button>
    </div>
  );
}

export function getDayLabel(dayIndex: number): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[dayIndex] || "";
}

export function moodToEmoji(mood?: MoodType): React.ReactNode {
  switch (mood) {
    case MoodType.Angry:
      return "😠";
    case MoodType.Sad:
      return "😟";
    case MoodType.Disgust:
      return "😒";
    case MoodType.Joy:
      return "😄";
    case MoodType.Fear:
      return "😨";
    default:
      return null;
  }
}

export default MoodTrackerBox;
