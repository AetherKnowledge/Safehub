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
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
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
      {renderAppointmentsTable(loading, appointments)}
    </div>
  );
};

function renderAppointmentsTable(
  loading: boolean,
  appointments: AppointmentData[]
): ReactNode {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="text-base-content">Loading appointments...</p>
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <p className="text-center text-gray-500">No appointments available.</p>
    );
  }

  return (
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
            {appointments.map((appointment) => (
              <AppointmentRow key={appointment.id} appointment={appointment} />
            ))}
          </AuthProvider>
        </tbody>
      </table>
    </div>
  );
}

export default AppointmentTable;
