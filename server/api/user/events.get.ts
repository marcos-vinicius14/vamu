import { auth } from '../../utils/auth';
import { eventsService } from '../../features/events/events.service';
import { setSentryUser, addSentryBreadcrumb, captureError } from '../../utils/sentry';

export default defineEventHandler(async (event) => {
    // 1. Authentication
    const session = await auth.api.getSession({
        headers: event.headers,
    });

    if (!session) {
        addSentryBreadcrumb('Unauthorized user events access', 'auth');

        throw createError({
            statusCode: 401,
            message: 'Não autorizado.',
        });
    }

    // Set user context for Sentry
    setSentryUser(session.user.id, session.user.email, session.user.name);

    addSentryBreadcrumb('Fetching user events', 'user', {
        userId: session.user.id
    });

    try {
        // 2. Business Logic (delegated to service)
        const events = await eventsService.getUserEvents(session.user.id);

        addSentryBreadcrumb('User events fetched', 'user', {
            userId: session.user.id,
            eventCount: events.length
        });

        return events;
    } catch (error) {
        captureError(error, {
            operation: 'user.events',
            userId: session.user.id
        });

        throw createError({
            statusCode: 500,
            message: 'Erro ao buscar seus eventos. Tente novamente.',
        });
    }
});
