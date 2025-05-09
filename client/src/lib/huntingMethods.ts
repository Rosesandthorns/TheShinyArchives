// Define the hunting method interface
export interface HuntingMethod {
  id: string;
  name: string;
  odds: string;
  estimatedTime: string;
  guide: string;
}

// Sample/default hunting methods organized by game shortcode
// These can be imported and extended in the application
export const DEFAULT_METHODS: Record<string, HuntingMethod[]> = {
  // =========== Gen 1 ===========
  "RB": [
    {
      id: "rb-random",
      name: "Random Encounter",
      odds: "1/8192",
      estimatedTime: "Very long",
      guide: "Just encounter wild Pokémon in grass, caves, or while surfing. In Gen 1, there are no method-specific shiny odds increases."
    }
  ],
  "Y": [
    {
      id: "y-random",
      name: "Random Encounter",
      odds: "1/8192",
      estimatedTime: "Very long",
      guide: "Just encounter wild Pokémon in grass, caves, or while surfing. In Gen 1, there are no method-specific shiny odds increases."
    }
  ],
  
  // =========== Gen 2 ===========
  "GS": [
    {
      id: "gs-random",
      name: "Random Encounter",
      odds: "1/8192",
      estimatedTime: "Very long",
      guide: "Just encounter wild Pokémon in grass, caves, or while surfing."
    },
    {
      id: "gs-breeding",
      name: "Breeding",
      odds: "1/64 (with shiny parent)",
      estimatedTime: "Medium",
      guide: "Breed with a shiny Pokémon to increase odds significantly."
    }
  ],
  "C": [
    {
      id: "c-random",
      name: "Random Encounter",
      odds: "1/8192",
      estimatedTime: "Very long",
      guide: "Just encounter wild Pokémon in grass, caves, or while surfing."
    },
    {
      id: "c-breeding",
      name: "Breeding",
      odds: "1/64 (with shiny parent)",
      estimatedTime: "Medium",
      guide: "Breed with a shiny Pokémon to increase odds significantly."
    }
  ],
  
  // =========== Gen 3 ===========
  "RS": [
    {
      id: "rs-random",
      name: "Random Encounter",
      odds: "1/8192",
      estimatedTime: "Very long",
      guide: "Just encounter wild Pokémon in grass, caves, or while surfing."
    },
    {
      id: "rs-breeding",
      name: "Breeding",
      odds: "1/8192",
      estimatedTime: "Very long",
      guide: "Unlike Gen 2, having a shiny parent doesn't increase odds in Gen 3."
    }
  ],
  "E": [
    {
      id: "e-random",
      name: "Random Encounter",
      odds: "1/8192",
      estimatedTime: "Very long",
      guide: "Just encounter wild Pokémon in grass, caves, or while surfing."
    },
    {
      id: "e-breeding",
      name: "Breeding",
      odds: "1/8192",
      estimatedTime: "Very long",
      guide: "Unlike Gen 2, having a shiny parent doesn't increase odds in Gen 3."
    }
  ],
  "FRLG": [
    {
      id: "frlg-random",
      name: "Random Encounter",
      odds: "1/8192",
      estimatedTime: "Very long",
      guide: "Just encounter wild Pokémon in grass, caves, or while surfing."
    },
    {
      id: "frlg-breeding",
      name: "Breeding",
      odds: "1/8192",
      estimatedTime: "Very long",
      guide: "Unlike Gen 2, having a shiny parent doesn't increase odds in Gen 3."
    }
  ],
  
  // =========== Gen 4 ===========
  "DP": [
    {
      id: "dp-random",
      name: "Random Encounter",
      odds: "1/8192",
      estimatedTime: "Very long",
      guide: "Just encounter wild Pokémon in grass, caves, or while surfing."
    },
    {
      id: "dp-masuda",
      name: "Masuda Method",
      odds: "1/1638",
      estimatedTime: "Long",
      guide: "Breed two Pokémon from games of different languages."
    },
    {
      id: "dp-chain",
      name: "PokéRadar Chaining",
      odds: "1/200 at chain of 40+",
      estimatedTime: "Medium",
      guide: "Use the PokéRadar to chain encounters of the same Pokémon."
    }
  ],
  
  // =========== Modern Games ===========
  "SwSh": [
    {
      id: "swsh-random",
      name: "Random Encounter",
      odds: "1/4096 (1/1365 w/ Shiny Charm)",
      estimatedTime: "Long",
      guide: "Find the Pokémon in the wild and encounter it."
    },
    {
      id: "swsh-masuda",
      name: "Masuda Method",
      odds: "1/683 with Shiny Charm",
      estimatedTime: "Medium",
      guide: "Breed Pokémon from parents of different language games."
    },
    {
      id: "swsh-dynamax",
      name: "Max Raid Battles",
      odds: "Varies",
      estimatedTime: "Medium",
      guide: "Join or host Max Raid Battles to find special raid dens with increased shiny odds."
    }
  ],
  "SV": [
    {
      id: "sv-random",
      name: "Random Encounter",
      odds: "1/4096 (1/1365 w/ Shiny Charm)",
      estimatedTime: "Medium",
      guide: "Find the Pokémon in the wild and encounter it."
    },
    {
      id: "sv-masuda",
      name: "Masuda Method",
      odds: "1/683 with Shiny Charm",
      estimatedTime: "Medium",
      guide: "Breed Pokémon from parents of different language games."
    },
    {
      id: "sv-outbreaks",
      name: "Mass Outbreaks",
      odds: "1/1365 (with Shiny Charm)",
      estimatedTime: "Short-Medium",
      guide: "Find mass outbreaks on the map and encounter the Pokémon there."
    },
    {
      id: "sv-sandwich",
      name: "Sparkling Power",
      odds: "Increases base chances",
      estimatedTime: "Medium",
      guide: "Make sandwiches with the Sparkling Power effect for the Pokémon's type."
    }
  ]
};

// Function to get hunting methods for a specific game
export function getHuntingMethods(gameShortCode: string): HuntingMethod[] {
  return DEFAULT_METHODS[gameShortCode] || [];
}

// Merge custom methods with default methods
export function mergeHuntingMethods(
  gameShortCode: string, 
  customMethods: Record<string, HuntingMethod[]>
): HuntingMethod[] {
  const defaultForGame = DEFAULT_METHODS[gameShortCode] || [];
  const customForGame = customMethods[gameShortCode] || [];
  
  // Create a map of existing method IDs to prevent duplicates
  const existingIds = new Set(defaultForGame.map(method => method.id));
  
  // Filter out custom methods that would duplicate default ones
  const uniqueCustomMethods = customForGame.filter(method => !existingIds.has(method.id));
  
  // Return combined methods
  return [...defaultForGame, ...uniqueCustomMethods];
}

// How to use this module:
// 
// 1. Import the methods you need:
//    import { getHuntingMethods, DEFAULT_METHODS } from '@/lib/huntingMethods';
//
// 2. Get methods for a specific game:
//    const methods = getHuntingMethods('SwSh');
//
// 3. Create custom methods:
//    const CUSTOM_METHODS = {
//      "SwSh": [
//        {
//          id: "swsh-custom-1",
//          name: "My Custom Method",
//          odds: "??",
//          estimatedTime: "???",
//          guide: "This is my custom hunting method!"
//        }
//      ]
//    };
//
// 4. Merge with default methods:
//    const allMethods = mergeHuntingMethods('SwSh', CUSTOM_METHODS);