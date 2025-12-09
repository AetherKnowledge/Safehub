import { AppointmentStatus } from "@/app/generated/prisma/browser";

const StatusBadge = ({
  status,
  className,
}: {
  status: AppointmentStatus;
  className?: string;
}) => {
  switch (status) {
    case AppointmentStatus.Cancelled:
      return <div className={`badge badge-error ${className}`}>Cancelled</div>;
    case AppointmentStatus.DidNotAttend:
      return (
        <div className={`badge badge-error ${className}`}>Did Not Attend</div>
      );
    case AppointmentStatus.Pending:
      return <div className={`badge badge-warning ${className}`}>Pending</div>;
    case AppointmentStatus.Approved:
      return <div className={`badge badge-success ${className}`}>Approved</div>;
    case AppointmentStatus.Completed:
      return <div className={`badge badge-info ${className}`}>Counseled</div>;
    default:
      return null;
  }
};

export const FollowUpBadge = () => {
  return <div className="badge bg-gray-100 text-black">Follow-Up</div>;
};

export default StatusBadge;
