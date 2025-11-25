"use client";

import ImageWithFallback from "@/app/components/Images/ImageWithFallback";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import { Hotline, UserType } from "@/app/generated/prisma";
import { useRouter } from "next/navigation";
import { MdImageNotSupported } from "react-icons/md";
import { deleteHotline } from "./HotlineActions";
import NumberButton from "./NumberButton";

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
    const confirmed = await statusPopup.showYesNo(
      `Are you sure you want to delete ${hotline.name}?`
    );

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
    <div className="card rounded-xl bg-gradient-to-br from-base-100 to-base-200/50 shadow-xl border border-base-content/5 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
      <figure className="pt-6 px-6">
        {hotline.image ? (
          <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/20 ring-offset-2 ring-offset-base-100">
            <ImageWithFallback
              width={128}
              height={128}
              src={hotline.image}
              alt={hotline.name}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="w-32 h-32 rounded-full bg-base-300/30 flex items-center justify-center">
            <MdImageNotSupported className="text-base-content/30" size={64} />
          </div>
        )}
      </figure>
      <div className="card-body items-center text-center flex-1 flex flex-col">
        <h2 className="card-title text-primary text-xl font-bold mb-2">
          {hotline.name}
        </h2>
        <div className="flex items-center justify-center overflow-y-auto flex-1 px-2">
          <p className="text-center text-sm text-base-content/80 line-clamp-4">
            {hotline.description}
          </p>
        </div>
        <div className="w-full mt-auto space-y-3">
          <NumberButton contactNumber={hotline.phone} />
          <div
            className={`card-actions w-full flex ${
              userType === UserType.Admin
                ? "justify-between flex-wrap gap-2"
                : "justify-center"
            }`}
          >
            <a
              href={hotline.website || "/user/hotline"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm rounded-lg flex-1 min-w-[120px] shadow-md hover:shadow-lg transition-all"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              Visit Website
            </a>
            {userType === UserType.Admin && (
              <div className="flex gap-2 flex-1 min-w-[120px]">
                <button
                  className="btn btn-outline btn-primary btn-sm rounded-lg flex-1 hover:shadow-md transition-all"
                  onClick={() => onEdit?.(hotline)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-outline btn-error btn-sm rounded-lg flex-1 hover:shadow-md transition-all"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotlineCard;
