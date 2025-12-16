import { Hotline } from "@/app/generated/prisma/browser";
import Link from "next/link";
import { Suspense } from "react";
import { SlCallIn } from "react-icons/sl";
import { Await } from "react-router-dom";
import { getThreeHotlines as getSomeHotlines } from "../../Hotline/HotlineActions";
import HotlineSVG from "./HotlineSVG";

type HotlineBarProps = {
  className?: string;
};

const HotlineBar = ({ className }: HotlineBarProps) => {
  return (
    <div
      className={`${className} bg-linear-to-br from-base-100 to-base-200/50 p-5 rounded-xl text-left text-base-content border border-base-content/5`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 bg-primary rounded-full"></div>
        <h2 className="font-bold text-lg text-base-content">
          Emergency Hotlines
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 min-h-20">
        <div className="flex flex-col items-center justify-center text-center max-h-70 lg:max-w-80 bg-base-200/30 rounded-lg p-4">
          <p className="text-sm text-base-content/70 mb-3">
            Need emergency help? Call a hotline, we might be able to help ❤️
          </p>
          <HotlineSVG />
        </div>
        <Suspense fallback={<HotlineTableSkeleton />}>
          <Await resolve={getSomeHotlines()}>
            {(hotlines) => <HotlineTable hotlines={hotlines} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
};

const HotlineTableSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-70 min-h-0 items-center">
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="flex shrink-0 skeleton rounded-lg h-[58px] w-full"
        />
      ))}
    </div>
  );
};

const HotlineTable = async ({ hotlines }: { hotlines: Hotline[] }) => {
  return (
    <>
      {hotlines.length === 0 ? (
        <p>No hotlines available.</p>
      ) : (
        <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-70 min-h-0">
          {hotlines.map((hotline) => (
            <Link
              key={hotline.id}
              className="flex flex-row border border-base-content/10 rounded-lg p-3 items-center justify-center gap-3
              hover:bg-primary/5 hover:border-primary/30 active:bg-primary/10 transition-all duration-200 hover:shadow-md group
              "
              href={hotline.website || `/user/hotline`}
              target="_blank"
            >
              <div className="btn btn-primary btn-sm rounded-full p-2 group-hover:scale-110 transition-transform">
                <SlCallIn className="w-4 h-4" />
              </div>
              <p className="font-semibold w-full text-sm group-hover:text-primary transition-colors">
                {hotline.name}
              </p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default HotlineBar;
