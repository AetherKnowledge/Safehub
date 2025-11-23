type DefaultLoadingProps = {
  className?: string;
  size?: "loading-sm" | "loading-md" | "loading-lg" | "loading-xl";
  color?: string;
  message?: string;
};

const DefaultLoading = ({
  size = "loading-xl",
  color = "text-primary",
  className = "",
  message,
}: DefaultLoadingProps) => {
  return (
    <div
      className={`${className} flex flex-col items-center justify-center h-full space-y-4 `}
    >
      <div className={`loading loading-spinner ${size} ${color}`}></div>
      <p className="text-base-content">{message || "Loading..."}</p>
    </div>
  );
};

export default DefaultLoading;
