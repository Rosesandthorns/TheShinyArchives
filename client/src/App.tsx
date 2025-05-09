import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PokemonDetail from "@/pages/PokemonDetail";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/pokemon/:id" component={PokemonDetail} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time to ensure resources like fonts are loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pokegray">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 relative animate-spin-slow mb-4">
            <div className="absolute inset-0 rounded-full bg-pokered border-4 border-gray-800 overflow-hidden">
              <div className="absolute w-full h-1/2 bg-white bottom-0"></div>
              <div className="absolute w-full h-[4px] bg-gray-800 top-1/2 -translate-y-1/2"></div>
              <div className="absolute w-8 h-8 bg-white rounded-full border-4 border-gray-800 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
          <p className="text-lg">Loading The Shiny Archives...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
