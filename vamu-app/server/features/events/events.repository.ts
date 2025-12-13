import { eq, desc } from 'drizzle-orm';
import { db } from '../../utils/db';
import { events } from '../../database/schemas/app';
import { user } from '../../database/schemas/auth';
import type { Event, EventSummary, CreateEventInput } from './events.dto';

export type FindResult<T> =
    | { success: true; data: T }
    | { success: false; reason: 'NOT_FOUND' };

export type EventWithUser = {
    event: Event;
    user: { name: string; image: string | null } | null;
};

export type PublicEvent = {
    id: string;
    title: string;
    date: Date | null;
    location: string | null;
    description: string | null;
    theme: string | null;
    user: { name: string } | null;
};

export const eventsRepository = {
    async findBySlug(slug: string): Promise<FindResult<Event>> {
        const result = await db.query.events.findFirst({
            where: eq(events.slug, slug),
        });
        return result
            ? { success: true, data: result }
            : { success: false, reason: 'NOT_FOUND' };
    },

    async findBySlugWithUser(slug: string): Promise<FindResult<EventWithUser>> {
        const eventData = await db.query.events.findFirst({
            where: eq(events.slug, slug),
        });

        if (!eventData) {
            return { success: false, reason: 'NOT_FOUND' };
        }

        const userData = await db.query.user.findFirst({
            where: eq(user.id, eventData.userId),
            columns: {
                name: true,
                image: true,
            },
        });

        return {
            success: true,
            data: {
                event: eventData,
                user: userData ?? null,
            },
        };
    },

    async findPublicBySlug(slug: string): Promise<FindResult<PublicEvent>> {
        const result = await db.query.events.findFirst({
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
        return result
            ? { success: true, data: result }
            : { success: false, reason: 'NOT_FOUND' };
    },

    async findByUserId(userId: string): Promise<EventSummary[]> {
        const result = await db
            .select({
                id: events.id,
                title: events.title,
                slug: events.slug,
                date: events.date,
                createdAt: events.createdAt,
            })
            .from(events)
            .where(eq(events.userId, userId))
            .orderBy(desc(events.createdAt));

        return result;
    },

    async create(
        userId: string,
        slug: string,
        data: CreateEventInput
    ): Promise<void> {
        await db.insert(events).values({
            userId,
            slug,
            title: data.title,
            date: data.date,
            location: data.location,
            description: data.description,
        });
    },
};
