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
  status: AppointmentStatus;
  schedule: string;
  createdAt: string;
  concerns: string[];
  student: {
    studentId: string;
    user: {
      name: string;
      email: string;
      image: string;
    };
  };
  counselor: {
    counselorId: string;
    user: {
      name: string;
      email: string;
      image: string;
    };
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

    console.log(data);
    setAppointments(data);
    setLoading(false);
  };

  const handleCancel = async (appointmentId: string) => {
    setLoading(true);
    const res = await fetch("/api/user/appointments", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ appointmentId }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Failed to cancel appointment:", errorData);
      return;
    }

    // setAppointments((prev) =>
    //   prev.filter((appointment) => appointment.id !== appointmentId)
    // );
    refreshTable();
  };

  return (
    <div className="w-full flex-1 overflow-y-auto p-5">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-base-content">Loading appointments...</p>
        </div>
      ) : !appointments || appointments.length === 0 ? (
        <p className="text-center text-gray-500">No appointments available.</p>
      ) : (
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
                  <AppointmentRow
                    key={appointment.id}
                    appointment={appointment}
                    onCancel={handleCancel}
                  />
                ))}
              </AuthProvider>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentTable;
