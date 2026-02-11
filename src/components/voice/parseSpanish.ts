import { addDays, format } from "date-fns";
import { AppointmentDraft, DraftIssue } from "@/types/voice";

function iso(d: Date) {
  return format(d, "yyyy-MM-dd");
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function normalize(text: string) {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

export function parseAppointmentText(raw: string, baseDate = new Date()) {
  const text = normalize(raw);

  const draft: AppointmentDraft = { rawText: raw };
  const durMatch = text.match(/(\d{1,3})\s*(minutos|min)\b/);
  if (durMatch) draft.durationMin = Number(durMatch[1]);
  if (text.includes("media hora")) draft.durationMin = 30;
  const conMatch = raw.match(
    /con\s+([A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{2,})(?:\s+por|\s+para|$)/i,
  );
  if (conMatch) draft.name = conMatch[1].trim();
  const motivoMatch = raw.match(/\b(por|para)\s+(.+)$/i);
  if (motivoMatch) draft.reason = motivoMatch[2].trim();
  if (text.includes("hoy")) draft.date = iso(baseDate);
  if (text.includes("mañana")) draft.date = iso(addDays(baseDate, 1));
  if (text.includes("pasado mañana")) draft.date = iso(addDays(baseDate, 2));
  const weekdays: Record<string, number> = {
    lunes: 1,
    martes: 2,
    miercoles: 3,
    miércoles: 3,
    jueves: 4,
    viernes: 5,
    sabado: 6,
    sábado: 6,
    domingo: 0,
  };

  const wd = Object.keys(weekdays).find((k) => text.includes(k));
  if (wd && !draft.date) {
    const target = weekdays[wd];
    const d = new Date(baseDate);
    for (let i = 0; i < 14; i++) {
      const cand = addDays(d, i);
      if (cand.getDay() === target) {
        draft.date = iso(cand);
        break;
      }
    }
  }
  const issues: DraftIssue[] = [];

  const hhmm = text.match(/(\d{1,2}):(\d{2})/);
  if (hhmm) {
    draft.startTime = `${pad(Number(hhmm[1]))}:${pad(Number(hhmm[2]))}`;
  } else {
    const h = text.match(/a\s+las?\s+(\d{1,2})(?:\s*(am|pm))?/);
    if (h) {
      const hour = Number(h[1]);
      const ampm = h[2];

      if (ampm) {
        const hh = ampm === "pm" ? (hour % 12) + 12 : hour % 12;
        draft.startTime = `${pad(hh)}:00`;
      } else {
        if (hour >= 1 && hour <= 11) {
          issues.push({ type: "ambiguous_time_ampm", hour });
        } else {
          draft.startTime = `${pad(hour)}:00`;
        }
      }
    }
  }
  if (text.includes("en la tarde") || text.includes("por la tarde")) {
    if (!draft.startTime) {
      issues.push({
        type: "ambiguous_part_of_day",
        dayLabel: "tarde",
        options: ["15:00", "16:00", "17:00"],
      });
    }
  }
  if (!draft.durationMin) draft.durationMin = 30;

  if (!draft.date) issues.push({ type: "missing_date" });
  if (!draft.startTime && !issues.some((x) => x.type.includes("ambiguous"))) {
    issues.push({ type: "missing_time" });
  }

  return { draft, issues };
}
