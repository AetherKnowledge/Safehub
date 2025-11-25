"use client";
import Image from "next/image";
import { ComponentProps, useState } from "react";
import { MdOutlineImageNotSupported } from "react-icons/md";

const ImageWithFallback = (props: ComponentProps<typeof Image>) => {
  const [hasError, setHasError] = useState(false);

  return (
    <>
      {hasError ? (
        <MdOutlineImageNotSupported size={props.width || 48} />
      ) : (
        <Image {...props} onError={() => setHasError(true)} />
      )}
    </>
  );
};

export default ImageWithFallback;
