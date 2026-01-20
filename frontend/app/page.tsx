"use client";
import Image from "next/image";
import { useState } from "react";

interface Pokemon {
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

interface TypeData {
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

const typeColors: Record<string, string> = {
  grass: "green",
  fire: "red",
  water: "blue",
  electric: "yellow",
  poison: "purple",
  flying: "lightblue",
  bug: "olive",
  normal: "gray",
  ground: "brown",
  rock: "darkgray",
  psychic: "pink",
  ice: "cyan",
  dragon: "darkviolet",
  dark: "black",
  steel: "silver",
  fairy: "lightpink",
  fighting: "darkred",
  ghost: "indigo",
};

const lightColors = [
  "yellow",
  "cyan",
  "lightblue",
  "lightpink",
  "pink",
  "silver",
  "ice",
];

export default function Home() {
  const [team, setTeam] = useState<Pokemon[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [analysis, setAnalysis] = useState<{
    teamEffectiveness: TypeData;
    netDefense: TypeData;
  } | null>(null);
  const [teamName, setTeamName] = useState("");
  const [savedTeams, setSavedTeams] = useState<
    Array<{ name: string; pokemon: string[] }>
  >([]);

  const addPokemon = async () => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${inputValue.toLowerCase()}`
    );
    if (!response.ok) {
      alert("Pokemon not found!");
      return;
    }
    const data = await response.json();

    const stats = {
      hp: data.stats[0].base_stat,
      attack: data.stats[1].base_stat,
      defense: data.stats[2].base_stat,
      specialAttack: data.stats[3].base_stat,
      specialDefense: data.stats[4].base_stat,
      speed: data.stats[5].base_stat,
    };
    const baseStatTotal = Object.values(stats).reduce((a, b) => a + b, 0);

    const newPokemon: Pokemon = {
      id: data.id,
      name: data.name,
      types: data.types.map((t: any) => t.type.name),
      baseStatTotal,
      stats,
    };
    setTeam([...team, newPokemon]);
    setInputValue("");
  };

  const analyzeTeam = async () => {
    const response = await fetch("http://localhost:8080/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ team: team }),
    });
    const result = await response.json();
    setAnalysis(result);
  };
  const saveTeam = async () => {
    const pokemonNames = team.map((p) => p.name);
    const response = await fetch("http://localhost:8080/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: teamName, pokemon: pokemonNames }),
    });
    if (response.ok) {
      alert("Team saved");
      setTeamName("");
    }
  };
  const fetchSavedTeams = async () => {
    const response = await fetch("http://localhost:8080/teams");
    const teams = await response.json();
    setSavedTeams(teams);
  };
  const renderTypeBoxes = (typeData: TypeData) => {
    const boxes = [];
    for (const type in typeData) {
      const count = typeData[type as keyof TypeData];
      if (count > 0) {
        boxes.push(
          <span
            key={type}
            style={{
              backgroundColor: typeColors[type],
              color: lightColors.includes(typeColors[type]) ? "black" : "white",
              padding: "5px",
              margin: "5px",
            }}
          >
            {type} {count > 1 ? `x${count}` : ""}
          </span>
        );
      }
    }
    return boxes;
  };

  const getResistances = (netDefense: TypeData) => {
    const resistances: Partial<TypeData> = {};
    Object.entries(netDefense).forEach(([type, value]) => {
      if (value > 0) {
        resistances[type as keyof TypeData] = value;
      }
    });
    return resistances as TypeData;
  };

  const getWeaknesses = (netDefense: TypeData) => {
    const weaknesses: Partial<TypeData> = {};
    Object.entries(netDefense).forEach(([type, value]) => {
      if (value < 0) {
        weaknesses[type as keyof TypeData] = Math.abs(value);
      }
    });
    return weaknesses as TypeData;
  };

  return (
    <div>
      <h1>Pokemon Team Builder</h1>
      <input
        type="text"
        placeholder="e.g. Pikachu"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={addPokemon} disabled={team.length >= 6}>
        Add
      </button>
      <button onClick={analyzeTeam} disabled={team.length === 0}>
        Analyze Team
      </button>
      <input
        type="text"
        placeholder="Team name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />
      <button onClick={saveTeam} disabled={team.length === 0}>
        Save Team
      </button>
      <button onClick={fetchSavedTeams}>View Saved Teams</button>

      <h2>Your Team</h2>
      {team.map((pokemon) => (
        <div
          key={pokemon.id}
          style={{ border: "1px solid black", padding: "20px", margin: "10px" }}
        >
          <div>{pokemon.name}</div>
          <div>
            {pokemon.types.map((type) => (
              <span
                key={type}
                style={{
                  backgroundColor: typeColors[type],
                  color: lightColors.includes(typeColors[type])
                    ? "black"
                    : "white",
                  padding: "5px",
                  margin: "5px",
                }}
              >
                {type}
              </span>
            ))}
          </div>
          <div>Total Stats: {pokemon.baseStatTotal}</div>
        </div>
      ))}

      {analysis && (
        <div style={{ marginTop: "20px" }}>
          <h2>Analysis Results</h2>

          <div style={{ marginBottom: "20px" }}>
            <h3>Offensive Coverage</h3>
            <div>{renderTypeBoxes(analysis.teamEffectiveness)}</div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3>Resistances</h3>
            <div>{renderTypeBoxes(getResistances(analysis.netDefense))}</div>
          </div>

          <div>
            <h3>Weaknesses</h3>
            <div>{renderTypeBoxes(getWeaknesses(analysis.netDefense))}</div>
          </div>
        </div>
      )}

      {savedTeams.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Saved Teams</h2>
          {savedTeams.map((savedTeam, index) => (
            <div
              key={index}
              style={{
                border: "1px solid black",
                padding: "10px",
                margin: "10px",
              }}
            >
              <strong>{savedTeam.name}</strong>
              <div>Pokemon: {savedTeam.pokemon.join(", ")}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
