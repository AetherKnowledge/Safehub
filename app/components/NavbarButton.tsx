"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ButtonProps {
  color?: string;
  children?: string;
  href: string;
}

const NavbarButton = ({ children, href }: ButtonProps) => {
  const location = usePathname();
  const isActive = location === href || location.startsWith(href + "/");
  const text = children || "Button";

  return (
    <div className="inline-flex flex-col items-center ">
      <div className="relative">
        <Link
          href={href}
          className="btn-ghost text-base-content hover:text-base-content font-medium"
        >
          {text}
        </Link>
        {isActive && (
          <div className="absolute left-0 right-0 -bottom-1 h-[5px] bg-base-content rounded-full" />
        )}
      </div>
    </div>
  );
};

export default NavbarButton;
