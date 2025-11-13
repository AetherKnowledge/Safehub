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
    <ModalBase>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-130 rounded-lg bg-base-100 py-3"
      >
        <h2 className="text-2xl font-bold text-center text-primary">
          {post ? "Edit Post" : "Add Post"}
        </h2>
        <div className="flex flex-col flex-1 bg-base-200 px-3 pb-2 w-full">
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
        <div className="flex flex-row justify-between items-center px-3 mt-3">
          <button type="submit" className="btn btn-primary">
            {post ? "Save Changes" : "Add Post"}
          </button>
          <button className="btn btn-error" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </ModalBase>
  );
};

export default PostModal;
