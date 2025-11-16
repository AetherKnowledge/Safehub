import Divider from "../Divider";
import InputInterface from "../Input/InputInterface";

export type SeparatorProps = InputInterface;

const Separator = ({ className, legend, name }: SeparatorProps) => {
  return (
    <div
      className={`text-primary font-semibold text-lg gap-2 text-center ${className}`}
    >
      <h2>{legend || name}</h2>
      <Divider colorClass="bg-primary" height={3} className="rounded-lg" />
    </div>
  );
};

export default Separator;
