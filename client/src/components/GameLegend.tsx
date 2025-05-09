import { Game } from "@shared/schema";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface GameLegendProps {
  games: Game[];
}

export default function GameLegend({ games }: GameLegendProps) {
  // Sort games by generation and then by name
  const sortedGames = [...games].sort((a, b) => {
    if (a.generation !== b.generation) {
      return a.generation - b.generation;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="container mx-auto my-6 bg-white rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold mb-3">Game Legend</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {sortedGames.map((game) => (
          <TooltipProvider key={game.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center cursor-help">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2"
                    style={{ backgroundColor: game.color }}
                  >
                    {game.shortCode}
                  </div>
                  <span className="text-sm">{game.name}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generation {game.generation}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
