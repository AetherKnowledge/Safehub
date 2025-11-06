"use client";

import { UserType } from "@/app/generated/prisma";
import { deletePost, PostData } from "@/app/pages/Post/PostActions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { usePopup } from "../Popup/PopupProvider";
import PostModal from "./PostModal";

const PostDropdown = ({ post }: { post: PostData }) => {
  const session = useSession();
  const [showModal, setShowModal] = useState(false);
  const statusPopup = usePopup();
  const router = useRouter();

  async function handleDelete() {
    const confirmed = await statusPopup.showYesNo(
      `Are you sure you want to delete ${post.title}?`
    );

    if (!confirmed) return;

    statusPopup.showLoading("Deleting post...");
    await deletePost(post.id)
      .then(() => {
        statusPopup.showSuccess("Post deleted!");
        router.refresh();
      })
      .catch((error) => {
        statusPopup.showError(
          "An error occurred. Please try again." + (error?.message || "")
        );
      });
  }

  return (
    <div className="dropdown dropdown-end">
      <HiDotsHorizontal
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-xs px-1 cursor-pointer"
      />
      {session?.data?.user.type === UserType.Admin && (
        <>
          <ul
            tabIndex={-1}
            className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
          >
            <li>
              <button onClick={() => setShowModal(true)}>Edit</button>
            </li>
            <li>
              <button onClick={handleDelete}>Delete</button>
            </li>
          </ul>
          {showModal && (
            <PostModal post={post} onClose={() => setShowModal(false)} />
          )}
        </>
      )}
    </div>
  );
};

export default PostDropdown;
