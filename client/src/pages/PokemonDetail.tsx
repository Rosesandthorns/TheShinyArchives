import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { PokemonWithGames } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Star } from "lucide-react";
import { getTypeColor } from "@/lib/constants";

export default function PokemonDetail() {
  const [, params] = useRoute("/pokemon/:id");
  const [, navigate] = useLocation();
  const [showShiny, setShowShiny] = useState(false);

  // Redirect to home if no ID parameter
  if (!params?.id) {
    navigate("/");
    return null;
  }

  const { data: pokemon, isLoading, error } = useQuery<PokemonWithGames>({
    queryKey: [`/api/pokemon/${params.id}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 relative animate-spin-slow mb-4">
            <div className="absolute inset-0 rounded-full bg-pokered border-4 border-gray-800 overflow-hidden">
              <div className="absolute w-full h-1/2 bg-white bottom-0"></div>
              <div className="absolute w-full h-[4px] bg-gray-800 top-1/2 -translate-y-1/2"></div>
              <div className="absolute w-8 h-8 bg-white rounded-full border-4 border-gray-800 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
          <p className="text-lg">Loading Pokémon data...</p>
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="container mx-auto py-12">
        <Card className="p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Error Loading Pokémon</h2>
          <p className="mb-4">
            {error ? `${(error as Error).message}` : "Pokémon not found"}
          </p>
          <Button onClick={() => navigate("/")} className="bg-pokered hover:bg-opacity-90">
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  // Format Pokemon ID with leading zeros
  const formattedId = `#${pokemon.pokeId.toString().padStart(3, "0")}`;

  // Extract stats for display
  const stats = pokemon.stats as Record<string, number>;

  // Get evolution chain data if available
  const evolutionChain = pokemon.evolutionChain as any;

  // Process evolution chain to make it easier to display
  const processEvolutions = () => {
    if (!evolutionChain) return [];
    
    const evolutions = [];
    let current = evolutionChain;
    
    // Add base form
    evolutions.push({
      name: current.species.name,
      url: current.species.url,
    });
    
    // First evolution
    if (current.evolves_to && current.evolves_to.length > 0) {
      const firstEvol = current.evolves_to[0];
      evolutions.push({
        name: firstEvol.species.name,
        url: firstEvol.species.url,
        details: firstEvol.evolution_details[0],
      });
      
      // Second evolution
      if (firstEvol.evolves_to && firstEvol.evolves_to.length > 0) {
        const secondEvol = firstEvol.evolves_to[0];
        evolutions.push({
          name: secondEvol.species.name,
          url: secondEvol.species.url,
          details: secondEvol.evolution_details[0],
        });
      }
    }
    
    return evolutions;
  };

  const evolutions = processEvolutions();

  // Function to get evolution requirement text
  const getEvolutionText = (details: any) => {
    if (!details) return "";
    
    if (details.trigger.name === "level-up") {
      if (details.min_level) return `Level ${details.min_level}`;
      if (details.min_happiness) return "Happiness";
      return "Level up";
    }
    
    if (details.trigger.name === "use-item" && details.item) {
      return details.item.name.replace(/-/g, ' ');
    }
    
    if (details.trigger.name === "trade") return "Trade";
    
    return details.trigger.name.replace(/-/g, ' ');
  };

  // Extract Pokemon ID from species URL
  const getIdFromSpeciesUrl = (url: string) => {
    const matches = url.match(/\/pokemon-species\/(\d+)/);
    return matches ? matches[1] : "";
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Pokémon
      </Button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold flex items-center">
              <span className="bg-pokeblue text-white rounded-full px-3 py-1 text-sm mr-3">
                {formattedId}
              </span>
              <span className="capitalize">{pokemon.name}</span>
            </h1>
            
            <div className="flex gap-2">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className={`px-3 py-1 rounded-full text-white text-sm capitalize font-medium`}
                  style={{ backgroundColor: getTypeColor(type) }}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <div className="tabs flex">
                  <button 
                    className={`flex-1 py-2 font-medium transition-colors ${!showShiny ? "bg-pokered text-white" : "bg-gray-300 text-gray-700"}`}
                    onClick={() => setShowShiny(false)}
                  >
                    Normal
                  </button>
                  <button 
                    className={`flex-1 py-2 font-medium transition-colors ${showShiny ? "bg-pokered text-white" : "bg-gray-300 text-gray-700"}`}
                    onClick={() => setShowShiny(true)}
                  >
                    Shiny
                  </button>
                </div>
                
                <div className="sprite-container p-6 flex justify-center bg-gray-50">
                  {showShiny ? (
                    <div className="relative shiny-effect">
                      <img 
                        src={pokemon.shinySprite} 
                        alt={`${pokemon.name} Shiny`} 
                        className="h-64 object-contain"
                      />
                      <span className="absolute top-0 right-0 bg-yellow-500 px-2 py-1 rounded-full flex items-center text-xs text-white">
                        <Star className="w-3 h-3 mr-1" /> Shiny
                      </span>
                    </div>
                  ) : (
                    <img 
                      src={pokemon.sprite} 
                      alt={pokemon.name} 
                      className="h-64 object-contain"
                    />
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3">Base Stats</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>HP</span>
                      <span>{stats.hp}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(100, (stats.hp / 255) * 100)}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Attack</span>
                      <span>{stats.attack}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${Math.min(100, (stats.attack / 255) * 100)}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Defense</span>
                      <span>{stats.defense}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, (stats.defense / 255) * 100)}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Special Attack</span>
                      <span>{stats["special-attack"]}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min(100, (stats["special-attack"] / 255) * 100)}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Special Defense</span>
                      <span>{stats["special-defense"]}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${Math.min(100, (stats["special-defense"] / 255) * 100)}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Speed</span>
                      <span>{stats.speed}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${Math.min(100, (stats.speed / 255) * 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-700">{pokemon.description}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Game Appearances</h3>
                <div className="bg-white border rounded-lg p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pokemon.games.map((game) => (
                      <div key={game.id} className="flex items-center space-x-2">
                        <div 
                          className="game-badge w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" 
                          style={{ backgroundColor: game.color }}
                          title={game.name}
                        >
                          {game.shortCode}
                        </div>
                        <span>{game.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Abilities</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {pokemon.abilities.map((ability, index) => (
                    <li key={index} className="capitalize">
                      {ability.replace('(Hidden)', '')}
                      {ability.includes('(Hidden)') && (
                        <span className="text-sm text-gray-500 ml-1">(Hidden)</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              
              {evolutions.length > 1 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Evolution Chain</h3>
                  <div className="flex items-center justify-between flex-wrap">
                    {evolutions.map((evolution, index) => (
                      <div key={index} className="flex items-center my-2">
                        {index > 0 && (
                          <div className="text-center text-gray-400 mx-2">
                            <span>→</span>
                            <p className="text-xs">{getEvolutionText(evolution.details)}</p>
                          </div>
                        )}
                        <div className="text-center">
                          <Button 
                            variant="ghost"
                            className="flex flex-col p-2"
                            onClick={() => navigate(`/pokemon/${getIdFromSpeciesUrl(evolution.url)}`)}
                          >
                            <div className={`mx-auto w-16 h-16 rounded-full overflow-hidden mb-1 flex items-center justify-center ${evolution.name === pokemon.name ? 'bg-yellow-100 border-2 border-pokeyellow' : 'bg-gray-100'}`}>
                              {/* Would need to fetch Pokemon sprites for each evolution */}
                              <span className="text-xs">#{getIdFromSpeciesUrl(evolution.url)}</span>
                            </div>
                            <p className="text-sm font-medium capitalize">{evolution.name}</p>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
