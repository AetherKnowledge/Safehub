import Link from "next/link";
import { FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import SafehubIcon from "../Images/SafehubIcon";

const ContactUs = () => {
  return (
    <div className="flex flex-col text-center items-center justify-center w-full h-full gap-8 py-12 pb-0">
      <h2 className="text-3xl font-bold">CONTACT US</h2>
      <div className="flex flex-row items-center justify-center gap-12 w-full max-w-4xl px-6">
        <SafehubIcon className="w-80" />
        <div className="flex flex-col gap-6 items-center">
          {/* Facebook */}
          <div className="flex flex-col items-center text-center gap-2">
            <FaFacebook className="text-5xl" />
            <p className="font-semibold">Reach us out to Facebook</p>
            <Link
              className="text-sm opacity-70"
              href="https://facebook.com/sws.lcup.college"
            >
              https://facebook.com/sws.lcup.college
            </Link>
          </div>

          {/* OR Separator */}
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 h-px bg-base-content" />
            <span className="font-semibold">OR</span>
            <div className="flex-1 h-px bg-base-content" />
          </div>

          {/* Email */}
          <button className="flex flex-col items-center text-center gap-0">
            <MdEmail className="text-5xl" />
            <p className="text font-semibold">Email us</p>
            <p className="text-sm opacity-70">
              lcupguidance.college@email.lcup.edu.ph
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
