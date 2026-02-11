"use client";

import { format } from "date-fns";
import { useAppointmentsStore } from "@/store/useAppointmentStore";
import { fmtISODate, timeToMinutes, isToday, clamp } from "@/utils/date";
import { EventCard } from "./EventCard";
import type { Appointment } from "@/types/appointment";
import { useEffect, useState } from "react";

type Props = { days: Date[] };

const START_HOUR = 6;
const END_HOUR = 23;
const SLOT_MIN = 30;
const SLOT_HEIGHT = 52;

export function TimeGrid({ days }: Props) {
  const appointments = useAppointmentsStore((s) => s.appointments);
  const totalSlots = ((END_HOUR - START_HOUR) * 60) / SLOT_MIN;

  return (
    <div className="grid h-[calc(100vh-72px)] grid-cols-[120px_1fr]">
      <div className="relative border-r border-gray-100 bg-white">
        {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, i) => {
          const hour = START_HOUR + i;
          return (
            <div
              key={hour}
              className="relative pr-2 text-right border-b border-gray-100 bg-gray-50"
              style={{ height: SLOT_HEIGHT * 2 }}
            >
              <div className="sticky top-0 translate-y-[45px] -translate-x-1/4 text-xs text-gray-500">
                {format(new Date(2026, 0, 1, hour, 0), "hh:mm a")}
              </div>
            </div>
          );
        })}
      </div>
      <div className="overflow-auto">
        <div className="relative grid grid-cols-7">
          {days.map((d) => {
            const iso = fmtISODate(d);
            const dayAppointments = appointments.filter((a) => a.date === iso);
            return (
              <DayColumn
                key={iso}
                day={d}
                totalSlots={totalSlots}
                slotHeight={SLOT_HEIGHT}
                appointments={dayAppointments}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DayColumn({
  day,
  totalSlots,
  slotHeight,
  appointments,
}: {
  day: Date;
  totalSlots: number;
  slotHeight: number;
  appointments: Appointment[];
}) {
  const dayStartMin = START_HOUR * 60;
  const [nowTick, setNowTick] = useState(new Date());

  useEffect(() => {
    if (!isToday(day)) return;

    const id = window.setInterval(() => setNowTick(new Date()), 60 * 1000); // cada minuto
    return () => window.clearInterval(id);
  }, [day]);

  const showNow = isToday(day);
  const dayEndMin = END_HOUR * 60;

  const now = new Date(nowTick);
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const topNow = clamp(
    ((nowMin - dayStartMin) / SLOT_MIN) * slotHeight,
    0,
    totalSlots * slotHeight,
  );

  return (
    <div className="relative border-r border-gray-100">
      {Array.from({ length: totalSlots }).map((_, i) => (
        <div
          key={i}
          className={
            i % 2 === 0 ? "border-b border-gray-100" : "border-b border-gray-50"
          }
          style={{ height: slotHeight }}
        />
      ))}

      <div className="absolute inset-0 p-1">
        {showNow && nowMin >= dayStartMin && nowMin <= dayEndMin && (
          <div className="absolute left-1 right-1 z-20" style={{ top: topNow }}>
            <div className="relative">
              <div className="h-[3px] w-full bg-red-500 rounded-full" />
            </div>
          </div>
        )}

        {appointments.map((a) => {
          const startMin = timeToMinutes(a.startTime);
          const top = ((startMin - dayStartMin) / SLOT_MIN) * slotHeight;
          const height = (a.durationMin / SLOT_MIN) * slotHeight;

          return (
            <div
              key={a.id}
              className="absolute left-1 right-1"
              style={{ top, height }}
            >
              <EventCard event={a} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
