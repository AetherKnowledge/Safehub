import { FaCopyright } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-base-300 flex flex-row items-center justify-center p-4 gap-2">
      <FaCopyright className="w-5 h-5" />
      Copyright - All rights reserved
    </div>
  );
};

export default Footer;
