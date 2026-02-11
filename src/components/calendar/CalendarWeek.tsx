"use client";

import { useEffect, useMemo } from "react";
import { getWeekDays, fmtDayLabel, fmtISODate } from "@/utils/date";
import { TimeGrid } from "./TimeGrid";
import { useAppointmentsStore } from "@/store/useAppointmentStore";

export function CalendarWeek() {
  const baseDate = useMemo(() => new Date(2026, 1, 9), []);
  const days = useMemo(() => getWeekDays(baseDate), [baseDate]);

  const setAppointments = useAppointmentsStore((s) => s.setAppointments);

  useEffect(() => {
    const mon = fmtISODate(days[0]);
    const tue = fmtISODate(days[1]);
    const wed = fmtISODate(days[2]);

    setAppointments([
      {
        id: "a1",
        title: "Carlos Mayaudon",
        name: "Carlos Mayaudon",
        reason: "control",
        date: mon,
        startTime: "08:30",
        durationMin: 30,
      },
      {
        id: "a2",
        title: "Carlos Parra",
        name: "Carlos Parra",
        reason: "consulta",
        date: mon,
        startTime: "09:00",
        durationMin: 60,
      },
      {
        id: "a3",
        title: "Bloqueo",
        reason: "reunión",
        date: tue,
        startTime: "11:30",
        durationMin: 30,
      },
      {
        id: "a4",
        title: "María Pérez",
        name: "María Pérez",
        reason: "limpieza dental",
        date: wed,
        startTime: "15:00",
        durationMin: 45,
      },
    ]);
  }, [days, setAppointments]);

  return (
    <div className="h-full">
      <div className="sticky top-0 z-10 grid grid-cols-[120px_1fr] border-b border-gray-100 bg-white">
        <div className="border-r border-gray-100 flex items-center justify-center text-xs text-gray-800">
          Horario
        </div>
        <div className="grid grid-cols-7">
          {days.map((d) => (
            <div
              key={d.toISOString()}
              className="px-3 py-3 flex justify-center items-center border-r border-gray-100"
            >
              <div className="text-xs font-medium text-gray-800">
                {fmtDayLabel(d)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <TimeGrid days={days} />
    </div>
  );
}
