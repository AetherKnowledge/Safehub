import ImageWithFallback from "@/app/components/Images/ImageWithFallback";
import TermsAndConditions from "@/app/components/Input/TermsAndConditions";
import { clearNotifications, testAction } from "./testActions";

const Test = async () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <button className="btn" onClick={testAction}>
        Test Action
      </button>
      <button className="btn" onClick={clearNotifications}>
        Delete Action
      </button>
      <TermsAndConditions />
      <ImageWithFallback
        src="/images/nonexistent-image.jpg"
        alt="Test Image"
        width={200}
        height={200}
      />
    </div>
  );
};

export default Test;
