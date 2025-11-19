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

export default function Index() {

  const [pokemons, setPokemons] = useState<Pokemon[]>([]) // empty array as initial state
  // list of type of pokemons "Pokemon"

  console.warn(JSON.stringify(pokemons[0], null, 1));
  useEffect(() => {
    //fetch pokemons
    fetchPokemons();
  }, []);


  async function fetchPokemons() {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
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
    <ScrollView style={{ padding: 20, }}>
     {pokemons.map((pokemon) => (
      <View key={pokemon.name} style={{ marginBottom: 10, padding: 10, backgroundColor: '#fff', borderRadius: 5 }}  >
        <Text style={styles.name}>{pokemon.name}</Text>
        <Text style={{textTransform: "capitalize"}}>({pokemon.types[0].type.name})</Text>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <Image source={{ uri: pokemon.image }} style={{ width:150, height: 150 }} />
          <Image source={{ uri: pokemon.imageBack }} style={{ width: 150, height: 150 }} />
        </View>
          
      </View>
     ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name:{
    fontSize: 20,
    fontWeight: 800,
    textTransform: "uppercase"
  },
})
