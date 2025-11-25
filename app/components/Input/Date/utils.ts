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

export function stringToTime(timeStr: string): Time {
  const [hhStr, mmStr] = timeStr.split(":");
  const hh = parseInt(hhStr, 10);
  const mm = parseInt(mmStr, 10);

  const period = hh >= 12 ? TimePeriod.PM : TimePeriod.AM;
  const hour = hh % 12 || 12;

  return { hour, minute: mm, period };
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

export function timeToMinutes(t: Time | "now"): number {
  if (t === "now") {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }

  let hour24 = t.hour % 12;
  if (t.period === TimePeriod.PM) hour24 += 12;
  if (t.period === TimePeriod.AM && t.hour === 12) hour24 = 0;
  return hour24 * 60 + t.minute;
}

export function isTimeAfter(
  fromTime: Time | "now",
  compareTo: Time | "now"
): boolean {
  if (fromTime === "now") fromTime = getTimeFromDate(new Date());
  if (compareTo === "now") compareTo = getTimeFromDate(new Date());

  console.log(
    "Comparing times",
    fromTime,
    compareTo,
    "result:",
    timeToMinutes(fromTime),
    ">",
    timeToMinutes(compareTo),
    "=",
    timeToMinutes(fromTime) > timeToMinutes(compareTo)
  );

  return timeToMinutes(fromTime) > timeToMinutes(compareTo);
}

export function addDays(date: Date | "now", days: number): Date {
  const result = new Date(date === "now" ? new Date() : date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isDateTimeAfter(
  fromDate: Date | "now",
  fromTime: Time | "now",
  compareTo: Date | "now"
): boolean {
  const combinedDateTime = setTimeToDate(
    fromDate === "now" ? new Date() : fromDate,
    fromTime === "now" ? getTimeFromDate(new Date()) : fromTime
  );
  return combinedDateTime > (compareTo === "now" ? new Date() : compareTo);
}

export function isDateToday(date: Date | "now"): boolean {
  if (date === "now") return true;

  const compareDate = date;
  const today = new Date();
  return (
    compareDate.getDate() === today.getDate() &&
    compareDate.getMonth() === today.getMonth() &&
    compareDate.getFullYear() === today.getFullYear()
  );
}

export function timeToString(time: Time): string {
  let hour24 = time.hour % 12;
  if (time.period === TimePeriod.PM) hour24 += 12;
  if (time.period === TimePeriod.AM && time.hour === 12) hour24 = 0;

  return `${padTime(hour24)}:${padTime(time.minute)}:00`;
}

export function dateToString(date: Date): string {
  const year = date.getFullYear();
  const month = padTime(date.getMonth() + 1);
  const day = padTime(date.getDate());
  const hours = padTime(date.getHours());
  const minutes = padTime(date.getMinutes());

  return `${year}-${month}-${day} ${hours}:${minutes}:00`;
}

export function formatTimeDisplay(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? TimePeriod.PM : TimePeriod.AM;
  hours = hours % 12 || 12;
  return `${hours}:${padTime(minutes)} ${period}`;
}
