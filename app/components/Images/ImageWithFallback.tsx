"use client";

import Image from "next/image";
import { ComponentProps, useState } from "react";
import NoImage from "../Images/NoImage";

const ImageWithFallback = (
  props: ComponentProps<typeof Image> & {
    isPopup?: boolean;
    errorText?: string;
    noErrorText?: boolean;
  }
) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError) {
    return (
      <NoImage
        className="rounded-sm"
        text={props.errorText || "Image Failed to Load"}
        noErrorText={props.noErrorText}
      />
    );
  }

  return (
    <>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center skeleton z-10">
          <span className="text-base-content/20">Loading...</span>
        </div>
      )}

      <Image
        {...props}
        className={`${
          props.isPopup ? "object-contain" : "object-cover"
        } transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoadingComplete={(img) => {
          setIsLoading(false);
          props.onLoadingComplete?.(img);
        }}
        onError={(err) => {
          setIsLoading(false);
          setHasError(true);
          props.onError?.(err);
        }}
      />
    </>
  );
};

export default ImageWithFallback;
