import { auth } from '../../utils/auth';
import { eventsService } from '../../features/events/events.service';
import { createEventSchema } from '../../features/events/events.dto';
import { setSentryUser, addSentryBreadcrumb, captureError } from '../../utils/sentry';

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers,
    });

    if (!session) {
        addSentryBreadcrumb('Unauthorized event creation attempt', 'auth');

        throw createError({
            statusCode: 401,
            message: 'Não autorizado.',
        });
    }

    // Set user context for Sentry
    setSentryUser(session.user.id, session.user.email, session.user.name);

    const body = await readBody(event);
    const result = createEventSchema.safeParse(body);

    if (!result.success) {
        addSentryBreadcrumb('Event creation validation failed', 'event', {
            userId: session.user.id,
            errors: result.error.flatten().fieldErrors
        });

        throw createError({
            statusCode: 400,
            message: 'Erro de validação',
            data: result.error.message,
        });
    }

    const { title, date, location, description } = result.data;

    addSentryBreadcrumb('Creating event', 'event', {
        eventTitle: title,
        eventDate: date,
        location
    });

    try {
        const response = await eventsService.create(session.user.id, result.data);

        addSentryBreadcrumb('Event created successfully', 'event', {
            eventSlug: response.slug,
            eventTitle: title
        });

        return response;
    } catch (error) {
        captureError(error, {
            operation: 'event.create',
            userId: session.user.id,
            extra: { eventTitle: title, eventDate: date, location }
        });

        throw createError({
            statusCode: 500,
            message: 'Erro ao criar evento. Tente novamente.',
        });
    }
});
