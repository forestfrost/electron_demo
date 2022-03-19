import dayjs from "dayjs";
export function throttle(fn: Function, delay: number) {
  let flag = false;
  return () => {
    if (flag) return;
    flag = true;
    setTimeout(() => {
      fn(...arguments);
      flag = false;
    }, delay);
  };
}
export function getDiffBetweenDates(
  start: string,
  end: string,
  type: "year" | "month" | "day" | "hour" | "minute" | "second" | "millisecond" = "millisecond",
) {
  return dayjs(end).diff(start, type);
}
export function formatDate(date: Date | string, type: string) {
  return dayjs(date).format(type);
}
export function Before(date1: Date | string, date2: Date | string) {
  return dayjs(date1).isBefore(date2);
}
export function DatetoSeconds(date: string | Date) {
  return dayjs(date).unix();
}
export function setDateByHoursAndMinutes(time: string) {
  const now = new Date();
  const temp = time.split(":").map((item) => Number(item));
  now.setHours(temp[0]);
  now.setMinutes(temp[1]);
  return formatDate(now, "YYYY-MM-DD HH:mm:ss");
}
