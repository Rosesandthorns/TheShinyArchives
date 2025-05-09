import { useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NavbarProps {
  onSearch?: (query: string) => void;
  onToggleFilters?: () => void;
  onToggleShinyView?: () => void;
}

export default function Navbar({
  onSearch,
  onToggleFilters,
  onToggleShinyView
}: NavbarProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [shinyView, setShinyView] = useState(false);
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const toggleFilters = () => {
    if (onToggleFilters) {
      onToggleFilters();
    }
  };

  const toggleShinyView = () => {
    setShinyView(!shinyView);
    if (onToggleShinyView) {
      onToggleShinyView();
    }
    
    toast({
      title: shinyView ? "Normal View Activated" : "Shiny View Activated",
      description: shinyView 
        ? "Showing regular Pokémon sprites" 
        : "Showing shiny Pokémon sprites where available",
    });
  };

  return (
    <nav className="bg-pokered text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-3 md:mb-0">
          <div className="w-10 h-10 mr-3 rounded-full bg-white p-1 flex items-center justify-center">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 rounded-full bg-pokered border-2 border-gray-800 overflow-hidden">
                <div className="absolute w-full h-1/2 bg-white bottom-0"></div>
                <div className="absolute w-full h-[2px] bg-gray-800 top-1/2 -translate-y-1/2"></div>
                <div className="absolute w-3 h-3 bg-white rounded-full border-2 border-gray-800 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          </div>
          <Link href="/">
            <h1 className="text-2xl font-bold cursor-pointer">The Shiny Archives</h1>
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row w-full md:w-auto gap-3 items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              type="text" 
              placeholder="Search Pokémon..." 
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-pokeyellow text-pokedark"
            />
          </div>
          
          <Button 
            onClick={toggleFilters}
            className="bg-pokeblue hover:bg-opacity-90 text-white px-4 py-2 rounded-full flex items-center w-full md:w-auto justify-center"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          
          <div className="flex items-center bg-white rounded-full px-4 py-2 text-pokedark w-full md:w-auto justify-center">
            <Label htmlFor="shiny-view" className="mr-2 cursor-pointer">Shiny View</Label>
            <Switch 
              id="shiny-view" 
              checked={shinyView} 
              onCheckedChange={toggleShinyView}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
