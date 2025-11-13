type InputInterface = {
  name: string;
  legend?: string;
  className?: string;
  required?: boolean;
  number?: number;
  bgColor?: string;
  onInvalid?: () => void;
  disabled?: boolean;
};

export type Option = {
  label: string;
  value: string;
};

export default InputInterface;
