import Link from "next/link";
import { MdEdit } from "react-icons/md";
import { AppointmentData } from "../AppointmentActions";

interface EditButtonProps {
  appointment: AppointmentData;
}

const EditButton = ({ appointment }: EditButtonProps) => {
  return (
    <>
      <Link
        href={`/user/appointments/${appointment.id}`}
        className="flex flex-row h-8 btn btn-sm btn-ghost gap-1 justify-center items-center"
      >
        <MdEdit className="w-3 h-3" />
        Edit
      </Link>
    </>
  );
};

export default EditButton;
