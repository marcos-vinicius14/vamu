import { guestsService } from '../features/guests/guests.service';
import { rsvpSchema } from '../features/guests/guests.dto';

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

    try {
        return await guestsService.createRsvp(result.data);
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: 'Erro ao enviar convite! Tente novamente mais tarde.',
        });
    }
});
