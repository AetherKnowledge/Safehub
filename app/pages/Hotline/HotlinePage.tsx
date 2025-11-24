"use client";
import { Hotline, UserType } from "@/app/generated/prisma/wasm";
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
    <div className="flex flex-col flex-1 bg-base-100 p-5 gap-5 rounded-xl overflow-y-auto shadow-br">
      <div className="flex flex-row items-center justify-center gap-3">
        <label className="input w-full outline-none ring-0 focus-within:outline-none focus-within:ring-0">
          <IoIosSearch className="text-xl text-base-content" />
          <input
            type="text"
            className="grow text-base-content outline-none ring-0 focus:outline-none focus:ring-0"
            placeholder="Search hotlines..."
            onChange={(e) => {
              setName(e.target.value.trim());
            }}
          />
        </label>
        {userType === UserType.Admin && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setSelectedHotline(null);
              setIsModalOpen(true);
            }}
          >
            Add Hotline
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-wrap justify-center overflow-y-auto gap-3">
        {filteredHotlines.length === 0 && (
          <p className="flex text-center text-base-content/70 w-full h-full justify-center items-center">
            No hotlines available.
          </p>
        )}
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
