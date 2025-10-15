"use client";
import ImageInput from "@/app/components/Input/ImageInput";
import InputBox from "@/app/components/Input/InputBox";
import TextArea from "@/app/components/Input/TextArea";
import ModalBase from "@/app/components/Popup/ModalBase";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import { Hotline } from "@/app/generated/prisma";
import { UploadHotlineData } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { FaPhone } from "react-icons/fa";
import { FaLink } from "react-icons/fa6";
import { GrEmergency } from "react-icons/gr";
import { upsertHotline } from "./HotlineActions";

const HotlineModal = ({
  hotline,
  onClose,
}: {
  hotline?: Hotline | null;
  onClose: () => void;
}) => {
  const statusPopup = usePopup();
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();

  const initialImageList = useMemo(() => {
    return hotline?.image ? [hotline.image] : [];
  }, [hotline?.image]);

  const handleImageChange = useCallback((items: Array<File | string>) => {
    // Prefer the first File in the list if any; otherwise keep null.
    const file = items.find((it): it is File => it instanceof File) || null;
    setImage(file);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const uploadData: UploadHotlineData = {
      id: hotline?.id,
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      description: formData.get("description") as string,
      website: formData.get("website") as string,
      image: image && image.size > 0 ? image : hotline?.image || undefined,
    };

    statusPopup.showLoading(
      hotline ? "Saving hotline..." : "Creating hotline..."
    );
    await upsertHotline(uploadData)
      .then(() => {
        statusPopup.showSuccess(
          hotline ? "Hotline updated!" : "Hotline created!"
        );
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
          {hotline ? "Edit Hotline" : "Add Hotline"}
        </h2>
        <div className="flex flex-col flex-1 bg-base-200 px-3 pb-2 w-full">
          <InputBox
            legend="Hotline Name"
            name="name"
            placeholder="Name"
            defaultValue={hotline?.name}
            bgColor="bg-base-100"
            icon={GrEmergency}
          />
          <InputBox
            legend="Hotline Number"
            name="phone"
            type="tel"
            placeholder="Phone Number"
            defaultValue={hotline?.phone}
            bgColor="bg-base-100"
            icon={FaPhone}
          />
          <InputBox
            legend="Website"
            name="website"
            placeholder="https://"
            defaultValue={hotline?.website || ""}
            bgColor="bg-base-100"
            type="url"
            icon={FaLink}
          />
          <ImageInput
            legend="Image"
            name="image"
            initial={initialImageList}
            onChange={handleImageChange}
          />
          <TextArea
            legend="Description"
            name="description"
            placeholder="Text here..."
            defaultValue={hotline?.description || ""}
            bgColor="bg-base-100"
          />
        </div>
        <div className="flex flex-row justify-between items-center px-3 mt-3">
          <button type="submit" className="btn btn-primary">
            {hotline ? "Save Changes" : "Add Hotline"}
          </button>
          <button className="btn btn-error" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </ModalBase>
  );
};

export default HotlineModal;
