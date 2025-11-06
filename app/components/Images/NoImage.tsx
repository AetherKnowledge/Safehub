import { MdOutlineImageNotSupported } from "react-icons/md";

const NoImage = ({
  className,
  text,
}: {
  className?: string;
  text?: string;
}) => {
  return (
    <div
      className={`flex flex-wrap items-center justify-center h-full text-base-content bg-base-200 ${className} p-2`}
    >
      <MdOutlineImageNotSupported size={48} />
      <span>{text || "No Image Available"}</span>
    </div>
  );
};

export default NoImage;
