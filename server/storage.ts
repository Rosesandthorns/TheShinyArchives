import { 
  Pokemon, 
  Game, 
  PokemonWithGames, 
  InsertPokemon, 
  InsertGame, 
  PokemonDetailResponse,
  PokemonSpeciesResponse,
  EvolutionChainResponse
} from "@shared/schema";
import axios from "axios";

// Modify the interface with any CRUD methods you might need
export interface IStorage {
  // Pokemon methods
  getPokemon(id: number): Promise<PokemonWithGames | undefined>;
  getPokemonByName(name: string): Promise<PokemonWithGames | undefined>;
  getPokemonList(limit: number, offset: number): Promise<PokemonWithGames[]>;
  getPokemonById(id: number): Promise<PokemonWithGames | undefined>;
  createPokemon(pokemon: InsertPokemon): Promise<Pokemon>;
  searchPokemon(query: string): Promise<PokemonWithGames[]>;
  
  // Game methods
  getAllGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  getGameByName(name: string): Promise<Game | undefined>;
  getGameByShortCode(shortCode: string): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;

  // Pokemon-Game methods
  getPokemonByGame(gameId: number): Promise<PokemonWithGames[]>;

  // Initialize the storage with data from the PokeAPI
  initialize(): Promise<void>;
}

export class MemStorage implements IStorage {
  private pokemons: Map<number, Pokemon>;
  private games: Map<number, Game>;
  private pokemonGames: Map<number, number[]>; // Maps pokemonId to an array of gameIds
  private currentPokemonId: number;
  private currentGameId: number;
  private initialized: boolean;

  constructor() {
    this.pokemons = new Map();
    this.games = new Map();
    this.pokemonGames = new Map();
    this.currentPokemonId = 1;
    this.currentGameId = 1;
    this.initialized = false;
  }

  async getPokemon(id: number): Promise<PokemonWithGames | undefined> {
    const pokemon = this.pokemons.get(id);
    if (!pokemon) return undefined;
    
    return this.attachGames(pokemon);
  }

  async getPokemonByName(name: string): Promise<PokemonWithGames | undefined> {
    const normalizedName = name.toLowerCase();
    const pokemon = Array.from(this.pokemons.values()).find(
      (p) => p.name.toLowerCase() === normalizedName
    );
    
    if (!pokemon) return undefined;
    
    return this.attachGames(pokemon);
  }

  async getPokemonList(limit: number, offset: number): Promise<PokemonWithGames[]> {
    const pokemonArray = Array.from(this.pokemons.values())
      .sort((a, b) => a.pokeId - b.pokeId)
      .slice(offset, offset + limit);
    
    return Promise.all(pokemonArray.map(pokemon => this.attachGames(pokemon)));
  }

  async getPokemonById(id: number): Promise<PokemonWithGames | undefined> {
    const pokemon = Array.from(this.pokemons.values()).find(
      (p) => p.pokeId === id
    );
    
    if (!pokemon) return undefined;
    
    return this.attachGames(pokemon);
  }

  async createPokemon(pokemonData: InsertPokemon): Promise<Pokemon> {
    const id = this.currentPokemonId++;
    const pokemon: Pokemon = { id, ...pokemonData };
    this.pokemons.set(id, pokemon);
    return pokemon;
  }

  async searchPokemon(query: string): Promise<PokemonWithGames[]> {
    const normalizedQuery = query.toLowerCase();
    const matchingPokemon = Array.from(this.pokemons.values()).filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(normalizedQuery) ||
        pokemon.pokeId.toString().includes(normalizedQuery)
    );
    
