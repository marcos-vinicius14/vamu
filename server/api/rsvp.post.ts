import { guestsService } from '../features/guests/guests.service';
import { rsvpSchema } from '../features/guests/guests.dto';
import { addSentryBreadcrumb, captureError } from '../utils/sentry';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const result = rsvpSchema.safeParse(body);

    if (!result.success) {
        addSentryBreadcrumb('RSVP validation failed', 'rsvp', {
            errors: result.error.flatten().fieldErrors
        });

        throw createError({
            statusCode: 400,
            message: 'Dados inválidos! Verifique os campos e tente novamente.',
            data: result.error.message,
        });
    }

    const { eventId, name, phoneNumber, status } = result.data;

    addSentryBreadcrumb('Processing RSVP', 'rsvp', {
        eventId,
        guestName: name,
        status
    });

    try {
        const response = await guestsService.createRsvp(result.data);

        addSentryBreadcrumb('RSVP created successfully', 'rsvp', {
            eventId,
            guestName: name,
            status
        });

        return response;
    } catch (error) {
        captureError(error, {
            operation: 'rsvp.create',
            extra: { eventId, guestName: name, status }
        });

        throw createError({
            statusCode: 500,
            message: 'Erro ao enviar convite! Tente novamente mais tarde.',
        });
    }
});
