import { z } from 'zod';
import type { InferSelectModel } from 'drizzle-orm';
import { events, guests } from '../../database/schemas/app';


export const createEventSchema = z.object({
    title: z.string().min(1, 'O nome do evento é obrigatório'),
    date: z.coerce.date(),
    location: z.string().min(1, 'A localização é obrigatória'),
    description: z.string().optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

export type Event = InferSelectModel<typeof events>;


export interface EventSummary {
    id: string;
    title: string;
    slug: string;
    date: Date | null;
    createdAt: Date | null;
}

export interface PublicEventResponse {
    id: string;
    title: string;
    date: Date | null;
    location: string | null;
    description: string | null;
    theme: string | null;
    user: {
        name: string;
        image?: string | null;
    } | null;
}

export interface DashboardStats {
    totalGuests: number;
    confirmedCount: number;
    declinedCount: number;
    pendingCount: number;
}

export interface DashboardResponse {
    event: Event;
    guests: InferSelectModel<typeof guests>[];
    stats: DashboardStats;
}

export interface CreateEventResponse {
    slug: string;
}