    return Promise.all(matchingPokemon.map(pokemon => this.attachGames(pokemon)));
  }

  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values()).sort((a, b) => a.generation - b.generation);
  }

  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async getGameByName(name: string): Promise<Game | undefined> {
    const normalizedName = name.toLowerCase();
    return Array.from(this.games.values()).find(
      (game) => game.name.toLowerCase() === normalizedName
    );
  }

  async getGameByShortCode(shortCode: string): Promise<Game | undefined> {
    const normalizedShortCode = shortCode.toLowerCase();
    return Array.from(this.games.values()).find(
      (game) => game.shortCode.toLowerCase() === normalizedShortCode
    );
  }

  async createGame(gameData: InsertGame): Promise<Game> {
    const id = this.currentGameId++;
    const game: Game = { id, ...gameData };
    this.games.set(id, game);
    return game;
  }

  async getPokemonByGame(gameId: number): Promise<PokemonWithGames[]> {
    const pokemonIds: number[] = [];
    
    // Find all Pokemon that appear in the given game
    this.pokemonGames.forEach((gameIds, pokemonId) => {
      if (gameIds.includes(gameId)) {
        pokemonIds.push(pokemonId);
      }
    });
    
    const pokemons = pokemonIds
      .map(id => this.pokemons.get(id))
      .filter((pokemon): pokemon is Pokemon => pokemon !== undefined);
    
    return Promise.all(pokemons.map(pokemon => this.attachGames(pokemon)));
  }

  private async attachGames(pokemon: Pokemon): Promise<PokemonWithGames> {
    const gameIds = this.pokemonGames.get(pokemon.id) || [];
    const games = gameIds.map(id => this.games.get(id)).filter((game): game is Game => game !== undefined);
    
    return {
      ...pokemon,
      games,
    };
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Initialize games
      await this.initializeGames();
      
      // Initialize Pokémon data
      await this.initializePokemon();
      
      this.initialized = true;
    } catch (error) {
      console.error("Error initializing storage:", error);
      throw error;
    }
  }

  private async initializeGames(): Promise<void> {
    // Define game data manually as it's not easily available from PokeAPI in the structure we need
    const gamesData = [
      { name: "Red/Blue", shortCode: "RB", color: "#EE1515", generation: 1 },
      { name: "Yellow", shortCode: "Y", color: "#FFD733", generation: 1 },
      { name: "Gold/Silver", shortCode: "GS", color: "#B69E00", generation: 2 },
      { name: "Crystal", shortCode: "C", color: "#7B63E7", generation: 2 },
      { name: "Ruby/Sapphire", shortCode: "RS", color: "#A00000", generation: 3 },
      { name: "Emerald", shortCode: "E", color: "#00A000", generation: 3 },
      { name: "FireRed/LeafGreen", shortCode: "FRLG", color: "#FF7327", generation: 3 },
      { name: "Diamond/Pearl", shortCode: "DP", color: "#5A5A5A", generation: 4 },
      { name: "Platinum", shortCode: "Pt", color: "#999999", generation: 4 },
      { name: "HeartGold/SoulSilver", shortCode: "HGSS", color: "#B69E00", generation: 4 },
      { name: "Black/White", shortCode: "BW", color: "#444444", generation: 5 },
      { name: "Black 2/White 2", shortCode: "B2W2", color: "#222222", generation: 5 },
      { name: "X/Y", shortCode: "XY", color: "#025DA6", generation: 6 },
      { name: "Omega Ruby/Alpha Sapphire", shortCode: "ORAS", color: "#AB2813", generation: 6 },
      { name: "Sun/Moon", shortCode: "SM", color: "#F1912B", generation: 7 },
      { name: "Ultra Sun/Ultra Moon", shortCode: "USUM", color: "#E95B2B", generation: 7 },
      { name: "Let's Go Pikachu/Eevee", shortCode: "LGPE", color: "#FFC524", generation: 7 },
      { name: "Sword/Shield", shortCode: "SwSh", color: "#00A1E9", generation: 8 },
      { name: "Brilliant Diamond/Shining Pearl", shortCode: "BDSP", color: "#AAAAAA", generation: 8 },
      { name: "Legends: Arceus", shortCode: "LA", color: "#3A4A77", generation: 8 },
      { name: "Scarlet/Violet", shortCode: "SV", color: "#BF004F", generation: 9 }
    ];
    
    for (const gameData of gamesData) {
      await this.createGame(gameData);
    }
  }

  private async initializePokemon(): Promise<void> {
    try {
      // Get all 1025 Pokémon
      const limit = 1025; // Maximum Pokémon to fetch
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
      const results = response.data.results;
      
      console.log(`Fetching data for ${results.length} Pokémon...`);
      
      // Process each Pokémon
      let count = 0;
      for (const result of results) {
        try {
          await this.processPokemon(result.url);
          count++;
          if (count % 50 === 0) {
            console.log(`Processed ${count}/${results.length} Pokémon`);
          }
        } catch (error) {
          console.error(`Error processing Pokémon ${result.name}:`, error);
        }
      }
      
      console.log(`Successfully loaded all ${count} Pokémon`);
    } catch (error) {
      console.error("Error fetching Pokémon list:", error);
      throw error;
    }
  }

  private async processPokemon(url: string): Promise<void> {
    // Fetch Pokémon details
    const response = await axios.get<PokemonDetailResponse>(url);
    const pokemonData = response.data;
    
    // Fetch species data for description and evolution chain
    const speciesResponse = await axios.get<PokemonSpeciesResponse>(pokemonData.species.url);
    const speciesData = speciesResponse.data;
    
    // Get English description
    const description = speciesData.flavor_text_entries
      .find(entry => entry.language.name === "en")?.flavor_text.replace(/\f/g, ' ') || "";
    
    // Fetch evolution chain
    let evolutionChain = null;
    if (speciesData.evolution_chain) {
      const evolutionResponse = await axios.get<EvolutionChainResponse>(speciesData.evolution_chain.url);
      evolutionChain = evolutionResponse.data.chain;
    }
    
    // Extract types
    const types = pokemonData.types.map(typeInfo => typeInfo.type.name);
    
    // Extract abilities
    const abilities = pokemonData.abilities.map(abilityInfo => 
      `${abilityInfo.ability.name}${abilityInfo.is_hidden ? " (Hidden)" : ""}`
    );
    
    // Extract stats
    const stats = pokemonData.stats.reduce((acc, stat) => {
      acc[stat.stat.name] = stat.base_stat;
      return acc;
    }, {} as Record<string, number>);
    
    // Create Pokemon
    const pokemon: InsertPokemon = {
      pokeId: pokemonData.id,
      name: pokemonData.name,
      types,
      sprite: pokemonData.sprites.other["official-artwork"].front_default || pokemonData.sprites.front_default,
      shinySprite: pokemonData.sprites.other["official-artwork"].front_shiny || pokemonData.sprites.front_shiny,
      height: pokemonData.height,
      weight: pokemonData.weight,
      abilities,
      stats,
      gameIndices: pokemonData.game_indices,
      description,
      evolutionChain: evolutionChain,
    };
    
    const createdPokemon = await this.createPokemon(pokemon);
    
    // Map Pokémon to games
    const gameAppearances = this.mapPokemonToGames(pokemonData);
    this.pokemonGames.set(createdPokemon.id, gameAppearances);
  }

  private mapPokemonToGames(pokemonData: PokemonDetailResponse): number[] {
    const gameAppearances: number[] = [];
    const gameVersionMap: Record<string, string> = {
      "red": "RB",
      "blue": "RB",
      "yellow": "Y",
      "gold": "GS",
      "silver": "GS",
      "crystal": "C",
      "ruby": "RS",
      "sapphire": "RS",
      "emerald": "E",
      "firered": "FRLG",
      "leafgreen": "FRLG",
      "diamond": "DP",
      "pearl": "DP",
      "platinum": "Pt",
      "heartgold": "HGSS",
      "soulsilver": "HGSS",
      "black": "BW",
      "white": "BW",
      "black-2": "B2W2",
      "white-2": "B2W2",
      "x": "XY",
      "y": "XY",
      "omega-ruby": "ORAS",
      "alpha-sapphire": "ORAS",
      "sun": "SM",
      "moon": "SM",
      "ultra-sun": "USUM",
      "ultra-moon": "USUM",
      "lets-go-pikachu": "LGPE",
      "lets-go-eevee": "LGPE",
      "sword": "SwSh",
      "shield": "SwSh",
      "brilliant-diamond": "BDSP",
      "shining-pearl": "BDSP",
      "legends-arceus": "LA",
      "scarlet": "SV",
      "violet": "SV"
    };
    
    // Process game indices
    const gameShortCodes = new Set<string>();
    for (const gameIndex of pokemonData.game_indices) {
      const version = gameIndex.version.name;
      const shortCode = gameVersionMap[version];
      if (shortCode) {
        gameShortCodes.add(shortCode);
      }
    }
    
    // Find and add corresponding game IDs
    // Convert the Set to an Array first to avoid iteration issues
    Array.from(gameShortCodes).forEach(shortCode => {
      const game = Array.from(this.games.values()).find(g => g.shortCode === shortCode);
      if (game) {
        gameAppearances.push(game.id);
      }
    });
    
    return gameAppearances;
  }
}

export const storage = new MemStorage();
