import { eventsService } from '../../../features/events/events.service';

export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug');

    if (!slug) {
        throw createError({
            statusCode: 400,
            message: 'Slug do evento é obrigatório.',
        });
    }

    const outcome = await eventsService.getPublicEvent(slug);

    if (!outcome.success) {
        throw createError({
            statusCode: 404,
            message: 'Evento não encontrado.',
        });
    }

    return outcome.data;
});
