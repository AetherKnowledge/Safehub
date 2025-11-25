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

  const maxHeight = isPopup ? "80vh" : expanded ? "1000px" : "700px";

  return (
    <div
      className={`card ${
        isPopup
          ? "bg-base-100"
          : "bg-gradient-to-br from-base-100 to-base-200/20"
      } min-w-[400px] w-full ${maxHeight} overflow-hidden hover:shadow-lg transition-all duration-300 ${
        isPopup ? "shadow-2xl" : ""
      }`}
    >
      {/* IMAGE GRID */}
      <div className="px-6 pt-4">
        <ImageGrid images={post.images} />
      </div>

      <div className="card-body flex flex-col p-6 pt-4">
        {/* STATS */}
        <div className="pt-2">
          <PostStats
            post={post}
            showPopup={showPopup}
            setShowPopup={setShowPopup}
          />
        </div>

        <div className="flex flex-row justify-between items-start gap-4">
          {/* Title */}
          <h2 className="text-base-content font-bold leading-tight text-2xl flex-1">
            {post.title}
          </h2>

          {/* Date */}
          <div className="flex justify-end items-center text-xs text-base-content/60 bg-base-200/50 px-3 py-1.5 rounded-full border border-base-content/10">
            <svg
              className="w-3 h-3 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="whitespace-nowrap">
              {formatDatetime(post.createdAt)}
            </span>
          </div>
        </div>

        {/* Text */}
        <div className="bg-base-200/20 rounded-lg p-4 border border-base-content/5">
          <p className="text-sm text-base-content/80 leading-relaxed max-h-[10vh] overflow-y-auto scrollbar-thin">
            {expanded ? (
              <>{post.content} </>
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
                className="text-sm text-primary font-semibold ml-2 hover:underline transition-colors"
              >
                {expanded ? "See less" : "See more..."}
              </button>
            )}
          </p>
        </div>

        {/* Comments */}
        {isPopup && <PostComments post={post} />}
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
        <ModalBase className="px-20" onClose={() => setShowPopup(false)}>
          <div className="w-full" onClick={(e) => e.stopPropagation()}>
            <PostBox
              post={post}
              showPopup={showPopup}
              setShowPopup={setShowPopup}
              isPopup
            />
          </div>
        </ModalBase>
      )}
    </>
  );
};

export default PostBoxHandler;
