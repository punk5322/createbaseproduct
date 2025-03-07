import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  legalFirstName: text("legal_first_name").notNull(),
  legalLastName: text("legal_last_name").notNull(),
  artistName: text("artist_name").notNull(),
  songwriterName: text("songwriter_name").notNull(),
  spotifyLink: text("spotify_link"),
  kycVerified: boolean("kyc_verified").default(false),
  paymentCompleted: boolean("payment_completed").default(false)
});

export const songs = pgTable("songs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artistId: integer("artist_id").references(() => users.id),
  splitPercentage: integer("split_percentage").notNull(),
  numberOfSplits: integer("number_of_splits").notNull(),
  status: text("status").notNull(), // unclaimed, claimed, intermediate
  musicSplit: text("music_split").notNull(), // JSON string of split data
  lyricsSplit: text("lyrics_split").notNull(),
  instrumentalSplit: text("instrumental_split").notNull()
});

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, kycVerified: true, paymentCompleted: true });

export const insertSongSchema = createInsertSchema(songs)
  .omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Song = typeof songs.$inferSelect;
