import Cell from "@/app/components/Table/Cell";
import HeaderItem from "@/app/components/Table/HeaderItem";
import Table from "@/app/components/Table/Table";
import TableHeader from "@/app/components/Table/TableHeader";
import { AppointmentLogSortBy } from "@/app/user/appointment-logs/page";
import { formatDateDisplay } from "@/lib/utils";
import { ParsedAppointmentLog } from "./schema";

const Logs = ({
  logs,
  totalCount,
}: {
  logs: ParsedAppointmentLog[];
  totalCount: number;
}) => {
  return (
    <Table
      totalCount={totalCount}
      header={<LogsHeader />}
      rows={logs.map((log) => (
        <LogsRow log={log} />
      ))}
    />
  );
};

export const LogsRow = ({ log }: { log: ParsedAppointmentLog }) => {
  return (
    <>
      <Cell className="text-left">{formatDateDisplay(log.startTime)}</Cell>
      <Cell>{log.studentName}</Cell>
      <Cell>{log.to}</Cell>
      <Cell>{log.counselorName}</Cell>
    </>
  );
};

export const LogsHeader = () => {
  return (
    <TableHeader>
      <HeaderItem sortKey={AppointmentLogSortBy.AppointmentDate}>
        Appointment Date
      </HeaderItem>
      <HeaderItem>Student</HeaderItem>
      <HeaderItem>Status</HeaderItem>
      <HeaderItem>Counselor</HeaderItem>
    </TableHeader>
  );
};
export default Logs;
