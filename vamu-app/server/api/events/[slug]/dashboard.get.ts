import { db } from '../../../utils/db';
import { auth } from '../../../utils/auth';
import { events, guests } from '../../../database/schemas/app';
import { eq } from 'drizzle-orm';

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

    const slug = getRouterParam(event, 'slug');

    if (!slug) {
        throw createError({
            statusCode: 400,
            message: 'Slug do evento é obrigatório.',
        });
    }

    // 1. Fetch Event
    const eventData = await db.query.events.findFirst({
        where: eq(events.slug, slug),
    });

    if (!eventData) {
        throw createError({
            statusCode: 404,
            message: 'Evento não encontrado.',
        });
    }

    if (eventData.userId !== session.user.id) {
        throw createError({
            statusCode: 403,
            message: 'Acesso negado. Você não é o dono deste evento.',
        });
    }

    // 2. Fetch Guests
    const guestList = await db.select().from(guests).where(eq(guests.eventId, eventData.id));

    // 3. Calculate Stats
    const stats = {
        totalGuests: guestList.length,
        confirmedCount: guestList.filter((g: any) => g.status === 'CONFIRMED').length,
        declinedCount: guestList.filter((g: any) => g.status === 'DECLINED').length,
        pendingCount: guestList.filter((g: any) => g.status === 'PENDING').length,
    };

    return {
        event: eventData,
        guests: guestList,
        stats,
    };
});
