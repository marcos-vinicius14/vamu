import { db } from '../../../utils/db';
import { events } from '../../../database/schemas/app';
import { user } from '../../../database/schemas/auth';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug');

    if (!slug) {
        throw createError({
            statusCode: 400,
            message: 'Slug do evento é obrigatório.',
        });
    }

    const eventData = await db.query.events.findFirst({
        where: eq(events.slug, slug),
        with: {
            // Assuming strict relation setup, otherwise join manually or just fetch event
            // Note: Schema definition for 'events' references 'user_id' but relation object might need to be defined in Drizzle config
            // For now, simpler query or explicit join if needed. Let's stick to simple findFirst.
        }
    });

    // Manual fetch for user if relation not set up in schema relations
    let userData = null;
    if (eventData) {
        userData = await db.query.user.findFirst({
            where: eq(user.id, eventData.userId),
            columns: {
                name: true,
                image: true
            }
        });
    }

    if (!eventData) {
        throw createError({
            statusCode: 404,
            message: 'Evento não encontrado.',
        });
    }

    return {
        ...eventData,
        user: userData
    };
});
