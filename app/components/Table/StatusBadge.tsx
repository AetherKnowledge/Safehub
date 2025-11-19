import { AppointmentStatus } from "@/app/generated/prisma";

const StatusBadge = ({ status }: { status: AppointmentStatus }) => {
  switch (status) {
    case AppointmentStatus.Rejected:
      return <div className="badge badge-error">Rejected</div>;
    case AppointmentStatus.Cancelled:
      return <div className="badge badge-error">Cancelled</div>;
    case AppointmentStatus.Pending:
      return <div className="badge badge-warning">Pending</div>;
    case AppointmentStatus.Approved:
      return <div className="badge badge-info">Approved</div>;
    case AppointmentStatus.Completed:
      return <div className="badge badge-success">Completed</div>;
    default:
      return null;
  }
};

export default StatusBadge;
