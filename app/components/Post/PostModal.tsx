"use client";

import { PostData, upsertPost } from "@/app/pages/Post/PostActions";
import { UploadPostData } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import ImageInput from "../Input/ImageInput";
import TextArea from "../Input/TextArea";
import TextBox from "../Input/TextBox";
import ModalBase from "../Popup/ModalBase";
import { usePopup } from "../Popup/PopupProvider";

type Props = {
  post?: PostData;
  onClose: () => void;
};

const PostModal = ({ post, onClose }: Props) => {
  const [images, setImages] = useState<Array<File | string>>([]);
  const statusPopup = usePopup();
  const router = useRouter();

  const initialImageList = useMemo(() => {
    return post?.images;
  }, [post?.images]);

  const handleImageChange = useCallback((items: Array<File | string>) => {
    setImages(items);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const uploadData: UploadPostData = {
      id: post?.id,
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      images: images && images.length > 0 ? images : post?.images,
    };

    statusPopup.showLoading(post ? "Saving post..." : "Creating post...");
    await upsertPost(uploadData)
      .then(() => {
        statusPopup.showSuccess(post ? "Post updated!" : "Post created!");
        router.refresh();
        onClose();
      })
      .catch((error) => {
        console.error(error);
        statusPopup.showError(
          "An error occurred. Please try again. " +
            (error?.message || "") +
            formData.get("image")
        );
      });
  }

  return (
    <ModalBase onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col bg-base-100 text-base-content shadow-2xl rounded-2xl border border-base-300 w-[90vw] max-w-2xl max-h-[85vh]"
      >
        <div className="px-5 pt-4 pb-3 border-b border-base-300 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-primary mb-1">
              SafeHub · LCUP
            </p>
            <h2 className="text-lg sm:text-xl font-semibold leading-snug">
              {post ? "Edit post" : "Create a new post"}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-base-content/70 max-w-xl">
              Share updates, announcements, or helpful information with LCUP
              students.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-xs btn-ghost text-base-content/80"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4 bg-base-200/60 flex-1 overflow-y-auto">
          <div className="rounded-xl bg-base-200 px-3 py-3 space-y-3">
            <TextBox
              legend="Title"
              name="title"
              placeholder="Title here..."
              defaultValue={post?.title}
              bgColor="bg-base-100"
            />
            <ImageInput
              legend="Images"
              name="images"
              defaultValue={initialImageList}
              onChange={handleImageChange}
              multiple
            />
            <TextArea
              legend="Content"
              name="content"
              placeholder="Text here..."
              defaultValue={post?.content}
              bgColor="bg-base-100"
            />
          </div>
        </div>

        <div className="px-5 pb-4 pt-2 border-t border-base-300 flex justify-end gap-3">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            {post ? "Save changes" : "Publish post"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}

export default PostModal;
