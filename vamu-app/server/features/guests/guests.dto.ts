import { z } from 'zod';
import type { InferSelectModel } from 'drizzle-orm';
import { guests } from '../../database/schemas/app';

export const rsvpSchema = z.object({
    eventId: z.string().min(1, 'ID do evento é obrigatório'),
    name: z.string().min(1, 'Por favor, digite seu nome'),
    phoneNumber: z.string().optional().or(z.literal('')),
    status: z.enum(['CONFIRMED', 'DECLINED']),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;

export type Guest = InferSelectModel<typeof guests>;

export type GuestStatus = 'CONFIRMED' | 'DECLINED' | 'PENDING';

export interface GuestStats {
    totalGuests: number;
    confirmedCount: number;
    declinedCount: number;
    pendingCount: number;
}

export interface RsvpResponse {
    success: boolean;
}

export interface GuestStats {
    totalGuests: number;
    confirmedCount: number;
    declinedCount: number;
    pendingCount: number;
}

export interface RsvpResponse {
    success: boolean;
}
