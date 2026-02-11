export type AppointmentDraft = {
    date?: string;        // YYYY-MM-DD
    startTime?: string;   // HH:mm
    durationMin?: number; // default 30
    name?: string;
    reason?: string;
    rawText: string;
};

export type DraftIssue =
    | { type: "missing_date" }
    | { type: "missing_time" }
    | { type: "ambiguous_time_ampm"; hour: number }
    | { type: "ambiguous_part_of_day"; dayLabel: string; options: string[] };
