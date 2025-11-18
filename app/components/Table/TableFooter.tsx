"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Pagination from "./Pagination";
import PerPage from "./PerPage";

const TableFooter = ({
  itemCount = 1,
  perPageValues = [5, 10, 15],
}: {
  itemCount?: number;
  perPageValues?: number[];
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || "5");
  const pageCount = Math.ceil(itemCount / perPage);

  const topItem = (page - 1) * perPage + 1;
  const bottomItem = Math.min(page * perPage, itemCount);

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

        <div className="w-full flex justify-center">
          <PerPage
            perPage={perPage}
            values={perPageValues}
            onChange={(value) => {
              const params = new URLSearchParams(searchParams.toString());
              if (value) {
                params.set("perPage", value.toString());
              } else {
                params.delete("perPage");
              }
              router.push(`${pathName}?${params.toString()}`, {
                scroll: false,
              });
            }}
          />
        </div>

        <div className="w-full flex justify-end">
          <Pagination
            key={"pagination"}
            currentPage={page}
            pageCount={pageCount}
            onPageChange={(newPage) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", newPage.toString());
              router.push(`${pathName}?${params.toString()}`, {
                scroll: false,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TableFooter;
