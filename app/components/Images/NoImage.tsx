import { MdOutlineImageNotSupported } from "react-icons/md";

const NoImage = ({
  className,
  text,
  noErrorText = false,
}: {
  className?: string;
  text?: string;
  noErrorText?: boolean;
}) => {
  return (
    <div
      className={`flex flex-wrap items-center justify-center h-full text-base-content bg-base-200 ${className} p-2`}
    >
      <MdOutlineImageNotSupported size={48} />
      {!noErrorText && <span>{text || "No Image Available"}</span>}
    </div>
  );
};

export default NoImage;
