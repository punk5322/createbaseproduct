import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
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
  spotifyArtistLink: text("spotify_artist_link"),
  kycStatus: text("kyc_status").default("pending"),
  driverLicenseUrl: text("driver_license_url"),
  paymentStatus: text("payment_status").default("pending"),
});

export const songs = pgTable("songs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  status: text("status").default("unclaimed"), // unclaimed, claimed, intermediate
  splitData: jsonb("split_data").$type<{
    music: { name: string; percentage: number }[];
    lyrics: { name: string; percentage: number }[];
    instruments: { name: string; percentage: number }[];
  }>(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  legalFirstName: true,
  legalLastName: true,
  artistName: true,
  songwriterName: true,
  spotifyArtistLink: true,
});

export const insertSongSchema = createInsertSchema(songs).pick({
  title: true,
  artist: true,
  status: true,
  splitData: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Song = typeof songs.$inferSelect;
