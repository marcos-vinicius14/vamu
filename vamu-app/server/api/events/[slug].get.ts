import { eq } from 'drizzle-orm';
import { db } from '~/../server/utils/db';
import { events } from '~/../server/database/schemas/app';

export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug');

    if (!slug) {
        throw createError({
            statusCode: 400,
            message: 'Slug necessário.',
        });
    }

    const foundEvent = await db.query.events.findFirst({
        where: eq(events.slug, slug),
        columns: {
            id: true,
            title: true,
            date: true,
            location: true,
            description: true,
            theme: true,
        },
        with: {
            user: {
                columns: {
                    name: true,
                },
            },
        },
    });

    if (!foundEvent) {
        throw createError({
            statusCode: 404,
            message: 'Evento não encontrado.',
        });
    }

    return foundEvent;
});
