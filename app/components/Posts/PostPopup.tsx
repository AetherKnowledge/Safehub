"use client";
import { HiDotsHorizontal } from "react-icons/hi";
import ImageGrid from "./ImageGrid";
import { PostComment, PostProps } from "./PostActions";
import PostComments from "./PostComments";
import PostStats from "./PostStats";

type PostPopupProps = PostProps & {
  setComments: React.Dispatch<React.SetStateAction<PostComment[]>>;
  showPopup: boolean;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
};

const PostPopup = ({
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
  setComments,
  showPopup,
  setShowPopup,
}: PostPopupProps) => {
  console.log("PostPopup rendered"); // <-- Add this to verify logging works

  return (
    <div
      className={`card bg-base-100 shadow-br max-w-2xl mx-auto my-8 max-h-[80vh] overflow-hidden`}
    >
      <div className="card-body flex flex-col max-h-[80vh]">
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
        <div className="overflow-y-auto max-h-[30vh]">
          <p className="text-sm text-base-content">{content}</p>
        </div>

        {/* IMAGE GRID */}
        <ImageGrid images={images} />

        {/* STATS */}
        <PostStats
          id={id}
          likesStats={likesStats}
          dislikesStats={dislikesStats}
          comments={comments}
          showPopup={showPopup}
          setShowPopup={setShowPopup}
        />

        {/* Comments */}
        <PostComments
          id={id}
          authorName={authorName}
          authorImage={authorImage}
          comments={comments}
          setComments={setComments}
        />
      </div>
    </div>
  );
};

export default PostPopup;
