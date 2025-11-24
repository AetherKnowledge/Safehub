import Image from "next/image";
import UserButton from "./UserButton";

const Navbar = () => {
  return (
    <div className="navbar fixed top-0 left-0 w-full z-20 bg-base-100/95 backdrop-blur border-b border-base-200 px-4 lg:px-8">
      <div className="navbar-start gap-2">
        <Image
          src="/images/safehub.svg"
          alt="SafeHub logo"
          width={120}
          height={60}
          priority
        />
        <span className="hidden sm:inline text-xs font-medium uppercase tracking-[0.2em] text-base-content/60">
          LCUP · SafeHub
        </span>
      </div>

      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1 text-sm font-medium text-base-content/80">
          <li>
            <a href="#hero" className="hover:text-primary">
              Home
            </a>
          </li>
          <li>
            <a href="#about" className="hover:text-primary">
              About
            </a>
          </li>
          <li>
            <a href="#staff" className="hover:text-primary">
              Staff
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-primary">
              Contact
            </a>
          </li>
        </ul>
      </div>

      <div className="navbar-end gap-4">
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
