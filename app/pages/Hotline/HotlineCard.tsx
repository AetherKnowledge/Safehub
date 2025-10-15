"use client";

import { usePopup } from "@/app/components/Popup/PopupProvider";
import { Hotline, UserType } from "@/app/generated/prisma";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdImageNotSupported } from "react-icons/md";
import NumberButton from "./NumberButton";
import { deleteHotline } from "./HotlineActions";

const HotlineCard = ({
  hotline,
  userType,
  onEdit,
}: {
  hotline: Hotline;
  userType: UserType;
  onEdit?: (hotline: Hotline) => void;
}) => {
  const statusPopup = usePopup();
  const router = useRouter();

  async function handleDelete() {
    const confirmed = await statusPopup
      .showYesNo(`Are you sure you want to delete ${hotline.name}?`)
      .catch((error) => {
        statusPopup.showError(
          "An error occurred. Please try again." + (error?.message || "")
        );
        return false;
      });

    if (!confirmed) return;

    statusPopup.showLoading("Deleting hotline...");
    await deleteHotline(hotline.id)
      .then(() => {
        statusPopup.showSuccess("Hotline deleted!");
        router.refresh();
      })
      .catch((error) => {
        statusPopup.showError(
          "An error occurred. Please try again." + (error?.message || "")
        );
      });
  }

  return (
    <div className="card rounded-lg bg-base-100 w-96 h-120 shadow-lg">
      <figure className="pt-5">
        {hotline.image ? (
          <Image
            width={150}
            height={150}
            src={hotline.image}
            alt={hotline.name}
          />
        ) : (
          <MdImageNotSupported className="text-gray-300" size={150} />
        )}
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title text-primary text-2xl">{hotline.name}</h2>
        <div className="flex items-center justify-center overflow-y-auto h-32">
          <p className="text-center">{hotline.description}</p>
        </div>
        <NumberButton contactNumber={hotline.phone} />
        <div
          className={`card-actions w-full ${
            userType === UserType.Admin ? "justify-between" : "justify-center"
          }`}
        >
          <a
            href={hotline.website || "/user/hotline"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Visit Website
          </a>
          {userType === UserType.Admin && (
            <div className="flex gap-2">
              <button
                className="btn btn-outline btn-primary"
                onClick={() => onEdit?.(hotline)}
              >
                Edit
              </button>
              <button
                className="btn btn-outline btn-error"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotlineCard;
