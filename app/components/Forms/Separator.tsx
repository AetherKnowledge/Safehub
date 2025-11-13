import Divider from "../Divider";

export type SeparatorProps = {
  name: string;
  className?: string;
  text?: string;
};

const Separator = ({ className, text, name }: SeparatorProps) => {
  return (
    <div
      className={`text-primary font-semibold text-lg gap-2 text-center ${className}`}
    >
      <h2>{text || name}</h2>
      <Divider colorClass="bg-primary" height={3} className="rounded-lg" />
    </div>
  );
};

export default Separator;
