import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Pokemon schema
export const pokemons = pgTable("pokemons", {
  id: serial("id").primaryKey(),
  pokeId: integer("poke_id").notNull(),
  name: text("name").notNull(),
  types: text("types").array().notNull(),
  sprite: text("sprite").notNull(),
  shinySprite: text("shiny_sprite").notNull(),
  height: integer("height").notNull(),
  weight: integer("weight").notNull(),
  abilities: text("abilities").array().notNull(),
  stats: jsonb("stats").notNull(),
  gameIndices: jsonb("game_indices").notNull(),
  description: text("description"),
  evolutionChain: jsonb("evolution_chain"),
});

// Pokemon Game Appearances schema
export const gameAppearances = pgTable("game_appearances", {
  id: serial("id").primaryKey(),
  pokemonId: integer("pokemon_id").notNull(),
  gameId: integer("game_id").notNull(),
  hasShiny: boolean("has_shiny").default(false),
});

// Games schema
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shortCode: text("short_code").notNull(),
  color: text("color").notNull(),
  generation: integer("generation").notNull(),
});

// Insert schemas
export const insertPokemonSchema = createInsertSchema(pokemons).omit({ id: true });
export const insertGameAppearanceSchema = createInsertSchema(gameAppearances).omit({ id: true });
export const insertGameSchema = createInsertSchema(games).omit({ id: true });

// Types for the schemas
export type InsertPokemon = z.infer<typeof insertPokemonSchema>;
export type Pokemon = typeof pokemons.$inferSelect;

export type InsertGameAppearance = z.infer<typeof insertGameAppearanceSchema>;
export type GameAppearance = typeof gameAppearances.$inferSelect;

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

// Type for Pokemon with games
export type PokemonWithGames = Pokemon & {
  games: Game[];
};

// Type for API responses
export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

// Type for detailed Pokemon data from API
export type PokemonDetailResponse = {
  id: number;
  name: string;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  sprites: {
    front_default: string;
    front_shiny: string;
    other: {
      "official-artwork": {
        front_default: string;
        front_shiny: string;
      };
    };
  };
  height: number;
  weight: number;
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  game_indices: {
    game_index: number;
    version: {
      name: string;
      url: string;
    };
  }[];
  species: {
    name: string;
    url: string;
  };
};

// Type for Pokemon species data from API
export type PokemonSpeciesResponse = {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version: {
      name: string;
      url: string;
    };
  }[];
  evolution_chain: {
    url: string;
  };
};

// Type for Pokemon evolution chain data from API
export type EvolutionChainResponse = {
  chain: {
    species: {
      name: string;
      url: string;
    };
    evolves_to: {
      species: {
        name: string;
        url: string;
      };
      evolution_details: {
        trigger: {
          name: string;
          url: string;
        };
        item: {
          name: string;
          url: string;
        } | null;
        min_level: number | null;
        min_happiness: number | null;
      }[];
      evolves_to: {
        species: {
          name: string;
          url: string;
        };
        evolution_details: {
          trigger: {
            name: string;
            url: string;
          };
          item: {
            name: string;
            url: string;
          } | null;
          min_level: number | null;
          min_happiness: number | null;
        }[];
      }[];
    }[];
  };
};
