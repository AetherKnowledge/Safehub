import { CommentData } from "@/lib/schemas";
import { imageGenerator } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import MessageBubble from "../Chats/Chatbox/MessageBubble";
import { addComment, PostComment } from "./PostActions";

type PostCommentsProps = {
  id: string;
  authorName: string;
  authorImage?: string;
  comments: PostComment[];
  setComments: React.Dispatch<React.SetStateAction<PostComment[]>>;
};

const PostComments = ({
  id,
  authorName,
  authorImage,
  comments,
  setComments,
}: PostCommentsProps) => {
  const session = useSession();

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
  }, [comments]);

  return (
    <>
      {/* Comments */}
      <div
        className="flex-1 min-h-0 max-h-[40vh] overflow-y-auto px-5 flex flex-col "
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
              const prevComments = [...comments];

              setComments([
                ...comments,
                {
                  id:
                    comments.length > 0
                      ? (
                          parseInt(comments[comments.length - 1].id) + 1
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
                },
              ]);
              try {
                await addComment({ postId: id, content: value } as CommentData);
              } catch (error) {
                console.log(error);
                setComments(prevComments);
              }
              inputRef.current.value = "";
            }
          }}
        />
      </div>
    </>
  );
};

export default PostComments;
