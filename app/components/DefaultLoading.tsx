type DefaultLoadingProps = {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
};

const DefaultLoading = ({
  size = "xl",
  color = "text-base-content",
  className = "",
}: DefaultLoadingProps) => {
  return (
    <div
      className={`loading loading-spinner loading-${size} ${color} ${className}`}
    />
  );
};

export default DefaultLoading;
