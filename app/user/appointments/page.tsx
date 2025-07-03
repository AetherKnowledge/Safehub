import React from "react";
import AppointmentTable from "@/app/components/AppointmentTable/AppointmentTable";
import Link from "next/link";

const AppointmentsPage = () => {
  return (
    <div className="flex flex-col h-[82vh] ">
      <div className="p-4 border-b-1 border-none rounded-t-2xl text-base-content bg-base-100">
        <h2 className="text-3xl font-bold text-primary">Appointments</h2>
      </div>
      <div className="divider mt-[-8] pl-3 pr-3" />
      <div className="pl-4">
        <Link
          href="/user/appointments/new"
          className="btn btn-primary p-4 w-50"
        >
          Book an Appointment
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <AppointmentTable />
      </div>
    </div>
  );
};

export default AppointmentsPage;
