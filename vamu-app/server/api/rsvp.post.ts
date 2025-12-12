import { db } from '~/../server/utils/db';
import { guests } from '~/../server/database/schemas/app';
import { z } from 'zod';

const rsvpSchema = z.object({
    eventId: z.string(),
    name: z.string().min(1),
    phoneNumber: z.string().min(1),
    status: z.enum(['CONFIRMED', 'DECLINED']),
});

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const result = rsvpSchema.safeParse(body);

    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Dados inválidos',
            data: result.error.message,
        });
    }

    const { eventId, name, phoneNumber, status } = result.data;

    try {
        await db.insert(guests).values({
            eventId,
            name,
            phoneNumber,
            status,
        });
        return { success: true };
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erro ao enviar RSVP',
        });
    }
});
