import { z } from 'zod';
import { auth } from '../../utils/auth';
import { db } from '../../utils/db';
import { events } from '../../database/schemas/app';
import { generateSlug } from '../../utils/slug';

const createEventSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    date: z.coerce.date(),
    location: z.string().min(1, 'Location is required'),
    description: z.string().optional(),
});

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

    const body = await readBody(event);
    const result = createEventSchema.safeParse(body);

    if (!result.success) {
        throw createError({
            statusCode: 400,
            message: 'Erro de validação',
            data: result.error.message,
        });
    }

    const { title, date, location, description } = result.data;
    const slug = generateSlug(title);

    await db.insert(events).values({
        userId: session.user.id,
        slug,
        title,
        date,
        location,
        description,
    });

    return {
        slug,
    };
});
