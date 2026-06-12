import { useEffect } from "react";
import { useColorScheme, Image, View } from "react-native";

import { Tabs, ThemeProvider, DefaultTheme, DarkTheme } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded, error] = useFonts({
    Inter: require("@/assets/fonts/Inter.ttf"),
    Lato: require("@/assets/fonts/Lato.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Tabs
        screenOptions={{
          headerShown: false,

          // tabBarStyle: { position: "absolute" },
          // tabBarActiveTintColor: colorScheme === "dark" ? "#fff" : "#000",
          // tabBarInactiveTintColor: colorScheme === "dark" ? "#888" : "#888",
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Image
                source={require("@/assets/images/tabIcons/home.png")}
                style={{ width: 24, height: 24, tintColor: color }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(profiles)"
          options={{
            title: "Profiles",
            tabBarIcon: ({ color }) => (
              <Image
                source={require("@/assets/images/tabIcons/profiles.png")}
                style={{ width: 24, height: 24, tintColor: color }}
              />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
