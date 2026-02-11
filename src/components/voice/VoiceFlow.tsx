"use client";

import { useMemo, useState } from "react";
import { parseAppointmentText } from "./parseSpanish";
import type { AppointmentDraft, DraftIssue } from "@/types/voice";
import type { Appointment } from "@/types/appointment";
import { useAppointmentsStore } from "@/store/useAppointmentStore";
import { VoiceCapture } from "./VoiceCapture";
import {todayISO, tomorrowISO} from "@/utils/date";

function uid() {
  return Math.random().toString(16).slice(2);
}

export function VoiceFlow({
  onCreatedAction,
}: {
  onCreatedAction: () => void;
}) {
  const addAppointment = useAppointmentsStore((s) => s.addAppointment);

  const [draft, setDraft] = useState<AppointmentDraft | null>(null);
  const [issues, setIssues] = useState<DraftIssue[]>([]);

  const ready = useMemo(() => {
    if (!draft) return false;
    return Boolean(
      draft.date && draft.startTime && (draft.name || draft.reason),
    );
  }, [draft]);

  async function onTranscript(text: string) {
    const res = await fetch("/api/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        timezone: "America/Bogota",
        locale: "es-CO",
        referenceDate: new Date().toISOString(),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      const { draft, issues } = parseAppointmentText(text, new Date());
      setDraft(draft);
      setIssues(issues);
      return;
    }

    setDraft({
      rawText: text,
      date: data.draft.date ?? undefined,
      startTime: data.draft.startTime ?? undefined,
      durationMin: data.draft.durationMin ?? 30,
      name: data.draft.patient ?? undefined,
      reason: data.draft.reason ?? undefined,
    });
  }

  function applyTime(t: string) {
    if (!draft) return;
    setDraft({ ...draft, startTime: t });
    setIssues((prev) =>
      prev.filter(
        (i) =>
          i.type !== "ambiguous_part_of_day" &&
          i.type !== "ambiguous_time_ampm" &&
          i.type !== "missing_time",
      ),
    );
  }

  function applyAmpm(ampm: "am" | "pm", hour: number) {
    const hh = ampm === "pm" ? (hour % 12) + 12 : hour % 12;
    applyTime(`${String(hh).padStart(2, "0")}:00`);
  }

  function applyDate(d: string) {
    if (!draft) return;
    setDraft({ ...draft, date: d });
    setIssues((prev) => prev.filter((i) => i.type !== "missing_date"));
  }

  function confirmCreate() {
    if (!draft?.date || !draft.startTime) return;

    const appointment: Appointment = {
      id: uid(),
      date: draft.date,
      startTime: draft.startTime,
      durationMin: draft.durationMin ?? 30,
      name: draft.name,
      reason: draft.reason,
      title: draft.name ?? draft.reason ?? "Cita",
      notes: draft.rawText,
    };

    addAppointment(appointment);
    onCreatedAction();
  }

  return (
    <div className="space-y-3">
      <VoiceCapture onTranscriptReadyAction={onTranscript} />

      {!draft ? null : (
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <div className="text-xs font-semibold text-gray-700">
            Resumen detectado
          </div>

          <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
            <KV label="Fecha" value={draft.date ?? "—"} />
            <KV label="Hora" value={draft.startTime ?? "—"} />
            <KV label="Duración" value={`${draft.durationMin ?? 30} min`} />
            <KV label="Nombre" value={draft.name ?? "—"} />
          </div>

          {draft.reason && (
            <div className="mt-2 text-xs text-gray-600">
              <span className="font-medium text-gray-700">Motivo:</span>{" "}
              {draft.reason}
            </div>
          )}

          <div className="mt-3 space-y-2">
            {issues.map((i, idx) => (
              <IssueRow
                key={idx}
                issue={i}
                onPickTime={applyTime}
                onPickAmpm={applyAmpm}
                onPickDate={applyDate}
              />
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setDraft(null);
                setIssues([]);
              }}
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Reintentar
            </button>

            <button
              type="button"
              disabled={!ready}
              onClick={confirmCreate}
              className={[
                "flex-1 rounded-lg px-3 py-2 text-xs font-semibold",
                ready
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-100 text-gray-400",
              ].join(" ")}
            >
              Confirmar y crear
            </button>
          </div>

          {!ready && (
            <div className="mt-2 text-[11px] text-gray-400">
              Falta completar fecha/hora y al menos paciente o motivo.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-2">
      <div className="text-[11px] text-gray-400">{label}</div>
      <div className="mt-0.5 truncate text-xs font-medium text-gray-700">
        {value}
      </div>
    </div>
  );
}

function IssueRow({
  issue,
  onPickTime,
  onPickAmpm,
  onPickDate,
}: {
  issue: DraftIssue;
  onPickTime: (t: string) => void;
  onPickAmpm: (ampm: "am" | "pm", hour: number) => void;
  onPickDate: (d: string) => void;
}) {
  if (issue.type === "missing_date") {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs">
        <div className="font-semibold text-amber-800">¿Para qué fecha?</div>
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => onPickDate(todayISO())}
            className="rounded-md bg-white px-2 py-1 text-amber-800"
          >
            Hoy
          </button>
          <button
            onClick={() => onPickDate(tomorrowISO())}
            className="rounded-md bg-white px-2 py-1 text-amber-800"
          >
            Mañana
          </button>
        </div>
      </div>
    );
  }

  if (issue.type === "missing_time") {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs">
        <div className="font-semibold text-amber-800">¿A qué hora?</div>
        <div className="mt-2 flex gap-2">
          {["09:00", "10:00", "15:00"].map((t) => (
            <button
              key={t}
              onClick={() => onPickTime(t)}
              className="rounded-md bg-white px-2 py-1 text-amber-800"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (issue.type === "ambiguous_time_ampm") {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs">
        <div className="font-semibold text-amber-800">
          ¿A las {issue.hour} am o pm?
        </div>
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => onPickAmpm("am", issue.hour)}
            className="rounded-md bg-white px-2 py-1 text-amber-800"
          >
            AM
          </button>
          <button
            onClick={() => onPickAmpm("pm", issue.hour)}
            className="rounded-md bg-white px-2 py-1 text-amber-800"
          >
            PM
          </button>
        </div>
      </div>
    );
  }

  if (issue.type === "ambiguous_part_of_day") {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs">
        <div className="font-semibold text-amber-800">
          ¿En qué horario de la tarde?
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {issue.options.map((t) => (
            <button
              key={t}
              onClick={() => onPickTime(t)}
              className="rounded-md bg-white px-2 py-1 text-amber-800"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

