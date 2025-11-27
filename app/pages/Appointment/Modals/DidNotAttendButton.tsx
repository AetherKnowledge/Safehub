import { usePopup } from "@/app/components/Popup/PopupProvider";
import { useRouter } from "next/navigation";
import { MdError } from "react-icons/md";
import { AppointmentData, updateToDidNotAttend } from "../AppointmentActions";

const DidNotAttendButton = ({
  appointment,
}: {
  appointment: AppointmentData;
}) => {
  const router = useRouter();
  const statusPopup = usePopup();

  const handleClick = async () => {
    const confirm = await statusPopup.showYesNo(
      `Are you sure the student did not attend this appointment?`
    );

    if (!confirm) {
      return;
    }

    statusPopup.showLoading("Updating appointment...");

    const result = await updateToDidNotAttend(appointment.id);

    if (!result.success) {
      statusPopup.showError(result.message || "Failed to update appointment.");
      return;
    }

    statusPopup.showSuccess(`Appointment updated successfully.`);
    router.refresh();
  };

  return (
    <button
      className="flex flex-row btn btn-error gap-1 justify-center items-center btn-sm h-8"
      onClick={handleClick}
    >
      <MdError className="w-3 h-3" />
      Did not Attend
    </button>
  );
};

export default DidNotAttendButton;
