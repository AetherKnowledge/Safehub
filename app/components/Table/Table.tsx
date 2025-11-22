"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import DefaultLoading from "../DefaultLoading";
import TableFooter from "./TableFooter";
import TableTopActions from "./TableTopActions";

export type TableProps = {
  header: ReactNode;
  rows: ReactNode[];
  topActions?: boolean;
  isLoading?: boolean;
};

const Table = ({
  header,
  rows,
  topActions = false,
  isLoading = false,
}: TableProps) => {
  const [perPage, setPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const visibleRows = rows.slice(startIndex, endIndex);

  // Auto-calc perPage based on space
  useEffect(() => {
    function updatePerPage() {
      if (!containerRef.current || !rowRef.current) return;

      const containerHeight = containerRef.current.clientHeight;
      const rowHeight = rowRef.current.clientHeight;

      if (rowHeight > 0) {
        const calculated = Math.max(1, Math.floor(containerHeight / rowHeight));
        setPerPage(calculated);
        const pageContainingCurrentRow = Math.ceil(
          (startIndex + 1) / calculated
        );
        setCurrentPage(pageContainingCurrentRow);
      }
    }

    updatePerPage();
    window.addEventListener("resize", updatePerPage);

    return () => {
      window.removeEventListener("resize", updatePerPage);
    };
  }, [rows.length, perPage, currentPage, containerRef.current]);

  return (
    <div className="flex-1 flex flex-col bg-base-100 shadow-br rounded-lg min-h-0 overflow-x-hidden">
      {topActions && <TableTopActions />}

      <div className="flex-1 flex flex-col text-center overflow-x-auto min-h-0">
        {header}

        {isLoading ? (
          <div className="flex-1 border-b border-base-300/70 overflow-y-auto min-h-0 items-center justify-center flex">
            <DefaultLoading size="loading-lg" message="Loading table data..." />
          </div>
        ) : (
          <div
            className="flex-1 border-b border-base-300/70 overflow-y-auto min-h-0"
            ref={containerRef}
          >
            {visibleRows.map((row, index) => {
              const isLast = index === visibleRows.length - 1;

              return (
                <div
                  key={`row${index}`}
                  ref={index === 0 ? rowRef : null} // measure only first row
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

      <TableFooter
        itemCount={rows.length}
        perPage={perPage}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Table;
