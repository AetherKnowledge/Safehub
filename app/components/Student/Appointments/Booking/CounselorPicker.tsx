"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
import { IoMdInformationCircleOutline } from "react-icons/io";

export interface CounselorData {
  id: string;
  name: string;
  image: string;
  email: string;
  Counselor: {
    AvailableSlots: {
      day: string;
      startTime: string;
      endTime: string;
    }[];
  };
}

interface Props {
  onChange?: (value: CounselorData) => void;
}

const CounselorPicker = ({ onChange }: Props) => {
  const [counselors, setCounselors] = useState<CounselorData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    refreshTable();
  }, []);

  const refreshTable = async () => {
    const res = await fetch("/api/user/student/counselors");
    const data = await res.json();

    if (!res.ok) {
      console.error("Failed to fetch appointments:", data);
      setLoading(false);
      return;
    }

    setCounselors(data);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-5 pr-5 pl-5 h-full">
      <div className="text-base-content text-2xl font-semibold">
        Pick a Counselor
      </div>
      <div className="h-full">
        <div className="flex flex-col items-center justify-center h-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="loading loading-spinner loading-lg text-primary"></div>
              <p className="text-base-content">Loading...</p>
            </div>
          ) : counselors.length < 1 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <p className="text-base-content/50">No counselors available</p>
            </div>
          ) : (
            <div className="overflow-y-scroll h-[63vh] w-full pr-5 pl-5 space-y-4">
              {counselors.map((counselor) => (
                <CounselorBubble
                  key={counselor.email}
                  CounselorData={counselor}
                  onChange={onChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface CounselorBubbleProps {
  CounselorData: CounselorData;
  onChange?: (value: CounselorData) => void;
}

const CounselorBubble = ({ CounselorData, onChange }: CounselorBubbleProps) => {
  return (
    <div className="flex items-center justify-between border border-base-300 rounded-lg px-4 py-3 shadow-sm w-full">
      {/* Profile and Name */}
      <div className="flex items-center gap-4">
        <Image
          src={CounselorData.image}
          alt={CounselorData.name}
          className="w-12 h-12 rounded-full"
          width={48}
          height={48}
        />
        <div className="flex flex-col">
          <span className="text-xs text-base-content font-semibold">Name:</span>
          <span className="text-base text-base-content">
            {CounselorData.name}
          </span>
        </div>
      </div>

      {/* Day */}
      <div className="flex flex-row gap-10 items-center">
        <div className="flex flex-col items-center">
          <span className="text-xs text-base-content font-semibold">Day</span>
          <span className="text-base text-base-content">Mon - Fri</span>
        </div>

        {/* Time */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-base-content font-semibold">Time</span>
          <span className="text-base text-base-content">8 A.M. - 5 P.M.</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        <button className="btn btn-circle btn-sm btn-ghost text-base-content">
          <IoMdInformationCircleOutline className="text-lg text-base-content" />
        </button>
        <button
          className="btn btn-outline btn-sm rounded-md px-4 text-base-content"
          onClick={() => onChange?.(CounselorData)}
        >
          Pick
        </button>
      </div>
    </div>
  );
};

export default CounselorPicker;
