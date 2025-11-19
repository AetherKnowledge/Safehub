import { ReactNode } from "react";
import DefaultLoading from "../DefaultLoading";
import TableFooter from "./TableFooter";
import TableTopActions from "./TableTopActions";

export type TableProps = {
  header: ReactNode;
  rows: ReactNode[];
  totalCount: number;
  topActions?: boolean;
  perPageValues?: number[];
  isLoading?: boolean;
};

const Table = ({
  header,
  rows,
  totalCount,
  topActions = false,
  perPageValues = [5, 10, 15],
  isLoading = true,
}: TableProps) => {
  return (
    <div className="flex-1 flex flex-col bg-base-100 shadow-br rounded-lg min-h-0 overflow-x-hidden">
      {topActions && <TableTopActions />}
      <div
        className={`flex-1 flex flex-col text-center overflow-x-auto min-h-0`}
      >
        {header}
        {isLoading ? (
          <div className="flex-1 border-b border-base-300/70 overflow-y-auto min-h-0 items-center justify-center flex">
            <DefaultLoading size="loading-lg" message="Loading table data..." />
          </div>
        ) : (
          <div className="flex-1 border-b border-base-300/70 overflow-y-auto min-h-0">
            {rows.map((row, index) => {
              const isLast = index === rows.length - 1;

              return (
                <div
                  key={`row${index}`}
                  className={`flex flex-row flex-1 border-b border-base-300/70 text-center items-center justify-center ${
                    isLast ? "border-b-0" : ""
                  }`}
                >
                  {row}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <TableFooter itemCount={totalCount} perPageValues={perPageValues} />
    </div>
  );
};

export default Table;
