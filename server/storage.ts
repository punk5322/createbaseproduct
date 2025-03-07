import { users, songs, type User, type InsertUser, type Song } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  getSongs(userId: number): Promise<Song[]>;
  createSong(song: Partial<Song>): Promise<Song>;
  updateSong(id: number, updates: Partial<Song>): Promise<Song>;
  deleteSong(id: number): Promise<void>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username.toLowerCase()));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        username: insertUser.username.toLowerCase(),
        kycStatus: "pending",
        driverLicenseUrl: null,
        paymentStatus: "pending",
        spotifyArtistLink: insertUser.spotifyArtistLink || null,
      })
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    if (!user) throw new Error("User not found");
    return user;
  }

  async getSongs(userId: number): Promise<Song[]> {
    return db.select().from(songs).where(eq(songs.userId, userId));
  }

  async createSong(song: Partial<Song>): Promise<Song> {
    const [newSong] = await db
      .insert(songs)
      .values({
        title: song.title!,
        artist: song.artist!,
        userId: song.userId!,
        status: song.status || "unclaimed",
        splitData: song.splitData || {
          music: [],
          lyrics: [],
          instruments: []
        }
      })
      .returning();
    return newSong;
  }

  async updateSong(id: number, updates: Partial<Song>): Promise<Song> {
    const [song] = await db
      .update(songs)
      .set(updates)
      .where(eq(songs.id, id))
      .returning();
    if (!song) throw new Error("Song not found");
    return song;
  }

  async deleteSong(id: number): Promise<void> {
    await db.delete(songs).where(eq(songs.id, id));
  }
}

export const storage = new DatabaseStorage();