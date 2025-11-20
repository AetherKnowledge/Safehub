import StarRating from "@/app/components/StarRating";
import Cell from "@/app/components/Table/Cell";
import HeaderItem from "@/app/components/Table/HeaderItem";
import Table from "@/app/components/Table/Table";
import TableHeader from "@/app/components/Table/TableHeader";
import UserImage from "@/app/components/UserImage";
import { UserType } from "@/app/generated/prisma";
import { formatDateDisplay, formatTime } from "@/lib/utils";
import EvaluationButton from "../AppointmentTable/EvaluationButton";
import { EvaluationTableData } from "./EvaluationActions";
import { EvaluationSortBy } from "./sort";

const EvaluationTable = ({
  evaluationData,
  isLoading = false,
}: {
  evaluationData: EvaluationTableData[];
  isLoading?: boolean;
}) => {
  return (
    <Table
      header={<EvaluationHeader />}
      rows={evaluationData.map((data, index) => (
        <EvaluationRow key={index} data={data} />
      ))}
      isLoading={isLoading}
    />
  );
};

export const EvaluationRow = ({ data }: { data: EvaluationTableData }) => {
  return (
    <>
      <Cell isFirst>
        <div className="flex flex-wrap items-center justify-start gap-2">
          <UserImage
            name={data.studentName ?? data.studentEmail.split("@")[0]}
            width={10}
            src={data.studentImageUrl}
          />
          <p className="font-semibold text-sm">
            {data.studentName ?? data.studentEmail.split("@")[0]}
          </p>
        </div>
      </Cell>
      <Cell>{formatDateDisplay(data.startTime)}</Cell>
      <Cell>
        {`${formatTime(data.startTime)} ${
          data.endTime && ` - ${formatTime(data.endTime)}`
        }`}
      </Cell>
      <Cell>
        <StarRating rating={data.rating || 0} />
      </Cell>
      <Cell>
        <EvaluationButton
          appointment={{ id: data.appointmentId, evaluationData: null }}
          userType={UserType.Counselor}
        />
      </Cell>
    </>
  );
};

export const EvaluationHeader = () => {
  return (
    <TableHeader>
      <HeaderItem>Student</HeaderItem>
      <HeaderItem sortKey={EvaluationSortBy.AppointmentDate}>Date</HeaderItem>
      <HeaderItem>Time</HeaderItem>
      <HeaderItem>User Rating</HeaderItem>
      <HeaderItem>Actions</HeaderItem>
    </TableHeader>
  );
};

export default EvaluationTable;
