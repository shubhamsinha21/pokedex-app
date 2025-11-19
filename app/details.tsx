import { useLocalSearchParams } from "expo-router/build/hooks";
import { ScrollView, StyleSheet } from "react-native";



export default function Details() {
    const params = useLocalSearchParams()  // react hook to get params passed via link
    console.log(params);

  return (
    <ScrollView 
    contentContainerStyle={{ gap:16, padding:16 }}> 
    
    </ScrollView>
  );
}

const styles = StyleSheet.create({
})
