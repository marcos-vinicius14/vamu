import { eventsRepository } from './events.repository';
import { guestsRepository } from '../guests/guests.repository';
import { generateSlug } from '../../utils/slug';
import type {
    CreateEventInput,
    EventSummary,
    PublicEventResponse,
    DashboardResponse,
    CreateEventResponse,
    Event,
} from './events.dto';
import type { GuestStats, Guest } from '../guests/guests.dto';

export type ServiceResult<T> =
    | { success: true; data: T }
    | { success: false; reason: 'NOT_FOUND' | 'FORBIDDEN' };

export const eventsService = {
    async create(userId: string, input: CreateEventInput): Promise<CreateEventResponse> {
        const slug = generateSlug(input.title);
        await eventsRepository.create(userId, slug, input);
        return { slug };
    },

    async getBySlug(slug: string): Promise<ServiceResult<Event>> {
        const outcome = await eventsRepository.findBySlug(slug);
        if (!outcome.success) {
            return { success: false, reason: 'NOT_FOUND' };
        }
        return { success: true, data: outcome.data };
    },

    async getPublicEvent(slug: string): Promise<ServiceResult<PublicEventResponse>> {
        const outcome = await eventsRepository.findBySlugWithUser(slug);

        if (!outcome.success) {
            return { success: false, reason: 'NOT_FOUND' };
        }

        const { event, user } = outcome.data;

        return {
            success: true,
            data: {
                id: event.id,
                title: event.title,
                date: event.date,
                location: event.location,
                description: event.description,
                theme: event.theme,
                user,
            },
        };
    },

    async getUserEvents(userId: string): Promise<EventSummary[]> {
        return eventsRepository.findByUserId(userId);
    },

    async getDashboard(userId: string, slug: string): Promise<ServiceResult<DashboardResponse>> {
        const outcome = await eventsRepository.findBySlug(slug);

        if (!outcome.success) {
            return { success: false, reason: 'NOT_FOUND' };
        }

        const event = outcome.data;

        if (event.userId !== userId) {
            return { success: false, reason: 'FORBIDDEN' };
        }

        const guests = await guestsRepository.findByEventId(event.id);
        const stats = this.calculateGuestStats(guests);

        return {
            success: true,
            data: {
                event,
                guests,
                stats,
            },
        };
    },

    calculateGuestStats(guests: Guest[]): GuestStats {
        return {
            totalGuests: guests.length,
            confirmedCount: guests.filter((g) => g.status === 'CONFIRMED').length,
            declinedCount: guests.filter((g) => g.status === 'DECLINED').length,
            pendingCount: guests.filter((g) => g.status === 'PENDING').length,
        };
    },
};
