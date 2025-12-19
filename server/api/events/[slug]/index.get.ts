import { eventsService } from '../../../features/events/events.service';
import { addSentryBreadcrumb } from '../../../utils/sentry';

export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug');

    if (!slug) {
        addSentryBreadcrumb('Public event fetch missing slug', 'event');

        throw createError({
            statusCode: 400,
            message: 'Slug do evento é obrigatório.',
        });
    }

    addSentryBreadcrumb('Fetching public event', 'event', { slug });

    const outcome = await eventsService.getPublicEvent(slug);

    if (!outcome.success) {
        addSentryBreadcrumb('Public event not found', 'event', { slug });

        throw createError({
            statusCode: 404,
            message: 'Evento não encontrado.',
        });
    }

    return outcome.data;
});
