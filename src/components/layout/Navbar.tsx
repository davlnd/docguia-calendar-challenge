import { cn } from "@/utils/cn";
import { ReactNode } from "react";
import { formatWeekRange } from "@/utils/date";

export function Navbar({ onOpenCreate }: { onOpenCreate: () => void }) {
  return (
    <header className="flex justify-between border-b border-gray-100 bg-white px-6 py-4 flex-col">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-3 text-xl">
          <div className="font-semibold text-gray-900">Calendario</div>
          <div className="text-purple-600">¿Cómo funciona?</div>
        </div>

        <button
          onClick={onOpenCreate}
          className="rounded-xl bg-purple-500 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-700"
        >
          Agendar cita +
        </button>
      </div>

      <div className="flex items-center gap-3 justify-between mt-2">
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
            Hoy
          </button>
          <div className="flex flex-row">
            <button
              aria-label="Anterior"
              className="flex h-8 w-8 items-center justify-center rounded-l-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              ‹
            </button>
            <div className="border-t border-b border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700">
              {formatWeekRange(new Date())}
            </div>
            <button
              aria-label="Siguiente"
              className="flex h-8 w-8 items-center justify-center rounded-r-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              ›
            </button>
          </div>
        </div>
        <div className="flex rounded-full border border-gray-200 bg-gray-100 p-0.5 text-xs">
          <Tab active>Semana</Tab>
          <Tab>Día</Tab>
          <Tab>Lista</Tab>
        </div>

        <div className="flex gap-3">
          <button className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
            Todos los consultorios
          </button>
          <button className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
            Filtros
          </button>
        </div>
      </div>
    </header>
  );
}

function Tab({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <button
      className={cn([
        "rounded-full py-3 px-4 transition",
        active
          ? "bg-white text-purple-700"
          : "text-purple-400 hover:bg-gray-50 cursor-pointer",
      ])}
    >
      {children}
    </button>
  );
}
