"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AppointmentForm } from "./AppointmentForm";
import { VoiceFlow } from "@/components/voice/VoiceFlow";

export function AppointmentDrawer({
  open,
  onOpenChangeAction,
}: {
  open: boolean;
  onOpenChangeAction: (v: boolean) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChangeAction}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 z-10" />
        <Dialog.Content className="fixed right-0 top-0 h-full w-[520px] bg-white shadow-xl z-20">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <Dialog.Title className="text-sm font-semibold text-gray-900">
              Agendar nueva cita
            </Dialog.Title>
            <Dialog.Close className="text-gray-400 hover:text-gray-600">
              ✕
            </Dialog.Close>
          </div>

          <div className="p-6">
            <VoiceFlow onCreatedAction={() => onOpenChangeAction(false)} />
            <div className="h-4" />
            <AppointmentForm onDoneAction={() => onOpenChangeAction(false)} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
