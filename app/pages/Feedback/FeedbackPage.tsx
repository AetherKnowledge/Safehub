import RatingSummary from "@/app/components/RatingSummary";
import { getAllFeedbackForCounselor } from "@/app/pages/Feedback/FeedbackActions";
import { RiGeminiFill } from "react-icons/ri";
import UserFeedback from "./UserFeedback";

const FeedbackPage = async () => {
  const feedbacks = await getAllFeedbackForCounselor();

  return (
    <div className="flex flex-col gap-3 flex-1 min-h-0">
      <div className="flex flex-col xl:flex-row gap-3 ">
        <div className="flex flex-col bg-base-100 shadow-br rounded p-3 gap-3 w-full h-[244px]">
          <div className="flex flex-row items-center gap-3">
            <RiGeminiFill className="text-3xl text-primary" />
            <h2 className="font-semibold text-2xl">
              AI summary Review & Suggestions
            </h2>
          </div>
          <div className="flex border border-base-content/40 w-full h-full rounded items-center justify-center p-2 text-sm text-center overflow-y-auto">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi
            voluptas aliquam cupiditate repellendus unde nulla, itaque amet
            culpa facere, laudantium excepturi eaque reiciendis autem
            voluptatibus iste aperiam maiores, modi voluptate.
          </div>
        </div>
        <div className="flex flex-col bg-base-100 shadow-br rounded p-3 gap-1 w-full h-[244px]">
          <h2 className="font-semibold text-2xl">Satisfactory Rating</h2>
          <p className="text-sm mb-2">
            Rating and reviews are verified and are from people who use the
            service. Higher score, higher satisfaction.
          </p>
          <RatingSummary feedbacks={feedbacks} />
        </div>
      </div>
      <div className="flex flex-wrap bg-base-100 rounded p-3 shadow-br gap-3 flex-1 min-h-0 overflow-y-auto">
        {feedbacks.map((feedback) => (
          <UserFeedback key={feedback.id} feedback={feedback} />
        ))}
      </div>
    </div>
  );
};

export default FeedbackPage;
