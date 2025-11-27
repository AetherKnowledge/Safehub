import StarRating from "@/app/components/StarRating";
import Cell from "@/app/components/Table/Cell";
import HeaderItem from "@/app/components/Table/HeaderItem";
import Table from "@/app/components/Table/Table";
import TableHeader from "@/app/components/Table/TableHeader";
import UserImage from "@/app/components/UserImage";
import { UserType } from "@/app/generated/prisma";
import { formatDateDisplay, formatTime } from "@/lib/utils";
import EvaluationButton from "../Modals/EvaluationButton";
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
        <div className="flex flex-wrap items-center justify-start gap-3">
          <div className="ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100 rounded-full">
            <UserImage
              name={data.studentName ?? data.studentEmail.split("@")[0]}
              width={10}
              src={data.studentImageUrl}
            />
          </div>
          <p className="font-semibold text-sm">
            {data.studentName ?? data.studentEmail.split("@")[0]}
          </p>
        </div>
      </Cell>
      <Cell>
        <span className="text-sm font-medium">
          {formatDateDisplay(data.startTime)}
        </span>
      </Cell>
      <Cell>
        <span className="text-sm text-base-content/80">
          {`${formatTime(data.startTime)} ${
            data.endTime && ` - ${formatTime(data.endTime)}`
          }`}
        </span>
      </Cell>
      <Cell>
        <div className="flex items-center gap-2">
          <StarRating rating={data.rating || 0} />
          {data.rating && (
            <span className="text-xs font-semibold text-primary">
              {data.rating.toFixed(1)}
            </span>
          )}
        </div>
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
