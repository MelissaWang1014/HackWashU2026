import {sqliteTable,text,index} from 'drizzle-orm/sqlite-core';
export const profiles=sqliteTable('profiles',{id:text('id').primaryKey(),owner:text('owner').notNull(),data:text('data').notNull(),updatedAt:text('updated_at').notNull()},t=>[index('profiles_owner_idx').on(t.owner)]);
