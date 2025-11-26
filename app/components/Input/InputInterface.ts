type InputInterface = {
  name: string;
  legend?: string;
  className?: string;
  required?: boolean;
  number?: number;
  bgColor?: string;
  onInvalid?: () => void;
  onEnter?: () => void;
  disabled?: boolean;
  noFormOutput?: boolean;
  readonly?: boolean;
  answerOnly?: boolean;
};

export type Option = {
  label: string;
  value: string;
  other?: boolean;
};

export default InputInterface;
