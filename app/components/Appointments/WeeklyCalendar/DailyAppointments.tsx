"use client";
import { useEffect, useState } from "react";
import { AppointmentData } from "../AppointmentsActions";
import AppointmentBox from "./AppointmentBox";

const DailyAppointments = ({ date }: { date: Date }) => {
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const request = await fetch("/api/appointments/" + date.toISOString(), {
          method: "GET",
          signal,
        });
        const fetchedAppointments: AppointmentData[] = await request.json();
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
    return () => {
      controller.abort("Component unmounted");
    };
  }, [date]);

  return (
    <>
      {loading ? (
        <AppointmentBoxLoading />
      ) : (
        appointments.map((appointment, index) => (
          <AppointmentBox key={index} appointment={appointment} />
        ))
      )}
    </>
  );
};

export const AppointmentBoxLoading = () => {
  return (
    <div className="absolute top-2 left-2 text-xs text-gray-400">
      Loading...
    </div>
  );
};

export default DailyAppointments;
