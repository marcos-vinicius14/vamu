import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
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

export const guests = pgTable('tb_guests', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id').references(() => events.id).notNull(),
  name: text('name').notNull(),
  status: text('status').default('PENDING'), 
  companions: integer('companions').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});