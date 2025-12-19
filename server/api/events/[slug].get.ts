import { eventsService } from '../../features/events/events.service';
import { addSentryBreadcrumb } from '../../utils/sentry';

export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug');

    if (!slug) {
        addSentryBreadcrumb('Event fetch missing slug', 'event');

        throw createError({
            statusCode: 400,
            message: 'Slug necessário.',
        });
    }

    addSentryBreadcrumb('Fetching event by slug', 'event', { slug });

    const outcome = await eventsService.getBySlug(slug);

    if (!outcome.success) {
        addSentryBreadcrumb('Event not found', 'event', { slug });

        throw createError({
            statusCode: 404,
            message: 'Evento não encontrado.',
        });
    }

    return outcome.data;
});
