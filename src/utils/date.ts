import { addDays, endOfWeek, format, isSameDay, startOfWeek } from "date-fns";

import { es } from "date-fns/locale";

export function getWeekDays(baseDate: Date) {
  const start = startOfWeek(baseDate, { weekStartsOn: 1 }); // lunes
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function fmtDayLabel(d: Date) {
  const date = format(d, "EEE dd", { locale: es });
  return date.charAt(0).toUpperCase() + date.slice(1); // Mon 08
}

export function fmtISODate(d: Date) {
  return format(d, "yyyy-MM-dd");
}

export function timeToMinutes(t: string) {
  const [hh, mm] = t.split(":").map(Number);
  return hh * 60 + mm;
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function isToday(d: Date) {
  return isSameDay(d, new Date());
}

export function formatWeekRange(baseDate: Date) {
  const start = startOfWeek(baseDate, { weekStartsOn: 1 });
  const end = endOfWeek(baseDate, { weekStartsOn: 1 });
  const sameMonth = format(start, "MMM") === format(end, "MMM");
  if (sameMonth) {
    return `${format(start, "d")} – ${format(end, "d")} ${format(end, "MMM")} ${format(end, "yyyy")}`;
  }

  return `${format(start, "d MMM")} – ${format(end, "d MMM")} ${format(end, "yyyy")}`;
}

export function todayISO() {
  const d = new Date();
  return format(d, "yyyy-MM-dd");
}
export function tomorrowISO() {
  const d = addDays(new Date(), 1);
  return format(d, "yyyy-MM-dd");
}