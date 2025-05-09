import { useState } from "react";
import FilterPanel from "@/components/FilterPanel";
import GameLegend from "@/components/GameLegend";
import PokemonGrid from "@/components/PokemonGrid";
import { useQuery } from "@tanstack/react-query";
import { Game } from "@shared/schema";

export default function Home() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState("id");
  const [isShinyView, setIsShinyView] = useState(false);

  // Fetch all games for filtering
  const { data: games = [] } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  // Get unique generations from games
  const generations = Array.from(new Set(games.map(game => game.generation))).sort();

  // Get unique types from Pokémon
  const pokemonTypes = [
    "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", 
    "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", 
    "steel", "fairy"
  ];

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const toggleShinyView = () => {
    setIsShinyView(!isShinyView);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSort = (option: string) => {
    setSortOption(option);
  };

  const applyFilters = () => {
    // Filters are applied directly to the PokemonGrid component
    // This function is called when the "Apply Filters" button is clicked
    // We could add additional logic here if needed
  };

  return (
    <div className="bg-pokegray">
      <FilterPanel 
        isVisible={showFilters}
        generations={generations}
        games={games}
        types={pokemonTypes}
        selectedGeneration={selectedGeneration}
        selectedGameId={selectedGameId}
        selectedType={selectedType}
        sortOption={sortOption}
        onGenerationChange={setSelectedGeneration}
        onGameChange={setSelectedGameId}
        onTypeChange={setSelectedType}
        onSortChange={handleSort}
        onApplyFilters={applyFilters}
      />
      
      <GameLegend games={games} />
      
      <PokemonGrid 
        searchQuery={searchQuery}
        selectedGeneration={selectedGeneration}
        selectedGameId={selectedGameId}
        selectedType={selectedType}
        sortOption={sortOption}
        isShinyView={isShinyView}
      />
    </div>
  );
}
