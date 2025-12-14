import type { InferSelectModel } from 'drizzle-orm'
import { events, guests } from '~/../server/database/schemas/app'



export interface EventResponse {
    id: string
    title: string
    date: string
    location: string | null
    description: string | null
    theme: string | null
    user: {
        name: string
        avatar?: string
    }
}

export type EventListItem = Pick<
    InferSelectModel<typeof events>,
    'id' | 'title' | 'slug' | 'date' | 'createdAt'
>

export type Guest = InferSelectModel<typeof guests>

export interface DashboardResponse {
    event: InferSelectModel<typeof events>
    guests: Guest[]
    stats: {
        totalGuests: number
        confirmedCount: number
        declinedCount: number
        pendingCount: number
    }
}

export type RsvpStatus = 'CONFIRMED' | 'DECLINED' | 'PENDING'

export interface RsvpFormState {
    name: string
    phone: string
}

export interface AuthFormState {
    name: string
    email: string
    password: string
}

export type AuthMode = 'login' | 'register'

export interface CreateEventFormState {
    title: string | undefined
    date: string | undefined
    location: string | undefined
    description: string | undefined
}

export interface ApiError {
    data?: {
        message?: string
    }
    statusMessage?: string
    message?: string
}
