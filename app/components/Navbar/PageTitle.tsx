"use client";
import { usePathname } from "next/navigation";

const PageTitle = () => {
  const pathname = usePathname();
  const rawTitle = pathname.split("/")[2] || "Dashboard";

  const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

  return <h1 className="flex text-2xl font-bold text-primary">{title}</h1>;
};

export default PageTitle;
