import { auth } from '../../utils/auth';
import { eventsService } from '../../features/events/events.service';
import { createEventSchema } from '../../features/events/events.dto';

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers,
    });

    if (!session) {
        throw createError({
            statusCode: 401,
            message: 'Não autorizado.',
        });
    }

    const body = await readBody(event);
    const result = createEventSchema.safeParse(body);

    if (!result.success) {
        throw createError({
            statusCode: 400,
            message: 'Erro de validação',
            data: result.error.message,
        });
    }

    const response = await eventsService.create(session.user.id, result.data);

    return response;
});
