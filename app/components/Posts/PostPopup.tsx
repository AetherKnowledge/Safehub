"use client";
import { imageGenerator } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useEffect, useOptimistic, useRef } from "react";
import { AiFillDislike, AiFillHeart, AiFillLike } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import MessageBubble from "../Chats/Chatbox/MessageBubble";
import ImageGrid from "./ImageGrid";
import { addComment, dislikePost, likePost, PostProps } from "./PostActions";
import StatButton from "./StatsButton";

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
}: PostProps) => {
  const session = useSession();
  const [optimisticComments, setOptimisticComments] = useOptimistic(
    comments,
    (state, newComment) => {
      return [
        ...state,
        newComment as {
          id: string;
          createdAt: string;
          user: { name: string; image?: string | undefined };
          content: string;
        },
      ];
    }
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const container = messageContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [optimisticComments]);

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
              onChange={async (value: boolean) => {}}
              icon={FaCommentAlt}
              value={{ count: optimisticComments.length, selected: false }}
              label="Comments"
              color="text-yellow-500"
              commentBtn
            />
          </div>
        </div>
        <div className="divider my-[-4]" />

        {/* Comments */}
        <div
          className="flex-1 min-h-0 max-h-[40vh] overflow-y-auto px-5 flex flex-col "
          ref={messageContainerRef}
        >
          <div className="flex flex-col h-full">
            {optimisticComments.map((comment) => (
              <MessageBubble
                key={comment.id}
                name={comment.user.name}
                image={comment.user.image}
                content={comment.content}
                createdAt={comment.createdAt}
                showStatus={false}
              />
            ))}
          </div>
        </div>

        {/* COMMENT INPUT */}
        <div className="divider my-[-4]" />
        <div className="flex items-center gap-2">
          <div className="avatar">
            {imageGenerator(authorName, 10, authorImage || undefined)}
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Write your comment"
            className="input input-bordered input-sm w-full outline-none ring-0 text-base-content focus-within:outline-none focus-within:ring-0"
            onKeyDown={async (e) => {
              if (
                e.key === "Enter" &&
                inputRef.current &&
                inputRef.current.value.trim()
              ) {
                const value = inputRef.current.value.trim();

                setOptimisticComments({
                  id:
                    optimisticComments.length > 0
                      ? (
                          parseInt(
                            optimisticComments[optimisticComments.length - 1].id
                          ) + 1
                        ).toString()
                      : "1",
                  user: {
                    name:
                      session.data?.user.name ||
                      session.data?.user.email ||
                      "You",
                    image: session.data?.user.image || undefined,
                  },
                  content: value,
                  createdAt: new Date().toISOString(),
                });
                await addComment(id, value);
                inputRef.current.value = "";
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PostPopup;
