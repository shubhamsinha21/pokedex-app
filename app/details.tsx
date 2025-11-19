import { Stack } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Details() {
  const params = useLocalSearchParams();
  const nameParam = (params.name as string);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pokemon, setPokemon] = useState<any | null>(null);

  useEffect(() => {
    if (!nameParam) {
      setError("No Pokémon name provided");
      setLoading(false);
      return;
    }
    fetchPokemonByName(nameParam);
  }, [nameParam]);

  async function fetchPokemonByName(name: string) {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);

      const data = await res.json();
      setPokemon(data);
    } catch {
      setError("Could not load Pokémon details.");
    } finally {
      setLoading(false);
    }
  }

  const typesToText = (types: any[]) =>
    types && types.length ? types.map(t => t.type?.name).join(", ") : "—";

  const abilitiesToText = (abs: any[]) =>
    abs && abs.length ? abs.map(a => a.ability?.name).join(", ") : "—";

  return (
    <>
      <Stack.Screen options={{ title: nameParam }} />

      <ScrollView contentContainerStyle={styles.container}>
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}

        {error && !loading && (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {pokemon && !loading && (
          <View style={styles.card}>
            {/* Name */}
            <Text style={styles.title}>{pokemon.name.toUpperCase()}</Text>

            {/* Image */}
            <View style={styles.imageWrap}>
              {pokemon.sprites?.front_default ? (
                <Image
                  source={{ uri: pokemon.sprites.front_default }}
                  style={styles.image}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.noImage}>No image available</Text>
              )}
            </View>

            {/* Types */}
            <View style={styles.section}>
              <Text style={styles.label}>Type</Text>
              <Text style={styles.value}>{typesToText(pokemon.types)}</Text>
            </View>

            {/* Height & Weight */}
            <View style={styles.section}>
              <Text style={styles.label}>Height / Weight</Text>
              <Text style={styles.value}>
                {pokemon.height ?? "—"} (decimeters) / {pokemon.weight ?? "—"} (hectograms)
              </Text>
            </View>

            {/* Abilities */}
            <View style={styles.section}>
              <Text style={styles.label}>Abilities</Text>
              <Text style={styles.value}>{abilitiesToText(pokemon.abilities)}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  center: {
    alignItems: "center",
    marginTop: 40,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    // simple shadow for iOS
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    // elevation for Android
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  imageWrap: {
    alignItems: "center",
    marginBottom: 16,
  },
  image: {
    width: 180,
    height: 180,
  },
  noImage: {
    color: "#666",
  },
  section: {
    marginBottom: 12,
  },
  label: {
    fontWeight: "700",
    marginBottom: 4,
  },
  value: {
    color: "#333",
  },
});
