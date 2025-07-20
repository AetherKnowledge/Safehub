"use client";
import { AppointmentStatus } from "@/app/generated/prisma";
import { useEffect, useState } from "react";
import { cancelAppointment, getAppointments } from "../AppointmentActions";
import AppointmentRow from "./ApointmentRow";

export type AppointmentData = {
  id: string;
  schedule: Date;
  status: AppointmentStatus;
  student: {
    studentId: string;
    user: {
      name: string;
      image?: string | null;
    };
  };
  counselor: {
    counselorId: string;
    user: {
      name: string;
      image?: string | null;
    };
  };
};

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
    const appointments = await getAppointments();
    setAppointments(appointments);

    setLoading(false);
  };

  const handleCancel = async (appointmentId: string) => {
    setLoading(true);
    try {
      await cancelAppointment(appointmentId);
    } catch (error) {
      console.error("Error canceling appointment:", error);
      setLoading(false);
      return;
    }

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
              {appointments.map((appointment) => (
                <AppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={handleCancel}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentTable;
