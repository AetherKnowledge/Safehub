"use client";
import { Hotline, UserType } from "@/app/generated/prisma/browser";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import HotlineCard from "./HotlineCard";
import HotlineModal from "./HotlineModal";

const HotlinePage = ({
  hotlines,
  userType,
}: {
  hotlines: Hotline[];
  userType: UserType;
}) => {
  const [name, setName] = useState<string>("");
  const [filteredHotlines, setFilteredHotlines] = useState<Hotline[]>(hotlines);
  const [selectedHotline, setSelectedHotline] = useState<Hotline | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setFilteredHotlines(filterHotlines(hotlines, name));
  }, [hotlines, name]);

  return (
    <div className="flex flex-col flex-1 gap-4 p-1 min-h-0">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-base-100 to-base-200/50 p-5 rounded-xl shadow-xl border border-base-content/5 backdrop-blur-sm">
        <div className="flex-1 w-full sm:w-auto">
          <label className="input input-bordered flex items-center gap-2 w-full bg-base-100 border-base-content/10 focus-within:border-primary transition-all">
            <IoIosSearch className="text-xl text-base-content/60" />
            <input
              type="text"
              className="grow text-base-content outline-none"
              placeholder="Search hotlines..."
              onChange={(e) => {
                setName(e.target.value.trim());
              }}
            />
          </label>
        </div>
        {userType === UserType.Admin && (
          <button
            className="btn btn-primary rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] whitespace-nowrap"
            onClick={() => {
              setSelectedHotline(null);
              setIsModalOpen(true);
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Hotline
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 bg-gradient-to-br from-base-100 to-base-200 p-5 rounded-xl overflow-y-auto shadow-xl border border-base-content/5 min-h-0">
        {filteredHotlines.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full h-full gap-4 text-center">
            <div className="p-6 bg-base-300/20 rounded-full">
              <svg
                className="w-16 h-16 text-base-content/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-base-content mb-2">
                No hotlines found
              </h3>
              <p className="text-base-content/60 text-sm">
                {name
                  ? "Try adjusting your search"
                  : "No hotlines available at the moment"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full content-start">
            {filteredHotlines.map((hotline, index) => (
              <HotlineCard
                key={index}
                hotline={hotline}
                userType={userType}
                onEdit={() => {
                  setSelectedHotline(hotline);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>
      {isModalOpen && (
        <HotlineModal
          hotline={selectedHotline}
          onClose={() => {
            setSelectedHotline(null);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

function filterHotlines(hotlines: Hotline[], name?: string) {
  return hotlines.filter((hotline) => {
    const matchesName =
      !name ||
      !hotline.name ||
      hotline.name.toLowerCase().includes(name.toLowerCase());

    return matchesName;
  });
}

export default HotlinePage;
