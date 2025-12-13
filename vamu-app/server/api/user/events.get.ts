import { db } from '../../utils/db';
import { auth } from '../../utils/auth';
import { events } from '../../database/schemas/app';
import { eq, desc } from 'drizzle-orm';

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

    const userEvents = await db.select({
        id: events.id,
        title: events.title,
        slug: events.slug,
        date: events.date,
        createdAt: events.createdAt,
    })
        .from(events)
        .where(eq(events.userId, session.user.id))
        .orderBy(desc(events.createdAt));

    return userEvents;
});
