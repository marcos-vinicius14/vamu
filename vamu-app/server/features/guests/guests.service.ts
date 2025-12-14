import { guestsRepository } from './guests.repository';
import type { RsvpInput, RsvpResponse } from './guests.dto';

export const guestsService = {
    async createRsvp(input: RsvpInput): Promise<RsvpResponse> {
        await guestsRepository.create(input);
        return { success: true };
    },
};
