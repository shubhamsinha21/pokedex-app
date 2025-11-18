import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";


interface Pokemon {
  name: string;
  url: string;  
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
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
      const data = await response.json();
      setPokemons(data.results);

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ScrollView style={{ padding: 20, backgroundColor: '#dc2222ff' }}>
     {pokemons.map((pokemon) => (
      <View key={pokemon.name} style={{ marginBottom: 10, padding: 10, backgroundColor: '#fff', borderRadius: 5 }}  >
        <Text>{pokemon.name}</Text>
      </View>
     ))}
    </ScrollView>
  );
}
