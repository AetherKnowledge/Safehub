import { UserType } from "@/app/generated/prisma";
import { JsonValue } from "@prisma/client/runtime/client";
import Link from "next/link";
import { MdMessage } from "react-icons/md";

const EvaluationButton = ({
  appointment,
  userType,
}: {
  appointment: { id: string; evaluationData: JsonValue | null };
  userType: UserType;
}) => {
  return (
    <Link
      className="flex flex-row btn bg-blue-500 hover:bg-blue-600 active:bg-blue-800 text-white gap-1 justify-center items-center btn-sm h-8 py-1"
      href={`/user/appointments/${appointment.id}/evaluation`}
    >
      <MdMessage className="w-3 h-3" />
      {!appointment.evaluationData && userType === UserType.Student
        ? "Evaluate Session"
        : "View Evaluation"}
    </Link>
  );
};

export default EvaluationButton;
