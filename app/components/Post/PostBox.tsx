"use client";
import { formatDatetime } from "@/lib/client-utils";
import { useState } from "react";
import { PostData } from "../../pages/Post/PostActions";
import ImageGrid from "./ImageGrid";
import PostComments from "./PostComments";
import PostStats from "./PostStats";

const PostBox = ({
  post,
  showPopup,
  setShowPopup,
  isPopup = false,
  onUpdate,
}: {
  post: PostData;
  showPopup: boolean;
  setShowPopup: (value: boolean) => void;
  isPopup?: boolean;
  onUpdate?: (post: PostData) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded(!expanded);

  const maxHeight = isPopup ? "80vh" : expanded ? "1000px" : "700px";

  return (
    <div
      className={`card ${
        isPopup
          ? "bg-base-100 w-full h-full flex flex-col"
          : "bg-linear-to-br from-base-100 to-base-200/20 min-w-[400px]"
      } w-full ${
        isPopup ? "" : maxHeight
      } overflow-hidden transition-all duration-300 ${
        isPopup ? "shadow-2xl" : ""
      }`}
    >
      {/* IMAGE GRID */}
      <div className={isPopup ? "flex-1 min-h-0 p-6 pb-0" : "px-6 pt-4"}>
        <ImageGrid images={post.images} isPopup={isPopup} />
      </div>

      <div
        className={`card-body flex flex-col ${
          isPopup
            ? "flex-shrink-0 max-h-[40vh] overflow-y-auto p-6"
            : "p-6 pt-4"
        }`}
      >
        {/* STATS */}
        <div className="pt-2">
          <PostStats
            post={post}
            showPopup={showPopup}
            setShowPopup={setShowPopup}
            onUpdate={onUpdate}
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
        {isPopup && <PostComments post={post} onUpdate={onUpdate} />}
      </div>
    </div>
  );
};

export const PostBoxHandler = ({ post: initialPost }: { post: PostData }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [post, setPost] = useState<PostData>(initialPost);

  return (
    <>
      <PostBox
        post={post}
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        onUpdate={setPost}
      />
      {showPopup && (
        <>
          createPortal(
          <div
            className={`fixed inset-0 min-w-0 flex items-center justify-center backdrop-brightness-50 z-[9999] bg-opacity-50 bg-transparent px-4 md:px-10 lg:px-20 py-4 md:py-8`}
            onClick={() => setShowPopup(false)}
          >
            <div className="max-h-[100vh] overflow-y-auto w-full items-center justify-center scrollbar-gutter-stable">
              <div className="flex-1 flex p-5 items-center justify-center">
                <div className="w-full" onClick={(e) => e.stopPropagation()}>
                  <div
                    className="w-full mx-auto h-[90vh] flex items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <PostBox
                      post={post}
                      showPopup={showPopup}
                      setShowPopup={setShowPopup}
                      isPopup
                      onUpdate={setPost}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          , document.body )
        </>
      )}
    </>
  );
};

export default PostBoxHandler;
