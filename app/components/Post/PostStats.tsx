"use client";
import { UserType } from "@/app/generated/prisma";
import { useSession } from "next-auth/react";
import { FaRegComment, FaRegHeart } from "react-icons/fa6";
import { PostData, dislikePost, likePost } from "../../pages/Post/PostActions";
import PostDropdown from "./PostDropdown";
import StatButton from "./StatsButton";

//TODO: Change like to heart
// TODO: Readd count
// TODO: Sync state from server

type PostStatsProps = {
  post: PostData;
  showPopup: boolean;
  setShowPopup: (value: boolean) => void;
  onUpdate?: (post: PostData) => void;
};

const PostStats = ({
  post,
  showPopup,
  setShowPopup,
  onUpdate,
}: PostStatsProps) => {
  const session = useSession();

  const changeStatus = async (value: boolean, isLike: boolean) => {
    if (isLike) {
      await likePost(post.id, value);

      onUpdate &&
        onUpdate({
          ...post,
          likeStats: {
            count:
              post.likeStats.count +
              (value ? 1 : -1) +
              (post.dislikeStats.selected ? 1 : 0),
            selected: value,
          },
          dislikeStats: {
            count:
              post.dislikeStats.count - (post.dislikeStats.selected ? 1 : 0),
            selected: post.dislikeStats.selected && !value,
          },
        });
    } else {
      if (post.likeStats.selected) {
        onUpdate &&
          onUpdate({
            ...post,
            dislikeStats: {
              count: post.dislikeStats.count + (value ? 1 : -1),
              selected: value,
            },
            likeStats: {
              count: post.likeStats.count - (post.likeStats.selected ? 1 : 0),
              selected: post.likeStats.selected && !value,
            },
          });
      }
      await dislikePost(post.id, value);
    }
  };
  return (
    <div className="flex justify-between items-center text-sm text-base-content/80 bg-base-200/30 rounded-lg p-3 border border-base-content/5">
      <div className="flex items-start gap-3 w-full">
        <StatButton
          onChange={async (value: boolean) => {
            changeStatus(value, true);
          }}
          icon={FaRegHeart}
          value={post.likeStats}
          label="Likes"
          color="text-error"
        />
        <StatButton
          onChange={async (value: boolean) => {
            setShowPopup(value);
          }}
          icon={FaRegComment}
          value={{ count: post.comments.length, selected: showPopup }}
          label="Comments"
          color="text-primary"
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
        {session?.data?.user.type === UserType.Admin && (
          <PostDropdown post={post} />
        )}
      </div>
    </div>
  );
};

export default PostStats;
