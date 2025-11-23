import { usePathname, useSearchParams } from "next/navigation";
import Pagination from "./Pagination";

const TableFooter = ({
  itemCount = 1,
  perPage = 5,
  onPageChange,
  currentPage = 1,
}: {
  itemCount?: number;
  perPage?: number;
  onPageChange?: (page: number) => void;
  currentPage?: number;
}) => {
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const pageCount = Math.ceil(itemCount / perPage);

  const topItem = (currentPage - 1) * perPage + 1;
  const bottomItem = Math.min(currentPage * perPage, itemCount);

  return (
    <div className="mt-auto border-t border-base-300/70">
      <div className="flex flex-row justify-between items-center p-4">
        <div className="w-full">
          <p>
            {pageCount > 1
              ? `Showing ${topItem} to ${bottomItem} of ${itemCount} results`
              : `Showing all ${itemCount} results`}
          </p>
        </div>

        <div className="w-full flex justify-center"></div>

        <div className="w-full flex justify-end">
          <Pagination
            key={"pagination"}
            currentPage={currentPage}
            pageCount={pageCount}
            onPageChange={(newPage) => {
              if (onPageChange) {
                onPageChange(newPage);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TableFooter;
