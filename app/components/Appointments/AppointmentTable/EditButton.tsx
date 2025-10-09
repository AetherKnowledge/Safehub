import Link from "next/link";
import { MdEdit } from "react-icons/md";

interface CancelButtonProps {
  appointmentId: string;
}

const EditButton = ({ appointmentId }: CancelButtonProps) => {
  return (
    <Link
      href={`/user/appointments/${appointmentId}`}
      className="flex flex-row h-8 btn btn-sm btn-ghost gap-1 justify-center items-center"
    >
      <MdEdit className="w-3 h-3" />
      Edit
    </Link>
  );
};

export default EditButton;
