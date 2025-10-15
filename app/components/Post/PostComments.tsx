import { CommentData } from "@/lib/schemas";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import MessageBubble from "../../pages/Chats/ChatBox/MessageBubble";
import {
  addComment,
  PostComment,
  PostData,
} from "../../pages/Post/PostActions";
import Divider from "../Divider";
import { usePopup } from "../Popup/PopupProvider";
import UserImage from "../UserImage";

const PostComments = ({ post }: { post: PostData }) => {
  const session = useSession();
  const [comments, setComments] = useState<PostComment[]>(post.comments || []);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const statusPopup = usePopup();

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
  }, [comments]);

  async function onCommentAdded(text: string) {
    const prevComments = [...comments];

    setComments([
      ...comments,
      {
        id:
          comments.length > 0
            ? (parseInt(comments[comments.length - 1].id) + 1).toString()
            : "1",
        user: {
          name: session.data?.user.name || session.data?.user.email || "You",
          image: session.data?.user.image || undefined,
        },
        content: text,
        createdAt: new Date(),
      },
    ]);

    await addComment({
      postId: post.id,
      content: text,
    } as CommentData).catch((error) => {
      statusPopup.showError("Failed to add comment" + (error?.message || ""));
      setComments(prevComments);
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Comments */}
      <Divider />
      <div
        className="flex-1 min-h-0 max-h-[30vh] overflow-y-auto px-5 flex flex-col "
        ref={messageContainerRef}
      >
        <div className="flex flex-col h-full">
          {comments.map((comment) => (
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
      <Divider />

      {/* COMMENT INPUT */}

      <div className="flex items-center gap-2 mt-2">
        <div className="avatar">
          <UserImage
            name={post.author.name}
            width={10}
            src={post.author.image || undefined}
          />
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
              onCommentAdded(value);
              inputRef.current.value = "";
            }
          }}
        />
      </div>
    </div>
  );
};

export default PostComments;
