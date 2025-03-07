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
    try {
      console.log("Fetching user by ID:", id);
      const [user] = await db.select().from(users).where(eq(users.id, id));
      console.log("User found:", user ? "yes" : "no");
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      console.log("Fetching user by username:", username);
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username.toLowerCase()));
      console.log("User found:", user ? "yes" : "no");
      return user;
    } catch (error) {
      console.error("Error fetching user by username:", error);
      throw error;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      console.log("Creating new user:", insertUser.username);
      const [user] = await db
        .insert(users)
        .values({
          ...insertUser,
          username: insertUser.username.toLowerCase(),
          kycStatus: "pending",
          driverLicenseUrl: null,
          paymentStatus: "pending",
          spotifyArtistLink: insertUser.spotifyArtistLink || null,
          isNewUser: true,
        })
        .returning();
      console.log("User created successfully");
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    try {
      console.log("Updating user:", id);
      const [user] = await db
        .update(users)
        .set(updates)
        .where(eq(users.id, id))
        .returning();
      if (!user) throw new Error("User not found");
      console.log("User updated successfully");
      return user;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async getSongs(userId: number): Promise<Song[]> {
    try {
      console.log("Fetching songs for user:", userId);
      const songs = await db.select().from(songs).where(eq(songs.userId, userId));
      console.log("Songs found:", songs.length);
      return songs;
    } catch (error) {
      console.error("Error fetching songs:", error);
      throw error;
    }
  }

  async createSong(song: Partial<Song>): Promise<Song> {
    try {
      console.log("Creating new song:", song.title);
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
      console.log("Song created successfully");
      return newSong;
    } catch (error) {
      console.error("Error creating song:", error);
      throw error;
    }
  }

  async updateSong(id: number, updates: Partial<Song>): Promise<Song> {
    try {
      console.log("Updating song:", id);
      const [song] = await db
        .update(songs)
        .set(updates)
        .where(eq(songs.id, id))
        .returning();
      if (!song) throw new Error("Song not found");
      console.log("Song updated successfully");
      return song;
    } catch (error) {
      console.error("Error updating song:", error);
      throw error;
    }
  }

  async deleteSong(id: number): Promise<void> {
    try {
      console.log("Deleting song:", id);
      await db.delete(songs).where(eq(songs.id, id));
      console.log("Song deleted successfully");
    } catch (error) {
      console.error("Error deleting song:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();