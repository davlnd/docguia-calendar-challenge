import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    draft: {
      type: "object",
      additionalProperties: false,
      properties: {
        date: { type: ["string", "null"], description: "YYYY-MM-DD" },
        startTime: { type: ["string", "null"], description: "HH:mm 24h" },
        durationMin: { type: ["number", "null"] },
        patient: { type: ["string", "null"] },
        reason: { type: ["string", "null"] },
        notes: { type: ["string", "null"] },
      },
      required: [
        "date",
        "startTime",
        "durationMin",
        "patient",
        "reason",
        "notes",
      ],
    },
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          prompt: { type: "string" },
          kind: { type: "string", enum: ["pick_one", "free_text"] },
          field: {
            type: "string",
            enum: ["date", "startTime", "durationMin", "patient", "reason"],
          },
          options: {
            type: ["array", "null"],
            items: { type: "string" },
          },
        },
        required: ["id", "prompt", "kind", "field", "options"],
      },
    },
    confidence: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["draft", "questions", "confidence"],
} as const;

export async function POST(req: Request) {
  const body = await req.json();
  const {
    text,
    referenceDate,
    timezone = "America/Bogota",
    locale = "es-CO",
  } = body ?? {};

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  const prompt = `
Eres un extractor de datos para citas médicas.
Convierte la frase del usuario en un "draft" estructurado.
Reglas:
- Fecha: YYYY-MM-DD. Usa referenceDate como "hoy" (en timezone ${timezone}).
- Hora: HH:mm formato 24h.
- durationMin por defecto 30 si no se menciona.
- Si hay ambigüedad (ej. "a las 7" sin am/pm, "en la tarde"), NO inventes: agrega una pregunta en "questions".
- Si falta info obligatoria (fecha u hora), agrega pregunta.
- "patient" suele venir después de "con X". "reason" suele venir después de "por/para".
- Devuelve notes = texto original.
Entrada:
text="${text}"
referenceDate="${referenceDate ?? "now"}"
locale="${locale}"
`;

  try {
    const resp = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
      // Structured Outputs: garantiza que el JSON cumple el schema
      text: {
        format: {
          type: "json_schema",
          name: "appointment_parse",
          strict: true,
          schema,
        },
      },
    });

    const outText = resp.output_text; // JSON string
    const parsed = JSON.parse(outText);

    return NextResponse.json(parsed);
  } catch (e: unknown) {
    if (e instanceof Error)
      return NextResponse.json(
        { error: "parse_failed", detail: e?.message ?? "unknown" },
        { status: 500 },
      );
  }
}
