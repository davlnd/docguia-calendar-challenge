"use client";

import { type ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { AppointmentDrawer } from "@/components/appointment/AppointmentDrawer";

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar onOpenCreate={() => setOpen(true)} />
        <main className="flex-1 overflow-auto bg-white">{children}</main>
      </div>

      <AppointmentDrawer open={open} onOpenChangeAction={setOpen} />
    </div>
  );
}
