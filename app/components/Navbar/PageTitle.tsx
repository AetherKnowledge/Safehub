"use client";
import { usePathname } from "next/navigation";

const PageTitle = () => {
  const pathname = usePathname();
  const rawTitle = pathname.split("/")[2] || "Dashboard";
  const rawTitleWords = rawTitle.split("-").map((word) => capitalizeWord(word));
  const rawTitleFormatted = rawTitleWords.join(" ");

  return (
    <h1 className="flex text-2xl font-bold text-primary">
      {rawTitleFormatted}
    </h1>
  );
};

function capitalizeWord(word: string) {
  if (word.length === 2) {
    return word.toUpperCase();
  }

  return word.charAt(0).toUpperCase() + word.slice(1);
}

export default PageTitle;
