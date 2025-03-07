import { User, InsertUser, Song, InsertSong } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  
  getSongs(userId: number): Promise<Song[]>;
  getSong(id: number): Promise<Song | undefined>;
  createSong(song: InsertSong): Promise<Song>;
  updateSong(id: number, updates: Partial<Song>): Promise<Song>;
  deleteSong(id: number): Promise<void>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private songs: Map<number, Song>;
  private currentUserId: number;
  private currentSongId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.songs = new Map();
    this.currentUserId = 1;
    this.currentSongId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, kycVerified: false, paymentCompleted: false };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getSongs(userId: number): Promise<Song[]> {
    return Array.from(this.songs.values()).filter(
      (song) => song.artistId === userId,
    );
  }

  async getSong(id: number): Promise<Song | undefined> {
    return this.songs.get(id);
  }

  async createSong(song: InsertSong): Promise<Song> {
    const id = this.currentSongId++;
    const newSong: Song = { ...song, id };
    this.songs.set(id, newSong);
    return newSong;
  }

  async updateSong(id: number, updates: Partial<Song>): Promise<Song> {
    const song = await this.getSong(id);
    if (!song) throw new Error("Song not found");

    const updatedSong = { ...song, ...updates };
    this.songs.set(id, updatedSong);
    return updatedSong;
  }

  async deleteSong(id: number): Promise<void> {
    this.songs.delete(id);
  }
}

export const storage = new MemStorage();
