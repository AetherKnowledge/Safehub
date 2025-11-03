type LoadingButtonProps = {
  className?: string;
  isLoading: boolean;
  onClick: () => void;
  text?: string;
  loadingText?: string;
  buttonSize?: "sm" | "md" | "lg" | "xl";
  buttonType?: "outline" | "ghost" | "soft" | "dash" | "link";
  buttonColor?:
    | "primary"
    | "secondary"
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "error";
  Icon?: React.ReactNode;
};

const LoadingButton = ({
  className = "",
  buttonType,
  isLoading,
  onClick,
  Icon,
  text,
  loadingText,
  buttonSize = "md",
  buttonColor = "primary",
}: LoadingButtonProps) => {
  return (
    <button
      className={`btn btn-${buttonSize} btn-${buttonColor} ${
        buttonType && "btn-" + buttonType
      } ${className}`}
      onClick={onClick}
      type="button"
    >
      {isLoading ? (
        <>
          <div className={`loading loading-spinner loading-${buttonSize}`} />{" "}
          {loadingText || text + "ing..." || "Loading..."}
        </>
      ) : (
        <>
          {Icon} {text || "Button"}
        </>
      )}
    </button>
  );
};

export default LoadingButton;
