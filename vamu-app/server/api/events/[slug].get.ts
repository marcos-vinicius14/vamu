import { eventsService } from '../../features/events/events.service';

export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug');

    if (!slug) {
        throw createError({
            statusCode: 400,
            message: 'Slug necessário.',
        });
    }

    const outcome = await eventsService.getBySlug(slug);

    if (!outcome.success) {
        throw createError({
            statusCode: 404,
            message: 'Evento não encontrado.',
        });
    }

    return outcome.data;
});
