import { describe, test, expect, mock, beforeAll } from "bun:test";

(global as any).defineEventHandler = (handler: any) => handler;
(global as any).getRouterParam = (event: any, name: string) => event.params[name];
(global as any).createError = (err: any) => err;

const mockFindFirst = mock();
const mockWhere = mock();

mock.module("../server/utils/db", () => ({
    db: {
        query: {
            events: {
                findFirst: mockFindFirst
            }
        },
        select: () => ({
            from: () => ({
                where: mockWhere
            })
        })
    }
}));

mock.module("../server/database/schemas/app", () => ({
    events: { slug: 'slug', id: 'id' },
    guests: { eventId: 'eventId', status: 'status' }
}));
mock.module("drizzle-orm", () => ({
    eq: () => 'eq_stub',
    like: () => 'like_stub',
    relations: () => 'relations_stub',
    and: () => 'and_stub',
    or: () => 'or_stub',
    desc: () => 'desc_stub',
    asc: () => 'asc_stub',
    inArray: () => 'inArray_stub',
    count: () => 'count_stub',
    sum: () => 'sum_stub',
    max: () => 'max_stub',
    min: () => 'min_stub',
    avg: () => 'avg_stub',
    ne: () => 'ne_stub',
    gt: () => 'gt_stub',
    gte: () => 'gte_stub',
    lt: () => 'lt_stub',
    lte: () => 'lte_stub',
    not: () => 'not_stub',
    isNull: () => 'isNull_stub',
    isNotNull: () => 'isNotNull_stub',
    notInArray: () => 'notInArray_stub',
    sql: { append: () => { } }
}));


mock.module("../server/utils/auth", () => ({
    auth: {
        api: {
            getSession: mock(() => ({ user: { id: "user_123" } }))
        }
    }
}));

const handler = (await import("../server/api/events/[slug]/dashboard.get.ts")).default;

describe("Dashboard API Integration", () => {
    test("Calculates guest stats correctly", async () => {
        // Arrange
        const eventData = { id: 'evt_123', title: 'My Viral Event', userId: 'user_123' };
        mockFindFirst.mockResolvedValue(eventData);

        const guestList = [
            { id: 1, status: 'CONFIRMED' },
            { id: 2, status: 'CONFIRMED' },
            { id: 3, status: 'DECLINED' },
            { id: 4, status: 'PENDING' },
            { id: 5, status: 'PENDING' }
        ];
        mockWhere.mockResolvedValue(guestList);

        const event = { params: { slug: 'viral-event' }, headers: new Headers() };

        // Act
        const result = await handler(event);

        // Assert
        expect(result.event).toEqual(eventData);
        expect(result.stats.totalGuests).toBe(5);
        expect(result.stats.confirmedCount).toBe(2);
        expect(result.stats.declinedCount).toBe(1);
        expect(result.stats.pendingCount).toBe(2);
    });

    test("Throws 404 if event not found", async () => {
        mockFindFirst.mockResolvedValue(null);
        const event = { params: { slug: 'imaginary-event' }, headers: new Headers() };

        try {
            await handler(event);
        } catch (e: any) {
            expect(e.statusCode).toBe(404);
            expect(e.message).toBe('Evento não encontrado.');
        }
    });
});
