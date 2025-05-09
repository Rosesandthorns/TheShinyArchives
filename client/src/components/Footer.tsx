import { Link } from "wouter";
import { Twitter, Instagram, Github } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-pokeblue text-white py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/">
              <h2 className="text-xl font-bold mb-2 cursor-pointer">The Shiny Archives</h2>
            </Link>
            <p className="text-sm text-blue-200">Track Pokémon across all games</p>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="#" 
              className="text-white hover:text-pokeyellow transition-colors" 
              aria-label="Twitter"
            >
              <Twitter />
            </a>
            <a 
              href="#" 
              className="text-white hover:text-pokeyellow transition-colors" 
              aria-label="Instagram"
            >
              <Instagram />
            </a>
            <a 
              href="#" 
              className="text-white hover:text-pokeyellow transition-colors" 
              aria-label="GitHub"
            >
              <Github />
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-blue-700 text-center text-sm text-blue-200">
          <p>Data provided by PokéAPI • This is a fan project and is not affiliated with Nintendo or The Pokémon Company</p>
          <p className="mt-2">© {currentYear} The Shiny Archives</p>
        </div>
      </div>
    </footer>
  );
}
