import Divider from "../Divider";
import InputInterface from "../Input/InputInterface";

export type SeparatorProps = InputInterface;

export const BaseSeparator = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`text-primary font-semibold text-lg gap-2 text-center ${className}`}
    >
      {children}
      <Divider colorClass="bg-primary" height={3} className="rounded-lg" />
    </div>
  );
};

const Separator = ({ className, legend }: SeparatorProps) => {
  return (
    <BaseSeparator className={className}>
      <h2>{legend}</h2>
    </BaseSeparator>
  );
};

export default Separator;
