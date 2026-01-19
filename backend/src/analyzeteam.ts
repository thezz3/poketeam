interface PokemonData {
  id: number;
  name: string;
  types: string[];
  baseStatTotal: number;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
}

interface typeData {
    normal: number;
    fire: number;
    water: number;
    electric: number;
    grass: number;
    ice: number;
    fighting: number;
    poison: number;
    ground: number;
    flying: number;
    psychic: number;
    bug: number;
    rock: number;
    ghost: number;
    dragon: number;
    dark: number;
    steel: number;
    fairy: number;
}


const typeAdvantages: Record<string, string[]> = {
  normal: [],
  fire: ["grass", "ice", "bug", "steel"],
  water: ["fire", "ground", "rock"],
  electric: ["water", "flying"],
  grass: ["water", "ground", "rock"],
  ice: ["grass", "ground", "flying", "dragon"],
  fighting: ["normal", "ice", "rock", "dark", "steel"],
  poison: ["grass", "fairy"],
  ground: ["fire", "electric", "poison", "rock", "steel"],
  flying: ["grass", "fighting", "bug"],
  psychic: ["fighting", "poison"],
  bug: ["grass", "psychic", "dark"],
  rock: ["fire", "ice", "flying", "bug"],
  ghost: ["psychic", "ghost"],
  dragon: ["dragon"],
  dark: ["psychic", "ghost"],
  steel: ["ice", "rock", "fairy"],
  fairy: ["fighting", "dragon", "dark"]
};

const typeResistances: Record<string, string[]> = {
  normal: [],
  fire: ["fire", "grass", "ice", "bug", "steel", "fairy"],
  water: ["fire", "water", "ice", "steel"],
  electric: ["electric", "flying", "steel"],
  grass: ["water", "electric", "grass", "ground"],
  ice: ["ice"],
  fighting: ["bug", "rock", "dark"],
  poison: ["grass", "fighting", "poison", "bug", "fairy"],
  ground: ["poison", "rock", "electric"], 
  flying: ["grass", "fighting", "bug", "ground"], 
  psychic: ["fighting", "psychic"],
  bug: ["grass", "fighting", "ground"],
  rock: ["normal", "fire", "poison", "flying"],
  ghost: ["poison", "bug", "normal", "fighting"], 
  dragon: ["fire", "water", "electric", "grass"],
  dark: ["ghost", "dark", "psychic"], 
  steel: ["normal", "grass", "ice", "flying", "psychic", "bug", "rock", "dragon", "steel", "fairy", "poison"],
  fairy: ["fighting", "bug", "dark", "dragon"] 
};


const typeWeaknesses: Record<string, string[]> = {
  normal: ["fighting"],
  fire: ["water", "ground", "rock"],
  water: ["electric", "grass"],
  electric: ["ground"],
  grass: ["fire", "ice", "poison", "flying", "bug"],
  ice: ["fire", "fighting", "rock", "steel"],
  fighting: ["flying", "psychic", "fairy"],
  poison: ["ground", "psychic"],
  ground: ["water", "grass", "ice"],
  flying: ["electric", "ice", "rock"],
  psychic: ["bug", "ghost", "dark"],
  bug: ["fire", "flying", "rock"],
  rock: ["water", "grass", "fighting", "ground", "steel"],
  ghost: ["ghost", "dark"],
  dragon: ["ice", "dragon", "fairy"],
  dark: ["fighting", "bug", "fairy"],
  steel: ["fire", "fighting", "ground"],
  fairy: ["poison", "steel"]
};


export function analyzeTeam(pokemonTeam: PokemonData[]) {
    function calculatetypeeffectiveness(pokemon: PokemonData, mode: string) {
        let effectiveness: typeData = {
            normal: 0,
            fire: 0,
            water: 0,
            electric: 0,
            grass: 0,
            ice: 0,
            fighting: 0,
            poison: 0,
            ground: 0,
            flying: 0,
            psychic: 0,
            bug: 0,
            rock: 0,
            ghost: 0,
            dragon: 0,
            dark: 0,
            steel: 0,
            fairy: 0,
        };
        let resistances: typeData = {
            normal: 0,
            fire: 0,
            water: 0,
            electric: 0,
            grass: 0,
            ice: 0,
            fighting: 0,
            poison: 0,
            ground: 0,
            flying: 0,
            psychic: 0,
            bug: 0,
            rock: 0,
            ghost: 0,
            dragon: 0,
            dark: 0,
            steel: 0,
            fairy: 0,
        };
        let weaknesses: typeData = {
            normal: 0,
            fire: 0,
            water: 0,
            electric: 0,
            grass: 0,
            ice: 0,
            fighting: 0,
            poison: 0,
            ground: 0,
            flying: 0,
            psychic: 0,
            bug: 0,
            rock: 0,
            ghost: 0,
            dragon: 0,
            dark: 0,
            steel: 0,
            fairy: 0,
        };
        if (mode === "attacking") {
            for (const type of pokemon.types) {
                const advantages = typeAdvantages[type];
                for (const advantage of advantages) {
                    effectiveness[advantage as keyof typeData] += 1;
                }
        }
        } else if (mode === "defending") {
            for (const type of pokemon.types) {
                const resistList = typeResistances[type];
                for (const resist of resistList) {
                    resistances[resist as keyof typeData] += 1;
                }
            }
        }
        else if (mode === "weaknesses") {
            for (const type of pokemon.types) {
                const weaknessList = typeWeaknesses[type];
                for (const weakness of weaknessList) {
                    weaknesses[weakness as keyof typeData] += 1;
                }
            }
        }

        return {effectiveness, resistances, weaknesses};
    }

    let teamEffectiveness: typeData = {
        normal: 0, fire: 0, water: 0, electric: 0, grass: 0, ice: 0,
        fighting: 0, poison: 0, ground: 0, flying: 0, psychic: 0, bug: 0,
        rock: 0, ghost: 0, dragon: 0, dark: 0, steel: 0, fairy: 0,
    };
    let teamResistances: typeData = { ...teamEffectiveness };
    let teamWeaknesses: typeData = { ...teamEffectiveness };

    for (const pokemon of pokemonTeam) {
        const attacking = calculatetypeeffectiveness(pokemon, "attacking");
        const defending = calculatetypeeffectiveness(pokemon, "defending");
        const weaknesses = calculatetypeeffectiveness(pokemon, "weaknesses");
        
        // Add to team totals
        for (const type in teamEffectiveness) {
            teamEffectiveness[type as keyof typeData] += attacking.effectiveness[type as keyof typeData];
            teamResistances[type as keyof typeData] += defending.resistances[type as keyof typeData];
            teamWeaknesses[type as keyof typeData] += weaknesses.weaknesses[type as keyof typeData];
        }
    }
    
    // Net out resistances vs weaknesses
    let netDefense: typeData = { ...teamEffectiveness };
    for (const type in netDefense) {
        netDefense[type as keyof typeData] = teamResistances[type as keyof typeData] - teamWeaknesses[type as keyof typeData];
    }
    
    return { teamEffectiveness, netDefense };
}