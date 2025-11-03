"use client";
import ModalBase from "@/app/components/Popup/ModalBase";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type FilePreviewModalProps = {
  src: string;
  onClose?: () => void;
};

const FilePreviewModal = ({ src, onClose }: FilePreviewModalProps) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const session = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(src, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.data?.supabaseAccessToken}`,
          },
        });

        const contentType = response.headers.get("Content-Type");
        setFileType(contentType);
        console.log(contentType);

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    };

    fetchData();

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [src, session.data?.supabaseAccessToken]);

  return (
    <ModalBase onClose={onClose}>
      {blobUrl ? (
        fileType?.includes("pdf") ? (
          <iframe
            src={blobUrl}
            className="w-[80vw] h-[90vh] rounded-lg"
            title="PDF Preview"
          />
        ) : (
          <div className="bg-base-100 p-6 rounded-lg shadow-lg text-center">
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <p className="text-base-content">Unsupported file type</p>
            </div>
          </div>
        )
      ) : (
        <div className="bg-base-100 p-6 rounded-lg shadow-lg text-center">
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <p className="text-base-content">{"Loading..."}</p>
          </div>
        </div>
      )}
    </ModalBase>
  );
};

export default FilePreviewModal;
