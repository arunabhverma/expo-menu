import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router/stack";
import { useColorScheme } from "react-native";
import { EventProvider } from "react-native-outside-press";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function AppLayout() {
  const colorScheme = useColorScheme();
  let dark = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      text: "#e3e3e3",
      border: "rgba(100, 100, 100 , 0.1)",
    },
  };
  let light = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      text: "#1f1f1f",
      border: "rgba(100, 100, 100 , 0.1)",
    },
  };
  const theme = colorScheme === "dark" ? dark : light;
  return (
    <EventProvider>
      <SafeAreaProvider>
        <ThemeProvider value={theme}>
          <Stack />
        </ThemeProvider>
      </SafeAreaProvider>
    </EventProvider>
  );
}
