"use client";
import ImageInput from "@/app/components/Input/ImageInput";
import TextArea from "@/app/components/Input/TextArea";
import TextBox from "@/app/components/Input/TextBox";
import ModalBase from "@/app/components/Popup/ModalBase";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import { Hotline } from "@/app/generated/prisma/browser";
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
              {hotline ? "Edit hotline" : "Add a hotline"}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-base-content/70 max-w-xl">
              Manage important support hotlines so students can quickly reach
              the right services.
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
              legend="Hotline Name"
              name="name"
              placeholder="Name"
              defaultValue={hotline?.name}
              bgColor="bg-base-100"
              icon={GrEmergency}
            />
            <TextBox
              legend="Hotline Number"
              name="phone"
              type="tel"
              placeholder="Phone Number"
              defaultValue={hotline?.phone}
              bgColor="bg-base-100"
              icon={FaPhone}
            />
            <TextBox
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
              defaultValue={initialImageList}
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
            {hotline ? "Save changes" : "Add hotline"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
};

export default HotlineModal;
