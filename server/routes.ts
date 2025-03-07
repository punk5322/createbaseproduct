import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.post("/api/payment", async (req, res) => {
    try {
      if (!req.user) {
        console.log("Payment attempt without authentication");
        return res.status(401).json({ message: "Unauthorized" });
      }

      await storage.updateUser(req.user.id, { paymentStatus: "completed" });
      res.json({ success: true });
    } catch (error: any) {
      console.error("Payment error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/kyc", async (req, res) => {
    if (!req.user) {
      console.log("KYC attempt without authentication");
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { driverLicenseUrl } = req.body;
      const user = await storage.updateUser(req.user.id, {
        driverLicenseUrl,
        kycStatus: "completed"
      });
      res.json(user);
    } catch (error: any) {
      console.error("KYC error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/songs", async (req, res) => {
    try {
      if (!req.user) {
        console.log("Song fetch attempt without authentication");
        return res.status(401).json({ message: "Unauthorized" });
      }

      console.log("Fetching songs for user:", req.user.id);
      const songs = await storage.getSongs(req.user.id);
      console.log("Found songs:", songs.length);
      res.json(songs);
    } catch (error: any) {
      console.error("Error fetching songs:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/songs", async (req, res) => {
    try {
      if (!req.user) {
        console.log("Song creation attempt without authentication");
        return res.status(401).json({ message: "Unauthorized" });
      }

      console.log("Creating song for user:", req.user.id, "Data:", req.body);
      const song = await storage.createSong({
        ...req.body,
        userId: req.user.id
      });
      console.log("Song created successfully:", song.id);
      res.json(song);
    } catch (error: any) {
      console.error("Error creating song:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/songs/:id", async (req, res) => {
    try {
      if (!req.user) {
        console.log("Song update attempt without authentication");
        return res.status(401).json({ message: "Unauthorized" });
      }

      console.log("Updating song:", req.params.id, "Data:", req.body);
      const song = await storage.updateSong(parseInt(req.params.id), req.body);
      console.log("Song updated successfully");
      res.json(song);
    } catch (error: any) {
      console.error("Error updating song:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/songs/:id", async (req, res) => {
    try {
      if (!req.user) {
        console.log("Song deletion attempt without authentication");
        return res.status(401).json({ message: "Unauthorized" });
      }

      console.log("Deleting song:", req.params.id);
      await storage.deleteSong(parseInt(req.params.id));
      console.log("Song deleted successfully");
      res.sendStatus(200);
    } catch (error: any) {
      console.error("Error deleting song:", error);
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}