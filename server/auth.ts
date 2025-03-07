import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  try {
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    const match = timingSafeEqual(hashedBuf, suppliedBuf);
    console.log("Password comparison:", { match, salt });
    return match;
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
}

// Initial song catalog data
const INITIAL_SONGS = [
  {
    title: "Privileged Rappers",
    artist: "Drake & 21 Savage",
    status: "unclaimed",
    splitData: {
      music: [
        { name: "Drake", percentage: 50 },
        { name: "21 Savage", percentage: 50 }
      ],
      lyrics: [
        { name: "Drake", percentage: 50 },
        { name: "21 Savage", percentage: 50 }
      ],
      instruments: [
        { name: "Audio Engineer 1", percentage: 25 },
        { name: "Audio Engineer 2", percentage: 25 },
        { name: "Producer 1", percentage: 25 },
        { name: "Producer 2", percentage: 25 }
      ]
    }
  },
  {
    title: "Money In The Grave",
    artist: "Drake & Rick Ross",
    status: "unclaimed",
    splitData: {
      music: [
        { name: "Drake", percentage: 60 },
        { name: "Rick Ross", percentage: 40 }
      ],
      lyrics: [
        { name: "Drake", percentage: 70 },
        { name: "Rick Ross", percentage: 30 }
      ],
      instruments: [
        { name: "Producer", percentage: 50 },
        { name: "Audio Engineer", percentage: 30 },
        { name: "Vocals (Drake)", percentage: 10 },
        { name: "Vocals (Rick Ross)", percentage: 10 }
      ]
    }
  },
  {
    title: "Rich Flex",
    artist: "Drake & 21 Savage",
    status: "claimed",
    splitData: {
      music: [
        { name: "Drake", percentage: 50 },
        { name: "21 Savage", percentage: 50 }
      ],
      lyrics: [
        { name: "Drake", percentage: 55 },
        { name: "21 Savage", percentage: 45 }
      ],
      instruments: [
        { name: "Producer", percentage: 35 },
        { name: "Audio Engineer", percentage: 25 },
        { name: "Vocals (Drake)", percentage: 20 },
        { name: "Vocals (21 Savage)", percentage: 20 }
      ]
    }
  }
];

async function copyInitialSongCatalog(userId: number) {
  try {
    console.log("Copying initial song catalog for user:", userId);
    for (const songData of INITIAL_SONGS) {
      await storage.createSong({
        ...songData,
        userId
      });
    }
    console.log("Successfully copied song catalog");
  } catch (error) {
    console.error("Error copying song catalog:", error);
    throw error;
  }
}

export function setupAuth(app: Express) {
  const sessionSecret = process.env.SESSION_SECRET || 'dev_session_secret_key_123';

  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log("Login attempt for username:", username);
        const user = await storage.getUserByUsername(username);
        console.log("User found:", user ? "yes" : "no");

        if (!user) {
          console.log("User not found");
          return done(null, false, { message: "Invalid username or password" });
        }

        const isValid = await comparePasswords(password, user.password);
        console.log("Password valid:", isValid);

        if (!isValid) {
          return done(null, false, { message: "Invalid username or password" });
        }

        return done(null, user);
      } catch (err) {
        console.error("Authentication error:", err);
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      console.log("Registration attempt:", req.body.username);

      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
      });

      // Copy initial song catalog for the new user
      await copyInitialSongCatalog(user.id);

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    console.log("Login request received:", req.body.username);

    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        console.error("Login error:", err);
        return next(err);
      }
      if (!user) {
        console.log("Authentication failed:", info?.message);
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      req.login(user, (err) => {
        if (err) {
          console.error("Session error:", err);
          return next(err);
        }
        console.log("Login successful for user:", user.username);
        res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}