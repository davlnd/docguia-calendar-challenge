import { ReactNode } from "react";
import { cn } from "@/utils/cn";

export function Sidebar() {
  return (
    <aside className="w-[248px] border-r border-gray-100 bg-white px-3 py-4">
      <div className="mb-6 px-2">
        <div className="text-[15px] font-semibold text-purple-600">DocGuía</div>
        <div className="mt-0.5 text-xs text-gray-400">Panel</div>
      </div>
      <nav className="space-y-5 text-[13px]">
        <Section title="GENERAL">
          <NavItem active>Calendario</NavItem>
          <NavItem>Pacientes</NavItem>
          <NavItem>Cobros</NavItem>
        </Section>

        <Section title="GESTIÓN">
          <NavItem>Recordatorios</NavItem>
          <NavItem>Referidos</NavItem>
        </Section>

        <Section title="CONFIGURACIÓN">
          <NavItem>Consultorios</NavItem>
          <NavItem>Servicios</NavItem>
          <NavItem>Plantillas</NavItem>
        </Section>
      </nav>
      <div className="mt-auto px-2 pt-6">
        <div className="flex items-center gap-2 rounded-lg border border-gray-100 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
            CP
          </div>
          <div className="min-w-0">
            <div className="truncate text-xs font-medium text-gray-700">
              Dr. Carlos Parra
            </div>
            <div className="text-[11px] text-gray-400">Especialista</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="px-2 pb-2 text-[11px] font-medium tracking-wide text-gray-400">
        {title}
      </div>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
}

function NavItem({
  children,
  active,
}: {
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <li>
      <button
        className={cn([
          "w-full rounded-lg px-3 py-2 text-left transition",
          active
            ? "bg-purple-50 text-purple-700"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-800",
        ])}
      >
        {children}
      </button>
    </li>
  );
}
