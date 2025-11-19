import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";


interface Pokemon {
  name: string;
  image: string;  
}

export default function Index() {

  const [pokemons, setPokemons] = useState<Pokemon[]>([]) // empty array as initial state
  // list of type of pokemons "Pokemon"

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
            if (!details.sprites?.front_default) return null;

            return {
              name: pokemon.name,
              image: details.sprites.front_default,
            };
          } catch (error) {
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
        <Text>{pokemon.name}</Text>
          <Image source={{ uri: pokemon.image }} style={{ width: 100, height: 100 }} />
      </View>
     ))}
    </ScrollView>
  );
}
