"use client";

import Image from "next/image";
import { useState } from "react";
import NoImage from "../Images/NoImage";

const ImageBox = ({ src, alt }: { src: string; alt?: string }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <NoImage className="rounded-sm" text="Image Failed to Load" />;
  }

  return (
    <Image
      src={src}
      alt={alt || "Image"}
      fill
      className="object-cover"
      onError={() => setHasError(true)}
    />
  );
};

export default ImageBox;
