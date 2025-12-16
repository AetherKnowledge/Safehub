"use client";

import Image from "next/image";
import { useState } from "react";

const UserImage = ({
  name,
  width,
  src,
  bordered,
  borderWidth = 2,
  onClick,
}: {
  name: string;
  width: number;
  src?: string | null;
  bordered?: boolean;
  borderWidth?: number;
  onClick?: () => void;
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative shrink-0 border rounded-full ${
        bordered
          ? `border-primary bg-primary`
          : "border-transparent bg-transparent"
      } 
          
      `}
      style={{
        width: `calc(var(--spacing) * ${width})`,
        height: `calc(var(--spacing) * ${width})`,
        borderWidth: `${borderWidth}px`,
      }}
      onClick={onClick}
    >
      {src && !hasError ? (
        <Image
          src={src}
          alt={name ?? "counselor Avatar"}
          className={`rounded-full transition duration-150 ${
            onClick
              ? "hover:brightness-90 active:brightness-75 cursor-pointer"
              : ""
          }`}
          onError={(err) => {
            setHasError(true);
          }}
          fill
        />
      ) : (
        <div
          role="button"
          tabIndex={0}
          className={`rounded-full w-full h-full bg-gray-500 text-white flex items-center justify-center font-bold select-none transition duration-150 ${
            onClick
              ? "hover:brightness-90 active:brightness-75 cursor-pointer"
              : ""
          }`}
          style={{
            fontSize: `calc(var(--spacing) * ${width / 2})`,
          }}
        >
          {name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default UserImage;
