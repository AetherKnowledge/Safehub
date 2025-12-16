import ErrorPopup from "@/app/components/Popup/ErrorPopup";
import RatingSummary from "@/app/components/RatingSummary";
import { getEvaluationTableData } from "./EvaluationActions";
import EvaluationTable from "./EvaluationTable";

const Evaluation = async () => {
  const result = await getEvaluationTableData();

  if (!result.success) {
    return <ErrorPopup message={result.message} />;
  }

  return (
    <div className="flex flex-col gap-4 flex-1 min-h-0">
      {/* Rating Summary Card */}
      <div className="flex flex-col xl:flex-row gap-4">
        <div className="flex flex-col bg-linear-to-br from-base-100 to-base-200/50 shadow-xl rounded-xl p-6 gap-3 w-full border border-base-content/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-primary rounded-full"></div>
            <div>
              <h2 className="font-bold text-xl">Satisfactory Rating</h2>
              <p className="text-xs text-base-content/60">
                Verified ratings from service users
              </p>
            </div>
          </div>
          <p className="text-sm text-base-content/70 mb-2">
            Rating and reviews are verified and are from people who use the
            service. Higher score, higher satisfaction.
          </p>
          <RatingSummary
            ratings={(result.data || [])
              .filter((item) => item.rating != null)
              .map((item) => item.rating as number)}
          />
        </div>
      </div>

      {/* Evaluation Table */}
      <div className="flex flex-1 bg-linear-to-br from-base-100 to-base-200/50 rounded-xl shadow-xl min-h-0 border border-base-content/5">
        <EvaluationTable evaluationData={result.data || []} />
      </div>
    </div>
  );
};

export default Evaluation;
