import { Hotline } from "@/app/generated/prisma";
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
      className={`${className} bg-base-100 p-2 rounded-lg shadow-br text-left text-base-content`}
    >
      <h2 className="font-semibold text-lg text-base-content px-2">
        Mood Tracking
      </h2>
      <div className="flex flex-row min-h-20">
        <div className="flex flex-col items-center justify-center text-center max-h-70 max-w-80">
          <p className="italic p-4">
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
            <div
              key={hotline.id}
              className="flex flex-row border border-base-300 rounded-lg p-2 items-center justify-center gap-2"
            >
              <div className="btn btn-primary rounded-full p-2">
                <SlCallIn className="w-5 h-5" />
              </div>
              <p className="font-semibold w-full">{hotline.name}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default HotlineBar;
