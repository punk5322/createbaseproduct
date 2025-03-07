import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.post("/api/payment", async (req, res) => {
    try {
      // Mock payment success
      if (req.user) {
        await storage.updateUser(req.user.id, { paymentStatus: "completed" });
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/kyc", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");

    try {
      const { driverLicenseUrl } = req.body;
      const user = await storage.updateUser(req.user.id, {
        driverLicenseUrl,
        kycStatus: "completed"
      });
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/songs", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");

    try {
      const songs = await storage.getSongs(req.user.id);
      res.json(songs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/songs", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");

    try {
      const song = await storage.createSong({
        ...req.body,
        userId: req.user.id
      });
      res.json(song);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/songs/:id", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");

    try {
      const song = await storage.updateSong(parseInt(req.params.id), req.body);
      res.json(song);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/songs/:id", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");

    try {
      await storage.deleteSong(parseInt(req.params.id));
      res.sendStatus(200);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}