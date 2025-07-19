"use client";
import { useState } from "react";
import { AiFillDislike, AiFillHeart, AiFillLike } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import ImageGrid from "./ImageGrid";
import { dislikePost, likePost, PostProps } from "./PostActions";
import PostPopup from "./PostPopup"; // Add this import
import StatButton from "./StatsButton";

const EventBox = ({
  id,
  date,
  title,
  content,
  images,
  authorName,
  authorImage,
  likesStats,
  dislikesStats,
  comments = [],
}: PostProps) => {
  const [expanded, setExpanded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <>
      <div
        className={`card bg-base-100 shadow-br max-w-2xl mx-auto my-8 ${
          expanded ? "max-h-[1000px]" : "max-h-[700px]"
        } overflow-hidden`}
      >
        <div className="card-body flex flex-col">
          <div>
            {/* Date */}
            <div className="flex justify-between items-end text-sm text-base-content/60">
              <span>{date}</span>
              <HiDotsHorizontal className="text-2xl" />
            </div>

            {/* Title */}
            <h2 className="text-base-content font-bold leading-tight br text-2xl">
              {title}
            </h2>
          </div>

          {/* Text */}
          <p className="text-sm text-base-content">
            {expanded ? (
              <>{content} </>
            ) : (
              <>
                {content.length > 100 ? content.slice(0, 100) + "..." : content}
              </>
            )}
            <button
              onClick={toggleExpand}
              className="text-sm text-base-content/50 font-semibold ml-1 hover:underline"
            >
              {expanded ? "See less" : "See more..."}
            </button>
          </p>

          {/* IMAGE GRID */}
          <ImageGrid images={images} />

          {/* STATS */}

          <div className="divider my-[-4]" />
          <div className="flex justify-between items-center text-sm text-base-content/80">
            <div className="grid grid-cols-4 gap-4 items-center w-full">
              <StatButton
                onChange={async (value: boolean) => {
                  await likePost(id, value);
                }}
                icon={AiFillLike}
                value={likesStats}
                label="Likes"
                color="text-blue-500"
              />
              <StatButton
                onChange={async (value: boolean) => {
                  await dislikePost(id, value);
                }}
                icon={AiFillDislike}
                value={dislikesStats}
                label="Dislikes"
                color="text-red-500"
              />
              <StatButton
                onChange={async (value: boolean) => {}}
                icon={AiFillHeart}
                value={{ count: 4, selected: false }}
                label="Saved"
              />
              <StatButton
                onChange={async (value: boolean) => {
                  setShowPopup(value);
                }}
                icon={FaCommentAlt}
                value={{ count: comments.length, selected: showPopup }}
                label="Comments"
                color="text-yellow-500"
                commentBtn
              />
            </div>
          </div>
        </div>
      </div>
      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowPopup(false)} // Close on overlay click
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
          >
            <PostPopup
              id={id}
              date={date}
              title={title}
              content={content}
              images={images}
              authorName={authorName}
              authorImage={authorImage}
              likesStats={likesStats}
              dislikesStats={dislikesStats}
              comments={comments}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default EventBox;
