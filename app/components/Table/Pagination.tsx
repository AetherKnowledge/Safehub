"use client";

import { useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import TextBox from "../Input/TextBox";

const Pagination = ({
  pageCount = 1,
  currentPage = 1,
  onPageChange,
}: {
  pageCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}) => {
  if (pageCount <= 1) return <div></div>;

  const renderPages = () => {
    if (pageCount === 2) {
      return (
        <>
          <PageButton
            isActive={currentPage === 1}
            onClick={() => onPageChange?.(1)}
          >
            1
          </PageButton>
          <PageButton
            isActive={currentPage === 2}
            onClick={() => onPageChange?.(2)}
          >
            2
          </PageButton>
        </>
      );
    }

    if (pageCount === 3) {
      return (
        <>
          <PageButton
            isActive={currentPage === 1}
            onClick={() => onPageChange?.(1)}
          >
            1
          </PageButton>
          <PageButton
            isActive={currentPage === 2}
            onClick={() => onPageChange?.(2)}
          >
            2
          </PageButton>
          <PageButton
            isActive={currentPage === 3}
            onClick={() => onPageChange?.(3)}
          >
            3
          </PageButton>
        </>
      );
    }

    return (
      <>
        {/* FIRST PAGE */}
        <PageButton
          isActive={currentPage === 1}
          onClick={() => onPageChange?.(1)}
        >
          1
        </PageButton>

        {/* ELLIPSIS */}
        <Ellipsis
          onPageChange={onPageChange}
          pageCount={pageCount}
          currentPage={currentPage}
        />

        {/* LAST PAGE */}
        <PageButton
          isActive={currentPage === pageCount}
          onClick={() => onPageChange?.(pageCount)}
        >
          {pageCount}
        </PageButton>
      </>
    );
  };

  return (
    <div className="join border border-base-300 rounded-md">
      {/* PREV */}
      <button
        disabled={currentPage <= 1}
        className="join-item btn btn-neutral h-8 btn-sm lg:btn-md border"
        onClick={() => onPageChange?.(currentPage - 1)}
      >
        <GrFormPrevious />
      </button>

      {/* PAGES */}
      {renderPages()}

      {/* NEXT */}
      <button
        disabled={currentPage >= pageCount}
        className="join-item btn btn-neutral h-8 btn-sm lg:btn-md border"
        onClick={() => onPageChange?.(currentPage + 1)}
      >
        <GrFormNext />
      </button>
    </div>
  );
};

function PageButton({
  isActive,
  children,
  onClick,
}: {
  isActive?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={`join-item btn btn-neutral h-8 btn-sm lg:btn-md border ${
        isActive ? "btn-active text-primary" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Ellipsis({
  onPageChange,
  pageCount,
  currentPage,
}: {
  onPageChange?: (page: number) => void;
  pageCount: number;
  currentPage: number;
}) {
  const [showModal, setShowModal] = useState(false);
  const [pageInput, setPageInput] = useState<number | null>(null);

  return (
    <div className={`tooltip join-item ${showModal ? "tooltip-open" : ""}`}>
      <div
        className={`pointer-events-auto border border-base-300/70 tooltip-content ${
          showModal ? "block" : "hidden"
        }`}
      >
        <div className="flex gap-2 items-center">
          Page:
          <TextBox
            key={currentPage}
            className="h-10 w-16"
            name="page"
            noFormOutput
            defaultValue={currentPage?.toString() || ""}
            onChange={(value) => {
              if (!isNaN(Number(value))) setPageInput(Number(value));
            }}
            onEnter={() => {
              if (
                pageInput !== null &&
                pageInput >= 1 &&
                pageInput <= pageCount
              ) {
                onPageChange?.(pageInput);
                setShowModal(false);
              }
            }}
          />
        </div>
      </div>

      <button
        className={`btn btn-neutral h-8 btn-sm lg:btn-md border ${
          showModal ? "btn-active text-primary" : ""
        }`}
        onClick={() => setShowModal(!showModal)}
      >
        ...
      </button>
    </div>
  );
}

export default Pagination;
