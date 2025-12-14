import { auth } from '../../../utils/auth';
import { eventsService } from '../../../features/events/events.service';

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

    const slug = getRouterParam(event, 'slug');

    if (!slug) {
        throw createError({
            statusCode: 400,
            message: 'Slug do evento é obrigatório.',
        });
    }

    const outcome = await eventsService.getDashboard(session.user.id, slug);

    if (!outcome.success) {
        if (outcome.reason === 'NOT_FOUND') {
            throw createError({
                statusCode: 404,
                message: 'Evento não encontrado.',
            });
        }

        throw createError({
            statusCode: 403,
            message: 'Acesso negado. Você não é o dono deste evento.',
        });
    }

    return outcome.data;
});
