"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SpeechState = {
  supported: boolean;
  listening: boolean;
  transcript: string;
  interim: string;
  error?: string;
  start: () => void;
  stop: () => void;
  reset: () => void;
};

type SRType =
  | typeof window.SpeechRecognition
  | typeof window.webkitSpeechRecognition;
const SILENCE_TIMEOUT = 2000;

export function useSpeechRecognition(): SpeechState {
  const SR: SRType = useMemo(() => {
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  }, []);

  const silenceTimer = useRef<number | null>(null);
  const startingRef = useRef(false);
  const lastStopAt = useRef(0);

  const supported = Boolean(SR);

  const recogRef = useRef<SpeechRecognition | null>(null);

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!supported) return;

    const recognition = new SR();
    recognition.lang = "es-ES";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setError(undefined);
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
      setInterim("");
    };

    recognition.onerror = (e) => {
      console.error(e);
      setError(e?.error ?? "speech_error");
      setListening(false);
    };

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const text = res[0]?.transcript ?? "";
        if (res.isFinal) finalText += text;
        else interimText += text;
      }

      if (finalText) {
        setTranscript((prev) =>
          prev ? (prev + " " + finalText).trim() : finalText.trim(),
        );
      }

      setInterim(interimText.trim());

      if (silenceTimer.current) {
        window.clearTimeout(silenceTimer.current);
      }

      silenceTimer.current = window.setTimeout(() => {
        try {
          recogRef.current?.stop();
        } catch {}
      }, SILENCE_TIMEOUT);
    };

    recogRef.current = recognition;

    return () => {
      try {
        recognition.onresult = null;
        recognition.onend = null;
        recognition.onerror = null;
        recognition.onstart = null;
        recognition.stop();
      } catch {}
      if (silenceTimer.current) {
        window.clearTimeout(silenceTimer.current);
      }
    };
  }, [SR, supported]);

  function start() {
    if (!supported) return;
    const now = Date.now();
    if (now - lastStopAt.current < 350) return;
    if (startingRef.current) return;
    startingRef.current = true;
    setError(undefined);
    try {
      recogRef.current?.start();
    } catch (e) {
      if (e instanceof DOMException) return;
    } finally {
      window.setTimeout(() => {
        startingRef.current = false;
      }, 300);
    }
  }

  function stop() {
    if (!supported) return;

    if (silenceTimer.current) {
      window.clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }

    try {
      recogRef.current?.stop();
    } catch {}
  }

  function reset() {
    setTranscript("");
    setInterim("");
    setError(undefined);
  }

  return {
    supported,
    listening,
    transcript,
    interim,
    error,
    start,
    stop,
    reset,
  };
}
