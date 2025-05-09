import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { PokemonWithGames } from "@shared/schema";
import PokemonCard from "@/components/PokemonCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PokemonGridProps {
  searchQuery?: string;
  selectedGeneration?: number | null;
  selectedGameId?: number | null;
  selectedType?: string | null;
  sortOption?: string;
  isShinyView?: boolean;
}

export default function PokemonGrid({
  searchQuery = "",
  selectedGeneration = null,
  selectedGameId = null,
  selectedType = null,
  sortOption = "id",
  isShinyView = false
}: PokemonGridProps) {
  // Load all Pokémon at once (now all 1025 Pokémon)
  const [displayedPokemon, setDisplayedPokemon] = useState<PokemonWithGames[]>([]);
  const { toast } = useToast();
  
  // Using this to prevent the infinite render warning
  const [isInitialRender, setIsInitialRender] = useState(true);

  // Fetch Pokemon data - load all Pokémon at once
  const { data: pokemonData = [], isLoading, error, refetch } = useQuery<PokemonWithGames[]>({
    queryKey: ["/api/pokemon"],
    queryFn: async () => {
      // Load all available Pokémon (using a very large limit)
      const url = `/api/pokemon?limit=1000&offset=0`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch Pokemon data");
      return res.json();
    }
  });

  // Fetch Pokemon by game if a game is selected
  const {
    data: gameFilteredPokemon = [],
    isLoading: isLoadingGameFiltered,
  } = useQuery<PokemonWithGames[]>({
    queryKey: ["/api/games", selectedGameId, "pokemon"],
    enabled: !!selectedGameId,
    queryFn: async () => {
      const url = `/api/games/${selectedGameId}/pokemon`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch Pokemon by game");
      return res.json();
    }
  });

  // Fetch Pokemon by search query
  const {
    data: searchResults = [],
    isLoading: isLoadingSearch,
  } = useQuery<PokemonWithGames[]>({
    queryKey: ["/api/pokemon/search", searchQuery],
    enabled: searchQuery.length > 0,
    queryFn: async () => {
      const url = `/api/pokemon/search?q=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to search Pokemon");
      return res.json();
    }
  });

  // Filter and sort Pokemon based on selected options - using memoization to prevent infinite loops
  const filteredAndSortedPokemon = useMemo(() => {
    let filteredPokemon: PokemonWithGames[] = [];

    // Determine source data based on active filters
    if (searchQuery) {
      filteredPokemon = [...searchResults];
    } else if (selectedGameId) {
      filteredPokemon = [...gameFilteredPokemon];
    } else {
      filteredPokemon = [...pokemonData];
    }

    // Apply generation filter using the constants from lib/constants
    if (selectedGeneration) {
      const generationRanges = {
        1: [1, 151],
        2: [152, 251],
        3: [252, 386],
        4: [387, 493],
        5: [494, 649],
        6: [650, 721],
        7: [722, 809],
        8: [810, 905],
        9: [906, 1025]
      };
      
      const range = generationRanges[selectedGeneration as keyof typeof generationRanges];
      if (range) {
        filteredPokemon = filteredPokemon.filter(p => 
          p.pokeId >= range[0] && p.pokeId <= range[1]
        );
      }
    }

    // Apply type filter
    if (selectedType) {
      filteredPokemon = filteredPokemon.filter(p => 
        p.types.some(t => t.toLowerCase() === selectedType.toLowerCase())
      );
    }

    // Apply sorting
    if (sortOption === "id") {
      return [...filteredPokemon].sort((a, b) => a.pokeId - b.pokeId);
    } else if (sortOption === "id-desc") {
      return [...filteredPokemon].sort((a, b) => b.pokeId - a.pokeId);
    } else if (sortOption === "name") {
      return [...filteredPokemon].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name-desc") {
      return [...filteredPokemon].sort((a, b) => b.name.localeCompare(a.name));
    }
    
    return filteredPokemon;
  }, [
    pokemonData,
    searchResults,
    gameFilteredPokemon,
    searchQuery,
    selectedGeneration,
    selectedGameId,
    selectedType,
    sortOption
  ]);
  
  // Set the displayed Pokemon when our memo updates
  useEffect(() => {
    // Only update state if not the initial render or if there's actual data
    if (!isInitialRender || filteredAndSortedPokemon.length > 0) {
      setDisplayedPokemon(filteredAndSortedPokemon);
      // After first meaningful update, set isInitialRender to false
      if (isInitialRender) {
        setIsInitialRender(false);
      }
    }
  }, [filteredAndSortedPokemon, isInitialRender]);

  // No need for a loadMore function since we're loading all Pokémon at once

  const isLoadingAny = isLoading || isLoadingSearch || isLoadingGameFiltered;

  if (isLoadingAny && displayedPokemon.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center py-12">
        <div className="w-20 h-20 relative animate-spin-slow mb-4">
          <div className="absolute inset-0 rounded-full bg-pokered border-4 border-gray-800 overflow-hidden">
            <div className="absolute w-full h-1/2 bg-white bottom-0"></div>
            <div className="absolute w-full h-[4px] bg-gray-800 top-1/2 -translate-y-1/2"></div>
            <div className="absolute w-8 h-8 bg-white rounded-full border-4 border-gray-800 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
        <p className="text-lg">Loading Pokémon data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          <h3 className="font-bold text-lg">Oops! Something went wrong</h3>
          <p>Unable to load Pokémon data. Please try again later.</p>
          <Button 
            onClick={() => refetch()} 
            className="mt-2 bg-red-700 text-white hover:bg-red-800"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      {displayedPokemon.length === 0 && !isLoadingAny ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-bold mb-4">No Pokémon Found</h3>
          <p>Try adjusting your search criteria or filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedPokemon.map((pokemon) => (
              <PokemonCard 
                key={pokemon.id} 
                pokemon={pokemon} 
                isShinyView={isShinyView}
              />
            ))}
          </div>
          
          {/* All Pokémon are loaded at once, so we don't need a load more button */}

          {isLoadingAny && displayedPokemon.length > 0 && (
            <div className="flex justify-center mt-8">
              <Button disabled className="bg-gray-400 text-white px-6 py-2 rounded-full shadow-md">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
