import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";


interface Pokemon {
  name: string;
  image: string;  
  imageBack: string;
  types: PokemonType[];
}

interface PokemonType {
  type:{
    name:string,
    url:string
  }
}

// based on type, we can set different background colors or styles
const colorByType = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};


export default function Index() {

  const [pokemons, setPokemons] = useState<Pokemon[]>([]) // empty array as initial state
  // list of type of pokemons "Pokemon"

  // console.warn(JSON.stringify(pokemons[0], null, 1));
  useEffect(() => {
    //fetch pokemons
    fetchPokemons();
  }, []);


  async function fetchPokemons() {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
      const data = await response.json();

      // fetch detailed info for each pokemon in parallel
      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: any) => {
          try {
            const res = await fetch(pokemon.url);

            const details = await res.json();

            // if there is no image, skip this pokemon
            if (!details.sprites?.front_default) return null;

            return {
              name: pokemon.name,
              image: details.sprites.front_default,
              imageBack: details.sprites.back_default,
              types:details.types
            };
          } catch (error) {
            // if api fetch fails, skip this pokemon
            return null;
          }
        })
      );

      // remove null entries and set pokemons
      setPokemons(detailedPokemons.filter(Boolean) as Pokemon[]);

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ScrollView 
    contentContainerStyle={{ gap:16, padding:16 }} // scrollview takes a property called - contentContainerStyle
    style={{ padding: 20}}> 
    
     {pokemons.map((pokemon) => (
    <Link key={pokemon.name} 
    href={"/details"} // we can pass like this or an object with path
    >
      <View
      style={{ 
        // @ts-ignore
        backgroundColor: colorByType[pokemon.types[0].type.name] + 50,
        padding:20,
        borderRadius:20
      }}  >
        <Text style={styles.name}>{pokemon.name}</Text>
        <Text style={styles.type}>({pokemon.types[0].type.name})</Text>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <Image source={{ uri: pokemon.image }} style={{ width:150, height: 150 }} />
          <Image source={{ uri: pokemon.imageBack }} style={{ width: 150, height: 150 }} />
        </View>
          
      </View>
    </Link>
     ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name:{
    fontSize: 20,
    fontWeight: 800,
    textTransform: "uppercase",
    textAlign: "center",
  },
  type:{
    fontSize:20,
    fontWeight:"bold",
    color:"gray",
    textAlign:"center",
    textTransform:"capitalize"
  }
})
