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
      className={`card bg-base-100 min-w-[400px] w-full mx-auto ${maxHeight} overflow-hidden`}
    >
      {/* IMAGE GRID */}
      <div className="px-4">
        <ImageGrid images={post.images} />
      </div>

      <div className="card-body flex flex-col p-4 pt-0 px-6">
        {/* STATS */}
        <div className="pt-2">
          <PostStats
            post={post}
            showPopup={showPopup}
            setShowPopup={setShowPopup}
          />
        </div>

        <div className="flex flex-row justify-between items-center">
          {/* Title */}
          <h2 className="text-base-content font-bold leading-tight br text-2xl">
            {post.title}
          </h2>

          {/* Date */}
          <div className="flex justify-between items-end text-xs text-base-content">
            <span>{formatDatetime(post.createdAt)}</span>
          </div>
        </div>

        {/* Text */}
        <p className="text-sm text-base-content max-h-[10vh] overflow-y-auto">
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
              className="text-sm text-base-content/50 font-semibold ml-1 hover:underline"
            >
              {expanded ? "See less" : "See more..."}
            </button>
          )}
        </p>

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
        <ModalBase className="px-20" onClick={() => setShowPopup(false)}>
          <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
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
