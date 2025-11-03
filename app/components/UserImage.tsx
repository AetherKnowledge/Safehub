import Image from "next/image";

const UserImage = ({
  name,
  width,
  src,
  bordered,
  borderColor = "primary",
  borderWidth = 2,
}: {
  name: string;
  width: number;
  src?: string | null;
  bordered?: boolean;
  borderColor?: string;
  borderWidth?: number;
}) => {
  const imageWidth = `w-${width}`;
  const imageHeight = `h-${width}`;

  return (
    <>
      {src ? (
        <div
          className={`border-${borderWidth} rounded-full ${
            bordered ? ` border-${borderColor}` : "border-transparent"
          }`}
        >
          <Image
            src={src}
            alt={name ?? "counselor Avatar"}
            className={`rounded-full`}
            width={width * 4}
            height={width * 4}
          />
        </div>
      ) : (
        <div
          className={`rounded-full border-${borderWidth} ${
            bordered ? `border-${borderColor}` : "border-transparent"
          }`}
        >
          <div
            role="button"
            tabIndex={0}
            style={{ fontSize: `calc(var(--spacing) * ${width / 2})` }}
            className={`${imageWidth} ${imageHeight} rounded-full bg-gray-500 text-white flex items-center justify-center font-bold hover:brightness-90 active:brightness-75 transition duration-150 select-none cursor-pointer`}
          >
            {name.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
    </>
  );
};

export default UserImage;
