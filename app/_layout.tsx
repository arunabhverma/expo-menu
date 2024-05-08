import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router/stack";
import { Platform, useColorScheme } from "react-native";
import { EventProvider } from "react-native-outside-press";
import { SafeAreaProvider } from "react-native-safe-area-context";

declare module "@react-navigation/native" {
  export type ExtendedTheme = {
    dark: boolean;
    colors: {
      primary: string;
      background: string;
      card: string;
      text: string;
      border: string;
      notification: string;
      menuBg: string;
    };
  };
  export function useTheme(): ExtendedTheme;
}

export default function AppLayout() {
  const colorScheme = useColorScheme();
  let dark = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "#121212",
      card: "#1e1e1e",
      menuBg: "#2d2d2d",
      text: "#e6e6e6",
    },
  };
  let light = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      menuBg: "white",
      text: "#1f1f1f",
      border: "rgba(100, 100, 100 , 0.1)",
    },
  };
  const theme = colorScheme === "dark" ? dark : light;
  return (
    <EventProvider>
      <SafeAreaProvider>
        <ThemeProvider value={theme}>
          <Stack
            screenOptions={{
              title: "Menu",
              headerTransparent: Platform.select({ android: false, ios: true }),
              headerBlurEffect:
                colorScheme === "light"
                  ? "systemMaterialLight"
                  : "systemMaterialDark",
              navigationBarColor: theme.colors.card,
            }}
          />
        </ThemeProvider>
      </SafeAreaProvider>
    </EventProvider>
  );
}
