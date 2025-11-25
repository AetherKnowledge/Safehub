import { CommentData } from "@/lib/schemas";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import MessageBubble from "../../pages/Chats/ChatBox/MessageBubble";
import { addComment, PostData } from "../../pages/Post/PostActions";
import Divider from "../Divider";
import { usePopup } from "../Popup/PopupProvider";
import UserImage from "../UserImage";

const PostComments = ({
  post,
  onUpdate,
}: {
  post: PostData;
  onUpdate?: (post: PostData) => void;
}) => {
  const session = useSession();
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
  }, [post.comments]);

  async function onCommentAdded(text: string) {
    const prevComments = [...post.comments];

    onUpdate?.({
      ...post,
      comments: [
        ...prevComments,
        {
          id:
            prevComments.length > 0
              ? (
                  parseInt(prevComments[prevComments.length - 1].id) + 1
                ).toString()
              : "1",
          user: {
            name: session.data?.user.name || session.data?.user.email || "You",
            image: session.data?.user.image || undefined,
          },
          content: text,
          createdAt: new Date(),
        },
      ],
    });

    await addComment({
      postId: post.id,
      content: text,
    } as CommentData).catch((error) => {
      statusPopup.showError("Failed to add comment" + (error?.message || ""));
      onUpdate?.({
        ...post,
        comments: prevComments,
      });
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Comments */}
      <Divider />
      <div className="bg-base-200/20 rounded-lg my-2 border border-base-content/5">
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/5 to-transparent border-b border-base-content/5">
          <svg
            className="w-4 h-4 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="text-sm font-semibold text-base-content/80">
            Comments ({post.comments.length})
          </span>
        </div>
        <div
          className="flex-1 min-h-0 max-h-[30vh] overflow-y-auto px-4 py-2 flex flex-col scrollbar-thin"
          ref={messageContainerRef}
        >
          <div className="flex flex-col h-full">
            {post.comments.length > 0 ? (
              post.comments.map((comment) => {
                const isImageFromSelf =
                  session.data?.user.image === comment.user.image;

                return (
                  <MessageBubble
                    key={comment.id}
                    name={comment.user.name}
                    image={comment.user.image}
                    content={comment.content}
                    createdAt={comment.createdAt}
                    showStatus={false}
                    anonymous={!isImageFromSelf}
                    self={isImageFromSelf}
                  />
                );
              })
            ) : (
              <div className="flex items-center justify-center h-20 text-base-content/40 text-sm">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* COMMENT INPUT */}
      <div className="flex items-center gap-3 mt-2 bg-base-200/30 rounded-lg p-2 border border-base-content/5">
        <div className="avatar ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100 rounded-full">
          <UserImage
            name={session.data?.user.name || session.data?.user.email || "You"}
            width={10}
            src={session.data?.user.image || undefined}
          />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Write your comment..."
          className="input input-bordered input-sm w-full outline-none ring-0 text-base-content focus:border-primary transition-colors bg-base-100"
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
