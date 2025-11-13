export function setTimeToDate(date: Date, time: Time): Date {
  let hour = time.hour % 12;
  if (time.period === TimePeriod.PM) hour += 12;
  if (time.period === TimePeriod.AM && time.hour === 12) hour = 0;
  date.setHours(hour, time.minute, 0, 0);
  return date;
}

export function getTimeFromDate(date: Date): Time {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const period = hours >= 12 ? TimePeriod.PM : TimePeriod.AM;
  const hour = hours % 12 || 12;

  return { hour, minute: minutes, period };
}

export const padTime = (num: number) => num.toString().padStart(2, "0");
export enum TimePeriod {
  AM = "AM",
  PM = "PM",
}

export type Time = {
  hour: number;
  minute: number;
  period: TimePeriod;
};
