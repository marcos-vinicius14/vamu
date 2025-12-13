import { auth } from '../../utils/auth';
import { eventsService } from '../../features/events/events.service';

export default defineEventHandler(async (event) => {
    // 1. Authentication
    const session = await auth.api.getSession({
        headers: event.headers,
    });

    if (!session) {
        throw createError({
            statusCode: 401,
            message: 'Não autorizado.',
        });
    }

    // 2. Business Logic (delegated to service)
    return await eventsService.getUserEvents(session.user.id);
});
