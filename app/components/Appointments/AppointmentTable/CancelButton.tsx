"use client";

import DefaultLoading from "@/app/components/DefaultLoading";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cancelAppointment } from "../AppointmentsActions";

interface CancelButtonProps {
  appointmentId: string;
}

const CancelButton = ({ appointmentId }: CancelButtonProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCancel = async (appointmentId: string) => {
    try {
      setLoading(true);
      await cancelAppointment(appointmentId);
      router.refresh();
    } catch (error) {
      console.error("Error canceling appointment:", error);
      return;
    }
  };

  return (
    <>
      {loading ? (
        <DefaultLoading />
      ) : (
        <button
          className="btn btn-error"
          onClick={() => handleCancel(appointmentId)}
        >
          Cancel
        </button>
      )}
    </>
  );
};

export default CancelButton;
