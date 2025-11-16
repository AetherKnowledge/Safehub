import { Option } from "../../Input/InputInterface";

export const getNextOptionName = (options: Option[]) => {
  let num = options.length + 1;

  const existing = new Set(options.map((o) => o.label.toLowerCase().trim()));

  while (existing.has(`option ${num}`)) {
    num++;
  }

  return num;
};
