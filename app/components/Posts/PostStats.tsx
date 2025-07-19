import { useState } from "react";
import { AiFillDislike, AiFillHeart, AiFillLike } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import { PostComment, PostStat, dislikePost, likePost } from "./PostActions";
import StatButton from "./StatsButton";

type PostStatsProps = {
  id: string;
  likesStats: PostStat;
  dislikesStats: PostStat;
  comments: PostComment[];
  showPopup: boolean;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
};

const PostStats = ({
  id,
  likesStats,
  dislikesStats,
  comments,
  showPopup,
  setShowPopup,
}: PostStatsProps) => {
  const [optimisticLikesStats, setOptimisticLikesStats] =
    useState<PostStat>(likesStats);
  const [optimisticDislikesStats, setOptimisticDislikesStats] =
    useState<PostStat>(dislikesStats);

  const changeStatus = async (value: boolean, isLike: boolean) => {
    if (isLike) {
      setOptimisticLikesStats({
        count: optimisticLikesStats.count + (value ? 1 : -1),
        selected: value,
      });
      if (optimisticDislikesStats.selected) {
        setOptimisticDislikesStats({
          count: optimisticDislikesStats.count - 1,
          selected: !value,
        });
      }
      await likePost(id, value);
    } else {
      setOptimisticDislikesStats({
        count: optimisticDislikesStats.count + (value ? 1 : -1),
        selected: value,
      });
      if (optimisticLikesStats.selected) {
        setOptimisticLikesStats({
          count: optimisticLikesStats.count - 1,
          selected: !value,
        });
      }
      await dislikePost(id, value);
    }
  };
  return (
    <>
      <div className="divider my-[-4]" />
      <div className="flex justify-between items-center text-sm text-base-content/80">
        <div className="grid grid-cols-4 gap-4 items-center w-full">
          <StatButton
            onChange={async (value: boolean) => {
              changeStatus(value, true);
            }}
            icon={AiFillLike}
            value={optimisticLikesStats}
            label="Likes"
            color="text-blue-500"
          />
          <StatButton
            onChange={async (value: boolean) => {
              changeStatus(value, false);
            }}
            icon={AiFillDislike}
            value={optimisticDislikesStats}
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
      <div className="divider my-[-4]" />
    </>
  );
};

export default PostStats;
