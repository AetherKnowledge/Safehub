import { FaAngleDown } from "react-icons/fa6";

const Collapse = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children?: React.ReactNode;
}) => {
  const inputId = id;
  return (
    <div className="collapse rounded-none">
      {/* hide the checkbox visually but keep it accessible; use it as the peer */}
      <input id={inputId} type="checkbox" className="peer sr-only" />
      {/* clicking the title toggles the checkbox so peer-checked styles apply */}
      <label
        htmlFor={inputId}
        className="collapse-title font-semibold p-0 flex items-center justify-between pr-2 cursor-pointer select-none peer-checked:[&_svg]:rotate-180"
      >
        <p>{title}</p>
        <FaAngleDown className="transition-transform duration-300 ease-in-out" />
      </label>
      <div className="collapse-content text-sm p-0">{children}</div>
    </div>
  );
};

export default Collapse;
