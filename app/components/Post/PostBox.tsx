"use client";
import { formatDatetime } from "@/lib/utils";
import { useState } from "react";
import { PostData } from "../../pages/Post/PostActions";
import ModalBase from "../Popup/ModalBase";
import ImageGrid from "./ImageGrid";
import PostComments from "./PostComments";
import PostStats from "./PostStats";

const PostBox = ({
  post,
  showPopup,
  setShowPopup,
  isPopup = false,
}: {
  post: PostData;
  showPopup: boolean;
  setShowPopup: (value: boolean) => void;
  isPopup?: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded(!expanded);

  const textMaxHeightClass = isPopup ? "max-h-[40vh]" : "max-h-[10vh]";

  return (
    <div className="card bg-base-100 border border-base-300/70 shadow-sm rounded-2xl w-full overflow-hidden">
      {/* IMAGE GRID */}
      <div className="px-4 pt-4">
        <ImageGrid images={post.images} />
      </div>

      <div className="card-body flex flex-col gap-3 p-4 sm:p-5">
        {/* STATS */}
        <div className="pt-1">
          <PostStats
            post={post}
            showPopup={showPopup}
            setShowPopup={setShowPopup}
          />
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h2 className="text-base-content font-semibold leading-snug text-lg sm:text-xl break-words">
              {post.title}
            </h2>
          </div>

          {/* Date */}
          <div className="flex-shrink-0 text-right text-[11px] sm:text-xs text-base-content/70">
            <span>{formatDatetime(post.createdAt)}</span>
          </div>
        </div>

        {/* Text */}
        <div
          className={`text-sm text-base-content/90 ${textMaxHeightClass} overflow-y-auto leading-relaxed`}
        >
          {expanded ? (
            <>{post.content}</>
          ) : (
            <>
              {post.content.length > 200
                ? post.content.slice(0, 200) + "..."
                : post.content}
            </>
          )}
          {post.content.length > 200 && (
            <button
              onClick={toggleExpand}
              className="text-xs sm:text-sm text-primary font-semibold ml-1 hover:underline"
            >
              {expanded ? "See less" : "See more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const PostBoxHandler = ({ post }: { post: PostData }) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <PostBox post={post} showPopup={showPopup} setShowPopup={setShowPopup} />
      {showPopup && (
        <ModalBase className="px-3 sm:px-6" onClose={() => setShowPopup(false)}>
          <div className="w-full" onClick={(e) => e.stopPropagation()}>
            <div className="w-full h-[80vh] max-h-[85vh] max-w-6xl mx-auto bg-base-100 border border-base-300 rounded-2xl shadow-2xl flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
              {/* Post content */}
              <div className="flex-1 min-w-0 min-h-0 flex flex-col">
                <PostBox
                  post={post}
                  showPopup={showPopup}
                  setShowPopup={setShowPopup}
                  isPopup
                />
              </div>

              {/* Comments side panel */}
              <div className="w-full lg:w-[340px] border-t lg:border-t-0 lg:border-l border-base-200 pt-4 lg:pt-0 lg:pl-4 flex flex-col min-h-0 max-h-full">
                <h3 className="text-sm font-semibold text-base-content mb-2 uppercase tracking-[0.18em]">
                  Comments
                </h3>
                <div className="flex-1 min-h-0">
                  <PostComments post={post} />
                </div>
              </div>
            </div>
          </div>
        </ModalBase>
      )}
    </>
  );
};

export default PostBoxHandler;
