import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Game } from "@shared/schema";

interface FilterPanelProps {
  isVisible: boolean;
  generations: number[];
  games: Game[];
  types: string[];
  selectedGeneration: number | null;
  selectedGameId: number | null;
  selectedType: string | null;
  sortOption: string;
  onGenerationChange: (generation: number | null) => void;
  onGameChange: (gameId: number | null) => void;
  onTypeChange: (type: string | null) => void;
  onSortChange: (sort: string) => void;
  onApplyFilters: () => void;
}

export default function FilterPanel({
  isVisible,
  generations,
  games,
  types,
  selectedGeneration,
  selectedGameId,
  selectedType,
  sortOption,
  onGenerationChange,
  onGameChange,
  onTypeChange,
  onSortChange,
  onApplyFilters
}: FilterPanelProps) {
  if (!isVisible) return null;

  const handleGenerationClick = (gen: number) => {
    if (selectedGeneration === gen) {
      onGenerationChange(null);
    } else {
      onGenerationChange(gen);
    }
  };

  const handleGameClick = (gameId: number) => {
    if (selectedGameId === gameId) {
      onGameChange(null);
    } else {
      onGameChange(gameId);
    }
  };

  const handleTypeClick = (type: string) => {
    if (selectedType === type) {
      onTypeChange(null);
    } else {
      onTypeChange(type);
    }
  };

  const handleSortChange = (value: string) => {
    onSortChange(value);
  };

  return (
    <div className="bg-white shadow-md container mx-auto mt-4 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Generation</h3>
          <div className="flex flex-wrap gap-2">
            {generations.map((gen) => (
              <button
                key={gen}
                className={`px-3 py-1 rounded-full transition-colors ${
                  selectedGeneration === gen
                    ? "bg-pokeblue text-white"
                    : "bg-gray-200 hover:bg-pokeblue hover:text-white"
                }`}
                onClick={() => handleGenerationClick(gen)}
              >
                Gen {gen}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Games</h3>
          <div className="flex flex-wrap gap-2">
            {games.map((game) => (
              <button
                key={game.id}
                className={`px-3 py-1 rounded-full transition-colors ${
                  selectedGameId === game.id
                    ? "bg-pokeblue text-white"
                    : "bg-gray-200 hover:bg-pokeblue hover:text-white"
                }`}
                onClick={() => handleGameClick(game.id)}
              >
                {game.name}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Type</h3>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type}
                className={`px-3 py-1 rounded-full capitalize transition-colors ${
                  selectedType === type
                    ? "bg-pokeblue text-white"
                    : "bg-gray-200 hover:bg-pokeblue hover:text-white"
                }`}
                onClick={() => handleTypeClick(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Sort by</h3>
          <Select defaultValue={sortOption} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select sort option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">ID (Ascending)</SelectItem>
              <SelectItem value="id-desc">ID (Descending)</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="mt-4">
            <Button 
              className="w-full bg-pokered text-white py-2 rounded-lg hover:bg-opacity-90"
              onClick={onApplyFilters}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
