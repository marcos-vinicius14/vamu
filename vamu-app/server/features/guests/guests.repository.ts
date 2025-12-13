import { eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { guests } from '../../database/schemas/app';
import type { Guest, RsvpInput } from './guests.dto';

export const guestsRepository = {
    async findByEventId(eventId: string): Promise<Guest[]> {
        const result = await db
            .select()
            .from(guests)
            .where(eq(guests.eventId, eventId));

        return result;
    },

    async create(data: RsvpInput): Promise<void> {
        await db.insert(guests).values({
            eventId: data.eventId,
            name: data.name,
            phoneNumber: data.phoneNumber || null,
            status: data.status,
        });
    },
};
