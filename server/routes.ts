import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize storage with data from PokeAPI
  console.log("Initializing storage with data from PokeAPI...");
  await storage.initialize();
  console.log("Storage initialized successfully!");

  // API routes - prefix all routes with /api
  app.get("/api/pokemon", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const pokemon = await storage.getPokemonList(limit, offset);
      res.json(pokemon);
    } catch (error) {
      console.error("Error fetching pokemon:", error);
      res.status(500).json({ message: "Failed to fetch pokemon" });
    }
  });

  app.get("/api/pokemon/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      
      const pokemon = await storage.searchPokemon(query);
      res.json(pokemon);
    } catch (error) {
      console.error("Error searching pokemon:", error);
      res.status(500).json({ message: "Failed to search pokemon" });
    }
  });

  app.get("/api/pokemon/:idOrName", async (req, res) => {
    try {
      const idOrName = req.params.idOrName;
      let pokemon;
      
      // Check if it's an ID or a name
      if (/^\d+$/.test(idOrName)) {
        pokemon = await storage.getPokemonById(parseInt(idOrName));
      } else {
        pokemon = await storage.getPokemonByName(idOrName);
      }
      
      if (!pokemon) {
        return res.status(404).json({ message: "Pokemon not found" });
      }
      
      res.json(pokemon);
    } catch (error) {
      console.error("Error fetching pokemon details:", error);
      res.status(500).json({ message: "Failed to fetch pokemon details" });
    }
  });

  app.get("/api/games", async (req, res) => {
    try {
      const games = await storage.getAllGames();
      res.json(games);
    } catch (error) {
      console.error("Error fetching games:", error);
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  app.get("/api/games/:id", async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      const game = await storage.getGame(gameId);
      
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      res.json(game);
    } catch (error) {
      console.error("Error fetching game details:", error);
      res.status(500).json({ message: "Failed to fetch game details" });
    }
  });

  app.get("/api/games/:id/pokemon", async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      const pokemon = await storage.getPokemonByGame(gameId);
      res.json(pokemon);
    } catch (error) {
      console.error("Error fetching pokemon by game:", error);
      res.status(500).json({ message: "Failed to fetch pokemon by game" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
