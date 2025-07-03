"use client";
import React from "react";
import AppointmentRow from "./ApointmentRow";
import { useEffect, useState } from "react";
import { Appointment, AppointmentStatus } from "@/app/generated/prisma";
import { ReactNode } from "react";
import AuthProvider from "../AuthProvider";

export interface AppointmentData {
  id: string;
  studentId: string;
  counselorId: string;
  schedule: Date;
  status: AppointmentStatus;
  student: {
    id: string;
    name: string;
    image: string;
  };
  counselor: {
    id: string;
    name: string;
    image: string;
  };
}

const AppointmentTable = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await refreshTable();
    };

    loadData();
  }, []);

  const refreshTable = async () => {
    const res = await fetch("/api/user/appointments");
    const data = await res.json();

    if (!res.ok) {
      console.error("Failed to fetch appointments:", data);
      setLoading(false);
      return;
    }

    setAppointments(data);
    setLoading(false);
  };

  return (
    <div className="w-full flex-1 overflow-y-auto p-5">
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead className="text-center text-base-content">
            <tr>
              <th>Counselor</th>
              <th>Date</th>
              <th>Time</th>
              <th className="text-green-500">Confirmed</th>
              <th className="text-yellow-500">Pending</th>
              <th className="text-blue-500">Done</th>
              <th></th>
            </tr>
            <tr></tr>
          </thead>
          <tbody className="text-base-content text-center">
            <AuthProvider>
              {renderAppointments(
                loading,
                appointments
                  .map(toAppointmentData)
                  .filter(Boolean) as AppointmentData[]
              )}
            </AuthProvider>
          </tbody>
        </table>
      </div>
    </div>
  );
};

function renderAppointments(
  loading: boolean,
  appointments: AppointmentData[]
): ReactNode {
  if (loading) {
    return (
      <tr>
        <td>
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <p className="text-base-content">Loading chat...</p>
          </div>
        </td>
      </tr>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <tr>
        <p className="text-center text-gray-500">No appointments available.</p>
      </tr>
    );
  }

  return appointments.map((appointment) => (
    <AppointmentRow key={appointment.id} appointment={appointment} />
  ));
}

function toAppointmentData(raw: any): AppointmentData | null {
  if (
    typeof raw.id !== "number" ||
    typeof raw.studentId !== "string" ||
    typeof raw.counselorId !== "string" ||
    typeof raw.status !== "string" ||
    typeof raw.schedule !== "string" ||
    !raw.student ||
    !raw.counselor
  ) {
    return null;
  }

  const schedule = new Date(raw.schedule);

  return {
    id: raw.id.toString(),
    studentId: raw.studentId,
    counselorId: raw.counselorId,
    schedule: schedule,
    status: raw.status,
    student: {
      id: raw.student.id,
      name: raw.student.name,
      image: raw.student.image,
    },
    counselor: {
      id: raw.counselor.id,
      name: raw.counselor.name,
      image: raw.counselor.image,
    },
  };
}

export default AppointmentTable;
