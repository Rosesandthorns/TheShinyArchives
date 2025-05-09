import { useQuery } from "@tanstack/react-query";
import { PokemonWithGames } from "@shared/schema";

// Hook for fetching a single Pokemon by ID or name
export function usePokemon(idOrName: string | number) {
  return useQuery<PokemonWithGames>({
    queryKey: [`/api/pokemon/${idOrName}`],
    enabled: !!idOrName,
  });
}

// Hook for fetching a list of Pokemon
export function usePokemonList(limit: number = 20, offset: number = 0) {
  return useQuery<PokemonWithGames[]>({
    queryKey: [`/api/pokemon?limit=${limit}&offset=${offset}`],
  });
}

// Hook for searching Pokemon
export function useSearchPokemon(query: string) {
  return useQuery<PokemonWithGames[]>({
    queryKey: [`/api/pokemon/search?q=${query}`],
    enabled: query.length > 0,
  });
}

// Hook for fetching Pokemon by game
export function usePokemonByGame(gameId: number) {
  return useQuery<PokemonWithGames[]>({
    queryKey: [`/api/games/${gameId}/pokemon`],
    enabled: !!gameId,
  });
}
