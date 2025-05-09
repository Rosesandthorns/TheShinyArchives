import { useState } from "react";
import { Link } from "wouter";
import { PokemonWithGames, Game } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Star, ChevronDown, ChevronUp, Info } from "lucide-react";
import { getTypeColor } from "@/lib/constants";

interface PokemonCardProps {
  pokemon: PokemonWithGames;
  isShinyView?: boolean;
}

interface GameDetailsProps {
  game: Game;
  pokemonName: string;
}

// Import the hunting methods from our dedicated module
import { HuntingMethod, getHuntingMethods } from "@/lib/huntingMethods";

// This component will show game-specific shiny hunting details when expanded
function GameDetails({ game, pokemonName }: GameDetailsProps) {
  const [activeMethod, setActiveMethod] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [customMethods, setCustomMethods] = useState<HuntingMethod[]>([]);
  
  // Get hunting methods for this game shortcode from our dedicated module
  const allMethods = getHuntingMethods(game.shortCode);
  
  return (
    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
      <h4 className="font-bold text-sm mb-2 capitalize">{pokemonName} in {game.name}</h4>
      
      {allMethods.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-2">
            <h5 className="text-xs font-semibold">Hunting Methods:</h5>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 text-xs" 
              onClick={(e) => {
                e.stopPropagation();
                setEditMode(!editMode);
              }}
            >
              {editMode ? "Done" : "Edit"}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {allMethods.map(method => (
              <Button
                key={method.id}
                variant={activeMethod === method.id ? "default" : "outline"}
                size="sm"
                className="text-xs py-0 h-6"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMethod(activeMethod === method.id ? null : method.id);
                }}
              >
                {method.name}
              </Button>
            ))}
          </div>
          
          {activeMethod && allMethods.map(method => method.id === activeMethod && (
            <div 
              key={method.id} 
              className="game-method-container mt-3"
              style={{ borderLeftColor: game.color }}
            >
              <div className="flex justify-between mb-1">
                <span className="font-bold">{method.name}</span>
                <span className="method-odds font-mono text-xs">{method.odds}</span>
              </div>
              <div className="method-time text-xs mb-1">Est. Time: {method.estimatedTime}</div>
              <div className="method-guide text-xs">{method.guide}</div>
            </div>
          ))}
          
          {editMode && (
            <div className="mt-3 p-2 border border-dashed border-gray-300 rounded-md">
              <p className="text-xs mb-2">
                To add custom hunting methods:
              </p>
              <ol className="text-xs list-decimal ml-4 space-y-1">
                <li>Edit the <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">huntingMethods.ts</span> file</li>
                <li>Add methods to the <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">DEFAULT_METHODS</span> object</li>
                <li>Use the game shortcode (e.g. "{game.shortCode}") as the key</li>
                <li>Include name, odds, estimated time, and guide details</li>
              </ol>
            </div>
          )}
        </>
      ) : (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-md">
          <p className="text-xs text-yellow-800 dark:text-yellow-200 mb-2">
            <Info size={14} className="inline mr-1" />
            No hunting methods available for {game.name} yet.
          </p>
          <p className="text-xs opacity-75">
            You can add methods by editing the <span className="font-mono text-xs bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">huntingMethods.ts</span> file.
          </p>
        </div>
      )}
    </div>
  );
}

export default function PokemonCard({ pokemon, isShinyView = false }: PokemonCardProps) {
  const [expandedGameId, setExpandedGameId] = useState<number | null>(null);
  
  // Format Pokemon ID with leading zeros
  const formattedId = `#${pokemon.pokeId.toString().padStart(3, "0")}`;

  // Sort games by generation for consistent display
  const sortedGames = [...pokemon.games].sort((a, b) => {
    if (a.generation !== b.generation) {
      return a.generation - b.generation;
    }
    return a.name.localeCompare(b.name);
  });

  const toggleGameDetails = (gameId: number) => {
    if (expandedGameId === gameId) {
      setExpandedGameId(null);
    } else {
      setExpandedGameId(gameId);
    }
  };

  return (
    <Link href={`/pokemon/${pokemon.pokeId}`}>
      <Card className="pokemon-card overflow-hidden shadow-md transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg cursor-pointer">
        <div className="relative">
          {isShinyView ? (
            <div className="relative shiny-effect">
              <img 
                src={pokemon.shinySprite} 
                alt={`${pokemon.name} (Shiny)`} 
                className="w-full h-48 object-contain bg-gray-100 p-2"
              />
              <span className="absolute top-2 right-2 bg-yellow-500 text-xs px-2 py-1 rounded-full flex items-center text-white text-on-dark">
                <Star className="w-3 h-3 mr-1" /> Shiny
              </span>
            </div>
          ) : (
            <img 
              src={pokemon.sprite} 
              alt={pokemon.name} 
              className="w-full h-48 object-contain bg-gray-100 p-2"
            />
          )}
          <span className="absolute top-2 left-2 bg-pokeblue text-white text-xs px-2 py-1 rounded-full text-on-dark">
            {formattedId}
          </span>
        </div>
        
        <CardContent className="p-4 card-content" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold capitalize pokemon-name">{pokemon.name}</h2>
            <div className="flex gap-1">
              {pokemon.types.map((type) => (
                <span 
                  key={type}
                  className="type-badge px-2 py-1 text-white text-xs rounded-full capitalize text-on-dark"
                  style={{ backgroundColor: getTypeColor(type) }}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
          
          <Collapsible>
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-1">Game Appearances:</h3>
              <div className="flex flex-wrap gap-1">
                {sortedGames.map((game) => (
                  <Button
                    key={game.id}
                    variant="ghost"
                    className="p-0 h-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleGameDetails(game.id);
                    }}
                  >
                    <div 
                      className="game-badge w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer transition-transform hover:scale-110 text-on-dark"
                      style={{ backgroundColor: game.color }}
                    >
                      {game.shortCode}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Game-specific details section */}
            {expandedGameId && (
              <div className="game-detail-card expanded">
                {sortedGames
                  .filter(game => game.id === expandedGameId)
                  .map(game => (
                    <GameDetails 
                      key={game.id} 
                      game={game} 
                      pokemonName={pokemon.name} 
                    />
                  ))
                }
              </div>
            )}
          </Collapsible>
          
          <div className="block text-center bg-pokered hover:bg-opacity-90 text-white py-2 rounded-lg transition-colors mt-3">
            View Details
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
