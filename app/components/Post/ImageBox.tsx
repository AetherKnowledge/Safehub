"use client";

import Image from "next/image";
import { useState } from "react";
import NoImage from "../Images/NoImage";

const ImageBox = ({
  src,
  alt,
  isPopup = false,
}: {
  src: string;
  alt?: string;
  isPopup?: boolean;
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <NoImage className="rounded-sm" text="Image Failed to Load" />;
  }

  return (
    <Image
      src={src}
      alt={alt || "Image"}
      fill
      className={isPopup ? "object-contain" : "object-cover"}
      onError={() => setHasError(true)}
    />
  );
};

export default ImageBox;
