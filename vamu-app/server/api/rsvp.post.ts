import { db } from '~/../server/utils/db';
import { guests } from '~/../server/database/schemas/app';
import { z } from 'zod';

const rsvpSchema = z.object({
    eventId: z.string().min(1, 'ID do evento é obrigatório'),
    name: z.string().min(1, 'Por favor, digite seu nome'),
    phoneNumber: z.string().optional().or(z.literal('')),
    status: z.enum(['CONFIRMED', 'DECLINED']),
});

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const result = rsvpSchema.safeParse(body);

    if (!result.success) {
        throw createError({
            statusCode: 400,
            message: 'Dados inválidos! Verifique os campos e tente novamente.',
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
            message: 'Erro ao enviar convite! Tente novamente mais tarde.',
        });
    }
});
