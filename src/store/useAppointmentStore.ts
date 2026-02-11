import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Appointment } from "@/types/appointment";

type State = {
    appointments: Appointment[];
    addAppointment: (a: Appointment) => void;
    setAppointments: (a: Appointment[]) => void;
    clearAppointments: () => void;
};

export const useAppointmentsStore = create<State>()(
    persist(
        (set) => ({
            appointments: [],
            addAppointment: (a) =>
                set((s) => ({ appointments: [a, ...s.appointments] })),
            setAppointments: (appointments) => set({ appointments }),
            clearAppointments: () => set({ appointments: [] }),
        }),
        {
            name: "docguia-appointments",
        }
    )
);
