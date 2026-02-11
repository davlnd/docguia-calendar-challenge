"use client";

import { useSpeechRecognition } from "./useSpeechRecognition";
import { useState } from "react";
import { cn } from "@/utils/cn";

export function VoiceCapture({
  onTranscriptReadyAction,
}: {
  onTranscriptReadyAction: (text: string) => void;
}) {
  const sr = useSpeechRecognition();
  const [text, setText] = useState<string | undefined>(undefined);
  const liveText = (sr.transcript + " " + sr.interim).trim();

  function onToggle() {
    if (!sr.supported) return;
    if (sr.listening) sr.stop();
    else {
      sr.reset();
      sr.start();
    }
  }

  function onUseText() {
    if (!text && !liveText.trim()) return;
    onTranscriptReadyAction(text ? text : liveText);
  }

  const onClear = () => {
    sr.reset();
    setText(undefined);
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-900">
            Crear cita por voz
          </div>
          <div className="mt-0.5 text-xs text-gray-400">
            Di algo como: “Crea una cita mañana a las 3pm con María Pérez por
            control”
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className={cn([
            "cursor-pointer",
            sr.listening
              ? "border-purple-200 bg-purple-50 text-purple-700"
              : "",
            !sr.supported ? "opacity-50" : "",
          ])}
          aria-label={sr.listening ? "Detener grabación" : "Iniciar grabación"}
          title={!sr.supported ? "Tu navegador no soporta voz" : ""}
        >
          {sr.listening ? (
            <svg
              width={40}
              height={40}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  opacity="0.5"
                  d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  fill="#ff0000"
                ></path>
                <path
                  d="M8.58579 8.58579C8 9.17157 8 10.1144 8 12C8 13.8856 8 14.8284 8.58579 15.4142C9.17157 16 10.1144 16 12 16C13.8856 16 14.8284 16 15.4142 15.4142C16 14.8284 16 13.8856 16 12C16 10.1144 16 9.17157 15.4142 8.58579C14.8284 8 13.8856 8 12 8C10.1144 8 9.17157 8 8.58579 8.58579Z"
                  fill="#ff0000"
                ></path>
              </g>
            </svg>
          ) : (
            <svg
              width={40}
              height={40}
              fill="#de45f2"
              viewBox="-1 0 19 19"
              xmlns="http://www.w3.org/2000/svg"
              className="cf-icon-svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M16.417 9.583A7.917 7.917 0 1 1 8.5 1.666a7.917 7.917 0 0 1 7.917 7.917zm-4.247-1.14a.396.396 0 0 0-.791 0v.921a2.901 2.901 0 0 1-.84 2.049 2.801 2.801 0 0 1-4.019 0 2.902 2.902 0 0 1-.84-2.049v-.922a.396.396 0 0 0-.791 0v.922a3.69 3.69 0 0 0 1.067 2.605 3.596 3.596 0 0 0 2.178 1.064v1.325H6.513a.396.396 0 1 0 0 .791h4.034a.396.396 0 0 0 0-.791H8.925v-1.325a3.596 3.596 0 0 0 2.178-1.064 3.69 3.69 0 0 0 1.067-2.605zm-5.679.922a1.975 1.975 0 0 0 .16.788 2.034 2.034 0 0 0 1.087 1.085 2 2 0 0 0 .796.16 1.968 1.968 0 0 0 .792-.16 2.092 2.092 0 0 0 .645-.436 2.034 2.034 0 0 0 .589-1.438l.008-3.157a2.043 2.043 0 0 0-.157-.798 2.034 2.034 0 0 0-1.077-1.093 1.969 1.969 0 0 0-.792-.16 1.996 1.996 0 0 0-.796.16A2.064 2.064 0 0 0 6.652 5.41a1.997 1.997 0 0 0-.161.797z"></path>
              </g>
            </svg>
          )}
        </button>
      </div>

      {/* Estado */}
      <div className="mt-3 flex items-center gap-2 text-xs">
        <span
          className={cn([
            "inline-flex items-center rounded-full px-2 py-1",
            sr.listening
              ? "bg-purple-50 text-purple-700"
              : "bg-gray-50 text-gray-600",
          ])}
        >
          {sr.listening ? "Escuchando…" : "Listo"}
        </span>

        {sr.error && <span className="text-red-600">Error: {sr.error}</span>}

        {!sr.supported && (
          <span className="text-gray-500">
            Voz no soportada: usa el modo texto.
          </span>
        )}
      </div>

      {/* Transcripción */}
      <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
        <div className="text-[11px] font-medium text-gray-500">
          Transcripción
        </div>

        {liveText ? (
          <textarea
            value={text ?? liveText}
            onChange={(e) => setText(e.target.value)}
            className="mt-1 text-sm text-gray-800 focus:outline-none w-full"
          />
        ) : (
          <p className="mt-1 text-sm text-gray-400">Empieza a hablar…</p>
        )}
      </div>

      {/* Acciones */}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          Limpiar
        </button>

        <button
          type="button"
          onClick={onUseText}
          disabled={!liveText}
          className={cn([
            "rounded-lg px-3 py-2 text-xs font-semibold",
            liveText
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-100 text-gray-400",
          ])}
        >
          Usar transcripción
        </button>
      </div>
      {!sr.supported && (
        <ManualTextFallback onSubmit={onTranscriptReadyAction} />
      )}
    </div>
  );
}

function ManualTextFallback({ onSubmit }: { onSubmit: (t: string) => void }) {
  const [text, setText] = useState("");
  return (
    <div className="mt-3">
      <div className="text-[11px] font-medium text-gray-500">Modo texto</div>
      <div className="mt-2 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-purple-300"
          placeholder='Ej: "Agéndame a Juan mañana a las 3"'
        />
        <button
          type="button"
          onClick={() => text.trim() && onSubmit(text.trim())}
          className="rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-700"
        >
          OK
        </button>
      </div>
    </div>
  );
}
