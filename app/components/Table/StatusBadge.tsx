import { AppointmentStatus } from "@/app/generated/prisma";

const StatusBadge = ({
  status,
  className,
}: {
  status: AppointmentStatus;
  className?: string;
}) => {
  switch (status) {
    case AppointmentStatus.Rejected:
      return <div className={`badge badge-error ${className}`}>Rejected</div>;
    case AppointmentStatus.Cancelled:
      return <div className={`badge badge-error ${className}`}>Cancelled</div>;
    case AppointmentStatus.Pending:
      return <div className={`badge badge-warning ${className}`}>Pending</div>;
    case AppointmentStatus.Approved:
      return <div className={`badge badge-success ${className}`}>Approved</div>;
    case AppointmentStatus.Completed:
      return <div className={`badge badge-info ${className}`}>Completed</div>;
    default:
      return null;
  }
};

export const FollowUpBadge = () => {
  return <div className="badge">Follow-Up</div>;
};

export default StatusBadge;
