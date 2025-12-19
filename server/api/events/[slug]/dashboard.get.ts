import { auth } from '../../../utils/auth';
import { eventsService } from '../../../features/events/events.service';
import { setSentryUser, addSentryBreadcrumb, captureError } from '../../../utils/sentry';

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers,
    });

    if (!session) {
        addSentryBreadcrumb('Unauthorized dashboard access attempt', 'auth');

        throw createError({
            statusCode: 401,
            message: 'Não autorizado.',
        });
    }

    // Set user context for Sentry
    setSentryUser(session.user.id, session.user.email, session.user.name);

    const slug = getRouterParam(event, 'slug');

    if (!slug) {
        addSentryBreadcrumb('Dashboard fetch missing slug', 'event', {
            userId: session.user.id
        });

        throw createError({
            statusCode: 400,
            message: 'Slug do evento é obrigatório.',
        });
    }

    addSentryBreadcrumb('Fetching event dashboard', 'event', {
        slug,
        userId: session.user.id
    });

    try {
        const outcome = await eventsService.getDashboard(session.user.id, slug);

        if (!outcome.success) {
            if (outcome.reason === 'NOT_FOUND') {
                addSentryBreadcrumb('Dashboard event not found', 'event', { slug });

                throw createError({
                    statusCode: 404,
                    message: 'Evento não encontrado.',
                });
            }

            addSentryBreadcrumb('Dashboard access denied', 'auth', {
                slug,
                userId: session.user.id,
                reason: outcome.reason
            });

            throw createError({
                statusCode: 403,
                message: 'Acesso negado. Você não é o dono deste evento.',
            });
        }

        return outcome.data;
    } catch (error) {
        // Only capture unexpected errors (not the ones we throw above)
        if (!(error instanceof Error && 'statusCode' in error)) {
            captureError(error, {
                operation: 'event.dashboard',
                userId: session.user.id,
                eventSlug: slug
            });
        }
        throw error;
    }
});
