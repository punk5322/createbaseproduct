import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import SpotifyWebApi from "spotify-web-api-node";

// Initialize Spotify API client
const spotifyApi = new SpotifyWebApi({
 clientId: process.env.SPOTIFY_CLIENT_ID,
 clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

// Function to refresh Spotify access token
async function refreshSpotifyToken() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    console.log("Spotify token refreshed successfully");
  } catch (error) {
    console.error("Error refreshing Spotify token:", error);
  }
}

// Refresh token initially and every 30 minutes
refreshSpotifyToken();
setInterval(refreshSpotifyToken, 30 * 60 * 1000);

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Add new payment route
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

  // Modify find-royalties endpoint to check payment status
  app.post("/api/find-royalties", async (req, res) => {
    try {
      if (!req.user) {
        console.log("Royalty search attempt without authentication");
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Check payment status before proceeding
      if (req.user.paymentStatus !== "completed") {
        return res.status(403).json({ 
          message: "Payment required",
          redirectTo: "/payment"
        });
      }

      const { artistLink } = req.body;
      if (!artistLink) {
        return res.status(400).json({ message: "Artist link is required" });
      }

      // Extract artist ID from Spotify link
      const artistId = artistLink.split("artist/")[1]?.split("?")[0];
      if (!artistId) {
        return res.status(400).json({ message: "Invalid Spotify artist link" });
      }

      // Get artist's top tracks
      const artistData = await spotifyApi.getArtistTopTracks(artistId, 'US');

      const songs = artistData.body.tracks.map(track => ({
        id: track.id,
        title: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        releaseDate: track.album.release_date,
        previewUrl: track.preview_url,
        selected: false
      }));

      console.log("Found songs for artist:", songs.length);
      res.json({ songs });
    } catch (error: any) {
      console.error("Error searching for royalties:", error);
      res.status(500).json({ 
        message: "Error searching for royalties",
        error: error.message 
      });
    }
  });

  // Save selected songs endpoint
  app.post("/api/save-selected-songs", async (req, res) => {
    try {
      if (!req.user) {
        console.log("Song save attempt without authentication");
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { songs } = req.body;
      if (!Array.isArray(songs)) {
        return res.status(400).json({ message: "Invalid songs data" });
      }

      // Check KYC status before allowing song save
      if (req.user.kycStatus !== "completed") {
        return res.status(403).json({ 
          message: "KYC verification required",
          redirectTo: "/kyc"
        });
      }

      // Save each selected song
      const savedSongs = await Promise.all(
        songs.map(song => 
          storage.createSong({
            userId: req.user!.id,
            title: song.title,
            artist: song.artist,
            status: "unclaimed",
            splitData: {
              music: [{ name: song.artist, percentage: 100 }],
              lyrics: [{ name: song.artist, percentage: 100 }],
              instruments: []
            }
          })
        )
      );

      console.log("Saved songs:", savedSongs.length);
      res.json({ success: true, songs: savedSongs });
    } catch (error: any) {
      console.error("Error saving songs:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/user", async (req, res) => {
    try {
      if (!req.user) {
        console.log("User update attempt without authentication");
        return res.status(401).json({ message: "Unauthorized" });
      }

      console.log("Updating user:", req.user.id, "Data:", req.body);
      const user = await storage.updateUser(req.user.id, req.body);
      console.log("User updated successfully");
      res.json(user);
    } catch (error: any) {
      console.error("Error updating user:", error);
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