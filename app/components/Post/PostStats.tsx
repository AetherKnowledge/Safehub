"use client";
import { useState } from "react";
import { FaRegComment, FaRegHeart } from "react-icons/fa6";
import {
  PostData,
  PostStat,
  dislikePost,
  likePost,
} from "../../pages/Post/PostActions";
import PostDropdown from "./PostDropdown";
import StatButton from "./StatsButton";

//TODO: Change like to heart
// TODO: Readd count
// TODO: Sync state from server

type PostStatsProps = {
  post: PostData;
  showPopup: boolean;
  setShowPopup: (value: boolean) => void;
};

const PostStats = ({ post, showPopup, setShowPopup }: PostStatsProps) => {
  const [likeStats, setLikeStats] = useState<PostStat>(post.likeStats);
  const [dislikeStats, setDislikeStats] = useState<PostStat>(post.dislikeStats);

  const changeStatus = async (value: boolean, isLike: boolean) => {
    if (isLike) {
      setLikeStats({
        count: likeStats.count + (value ? 1 : -1),
        selected: value,
      });
      if (dislikeStats.selected) {
        setDislikeStats({
          count: dislikeStats.count - 1,
          selected: !value,
        });
      }
      await likePost(post.id, value);
    } else {
      setDislikeStats({
        count: dislikeStats.count + (value ? 1 : -1),
        selected: value,
      });
      if (likeStats.selected) {
        setLikeStats({
          count: likeStats.count - 1,
          selected: !value,
        });
      }
      await dislikePost(post.id, value);
    }
  };
  return (
    <div className="flex justify-between items-center text-sm text-base-content/80">
      <div className="flex items-start gap-2 w-full">
        <StatButton
          onChange={async (value: boolean) => {
            changeStatus(value, true);
          }}
          icon={FaRegHeart}
          value={likeStats}
          label="Likes"
          color="text-blue-500"
        />
        <StatButton
          onChange={async (value: boolean) => {
            setShowPopup(value);
          }}
          icon={FaRegComment}
          value={{ count: post.comments.length, selected: showPopup }}
          label="Comments"
          color="text-yellow-500"
          commentBtn
        />
      </div>
      <div className="flex items-end gap-2">
        {/* <StatButton
          onChange={async (value: boolean) => {}}
          icon={FaRegBookmark}
          value={{ count: 4, selected: false }}
          label="Saved"
          className=""
        /> */}
        <PostDropdown post={post} />
      </div>
    </div>
  );
};

export default PostStats;
