import Cell from "@/app/components/Table/Cell";
import HeaderItem from "@/app/components/Table/HeaderItem";
import StatusBadge from "@/app/components/Table/StatusBadge";
import Table from "@/app/components/Table/Table";
import TableHeader from "@/app/components/Table/TableHeader";
import { formatDateDisplay } from "@/lib/utils";
import { ParsedAppointmentLog } from "./schema";
import { AppointmentLogSortBy } from "./sort";

const Logs = ({
  logs,
  totalCount,
  isLoading = true,
}: {
  logs: ParsedAppointmentLog[];
  totalCount: number;
  isLoading?: boolean;
}) => {
  return (
    <Table
      totalCount={totalCount}
      header={<LogsHeader />}
      rows={logs.map((log, index) => (
        <LogsRow key={index} log={log} />
      ))}
      isLoading={isLoading}
    />
  );
};

export const LogsRow = ({ log }: { log: ParsedAppointmentLog }) => {
  return (
    <>
      <Cell className="text-left">{formatDateDisplay(log.startTime)}</Cell>
      <Cell>{log.studentName}</Cell>
      <Cell>
        <StatusBadge status={log.to} />
      </Cell>
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
