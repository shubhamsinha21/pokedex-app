import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen
      name="index" options={{title: "Pokedex"}}
    />
    <Stack.Screen
      name="details" options={{
        title: "Details", 
        headerBackButtonDisplayMode: "minimal", // to remove title of back button - only arrow
        presentation: "formSheet", // to show details screen as modal
        sheetAllowedDetents:[.3, .5, .7],
        // sheetGrabberVisible:true, // to show grabber on modal
        headerShown: true, // hide header on details screen
      
        // presentation: "modal", // to show details screen as modal
      }}
    />
  </Stack>;
}
