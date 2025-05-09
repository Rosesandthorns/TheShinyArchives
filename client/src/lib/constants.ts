export const getTypeColor = (type: string): string => {
  const typeColors: Record<string, string> = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC"
  };

  return typeColors[type.toLowerCase()] || "#777777";
};

export const generations = [
  { number: 1, range: [1, 151] },
  { number: 2, range: [152, 251] },
  { number: 3, range: [252, 386] },
  { number: 4, range: [387, 493] },
  { number: 5, range: [494, 649] },
  { number: 6, range: [650, 721] },
  { number: 7, range: [722, 809] },
  { number: 8, range: [810, 905] },
  { number: 9, range: [906, 1025] }
];

export const getGeneration = (pokemonId: number): number => {
  for (const gen of generations) {
    if (pokemonId >= gen.range[0] && pokemonId <= gen.range[1]) {
      return gen.number;
    }
  }
  return 1; // Default to Gen 1 if not found
};
