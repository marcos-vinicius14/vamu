import { pgTable, text, timestamp, uuid, integer, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth';

export const events = pgTable('tb_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => user.id).notNull(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  date: timestamp('date').notNull(),
  location: text('location'),
  theme: text('theme').default('default'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const eventsRelations = relations(events, ({ one, many }) => ({
  user: one(user, {
    fields: [events.userId],
    references: [user.id],
  }),
  guests: many(guests),
}));

export const guests = pgTable('tb_guests', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id').references(() => events.id).notNull(),
  name: text('name').notNull(),
  phoneNumber: text('phone_number'),
  status: text('status').default('PENDING'),
  companions: integer('companions').default(0),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  eventIdx: index('event_idx').on(table.eventId)
}));

export const guestsRelations = relations(guests, ({ one }) => ({
  event: one(events, {
    fields: [guests.eventId],
    references: [events.id],
  }),
}));