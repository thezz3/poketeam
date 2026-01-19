import { db } from './FirebaseInit.js';
import { collection, doc, setDoc } from 'firebase/firestore';

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

async function fetchPokemonData(id: number): Promise<PokemonData | null> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    
    const types = data.types.map((t: any) => t.type.name);
    
    const stats = {
      hp: data.stats[0].base_stat,
      attack: data.stats[1].base_stat,
      defense: data.stats[2].base_stat,
      specialAttack: data.stats[3].base_stat,
      specialDefense: data.stats[4].base_stat,
      speed: data.stats[5].base_stat,
    };
    const baseStatTotal = Object.values(stats).reduce((a, b) => a + b, 0);
    
    return {
      id: data.id,
      name: data.name,
      types,
      baseStatTotal,
      stats,
    };
  } catch (error) {
    console.error(`Error fetching Pokemon ${id}:`, error);
    return null;
  }
}

async function loadPokemonToFirebase() {
  console.log("Starting Firebase load...");
  
  for (let i = 152; i <= 1025; i++) {
    const pokemonData = await fetchPokemonData(i);
    
    if (pokemonData) {
      await setDoc(doc(db, "pokemon", String(i)), pokemonData);
      console.log(`Added ${pokemonData.name} (${i}/1025)`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log("Loaded all pokemon");
}

loadPokemonToFirebase();