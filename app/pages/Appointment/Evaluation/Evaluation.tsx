import RatingSummary from "@/app/components/RatingSummary";
import { getEvaluationTableData } from "./EvaluationActions";
import EvaluationTable from "./EvaluationTable";

const Evaluation = async () => {
  const result = await getEvaluationTableData();

  if (!result.success) {
    throw new Error("Failed to fetch evaluation data");
  }

  return (
    <div className="flex flex-col gap-3 flex-1 min-h-0">
      <div className="flex flex-col xl:flex-row gap-3 ">
        {/* <div className="flex flex-col bg-base-100 shadow-br rounded p-3 gap-3 w-full h-[244px]">
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
        </div> */}
        <div className="flex flex-col bg-base-100 shadow-br rounded p-3 gap-1 w-full h-[244px]">
          <h2 className="font-semibold text-2xl">Satisfactory Rating</h2>
          <p className="text-sm mb-2">
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
      <div className="flex flex-1 bg-base-100 rounded shadow-br">
        <EvaluationTable evaluationData={result.data || []} />
      </div>
    </div>
  );
};

export default Evaluation;
