import { users, songs, type User, type InsertUser, type Song } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Initial seed data for development
const INITIAL_USERS: User[] = [
  {
    id: 1,
    username: "drake",
    // Password: "password123"
    password: "5d0e1e25987b36bcdeb6a98d8c0654d3c7d68d161b5f1a45b17a17cd33073ebcee1322aec86c7c1c2fde7ef3fd3ddacc84a7a5e8e1c3b71d91e95f80ab8b52e1.f925fa51e0d0e55f",
    legalFirstName: "Aubrey",
    legalLastName: "Graham",
    artistName: "Drake",
    songwriterName: "Drake",
    spotifyArtistLink: "https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4",
    kycStatus: "completed",
    driverLicenseUrl: null,
    paymentStatus: "completed"
  }
];

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  getSongs(userId: number): Promise<Song[]>;
  createSong(song: Partial<Song>): Promise<Song>;
  updateSong(id: number, updates: Partial<Song>): Promise<Song>;
  deleteSong(id: number): Promise<void>;
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private songs: Map<number, Song>;
  private currentUserId: number;
  private currentSongId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.songs = new Map();

    // Initialize with seed data
    INITIAL_USERS.forEach(user => {
      this.users.set(user.id, user);
    });

    this.currentUserId = Math.max(...Array.from(this.users.keys())) + 1;
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
    const user: User = { 
      ...insertUser, 
      id,
      kycStatus: "pending",
      driverLicenseUrl: null,
      paymentStatus: "pending"
    };
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
    return Array.from(this.songs.values()).filter(song => song.userId === userId);
  }

  async createSong(song: Partial<Song>): Promise<Song> {
    const id = this.currentSongId++;
    const newSong: Song = {
      id,
      title: song.title!,
      artist: song.artist!,
      userId: song.userId!,
      status: song.status || "unclaimed",
      splitData: song.splitData || {
        music: [],
        lyrics: [],
        instruments: []
      }
    };
    this.songs.set(id, newSong);
    return newSong;
  }

  async updateSong(id: number, updates: Partial<Song>): Promise<Song> {
    const song = this.songs.get(id);
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