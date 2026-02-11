import type { Appointment } from "@/types/appointment";

export function EventCard({ event }: { event: Appointment }) {
  return (
    <div className="h-full w-full overflow-hidden rounded-lg border border-purple-400 border-l-4 bg-purple-50 p-2 shadow-md">
      <div className="min-w-0">
        <div className="truncate text-[12px] font-semibold text-purple-800">
          {event.name ?? event.title}
        </div>
        <div className="mt-1 text-[10px] text-purple-700/70">
          {event.startTime} • {event.durationMin} min
        </div>
      </div>
    </div>
  );
}
