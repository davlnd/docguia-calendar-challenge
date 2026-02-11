"use client";

import { SubmitEvent, ReactNode, useMemo, useState } from "react";
import { useAppointmentsStore } from "@/store/useAppointmentStore";
import type { Appointment } from "@/types/appointment";

function uid() {
  return Math.random().toString(16).slice(2);
}

export function AppointmentForm({
  onDoneAction,
}: {
  onDoneAction: () => void;
}) {
  const addAppointment = useAppointmentsStore((s) => s.addAppointment);

  const todayISO = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const [patient, setPatient] = useState("");
  const [date, setDate] = useState(todayISO);
  const [startTime, setStartTime] = useState("08:30");
  const [durationMin, setDurationMin] = useState(30);
  const [reason, setReason] = useState("");

  function onSubmit(e: SubmitEvent) {
    e.preventDefault();

    const appointment: Appointment = {
      id: uid(),
      title: patient || reason || "Cita",
      name: patient || undefined,
      reason: reason || undefined,
      date,
      startTime,
      durationMin,
    };

    addAppointment(appointment);
    onDoneAction();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-sm text-gray-500">
      <Field label="Paciente">
        <input
          value={patient}
          onChange={(e) => setPatient(e.target.value)}
          className="w-full placeholder-gray-300 rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-purple-300"
          placeholder="Buscar paciente"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Fecha">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full placeholder-gray-300 rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-purple-300"
          />
        </Field>

        <Field label="Hora">
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full placeholder-gray-300 rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-purple-300"
          />
        </Field>
      </div>

      <Field label="Duración (min)">
        <input
          type="number"
          value={durationMin}
          min={10}
          step={5}
          onChange={(e) => setDurationMin(Number(e.target.value))}
          className="w-full placeholder-gray-300 rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-purple-300"
        />
      </Field>

      <Field label="Motivo / nota">
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full placeholder-gray-300 rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-purple-300"
          placeholder="Ej: control"
        />
      </Field>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onDoneAction}
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
        >
          Agendar cita
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium text-gray-600">{label}</div>
      {children}
    </label>
  );
}
