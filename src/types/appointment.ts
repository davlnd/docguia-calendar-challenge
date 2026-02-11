export type Appointment = {
    id: string;
    title: string;
    date: string;
    startTime: string;
    durationMin: number;
    name?: string;
    reason?: string;
    notes?: string;
    place?: string;
}