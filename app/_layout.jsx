import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { MenuProvider } from "react-native-popup-menu";
import { AuthContextProvider, useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
SplashScreen.preventAutoHideAsync();
import { useSegments } from "expo-router";

const MainLayout = () => {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { isAuthenticated, isSigningUp } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    async function handleNavigation() {
      const isInApp = segments[0] === "(tabs)";

      if (typeof isAuthenticated === "undefined") {
        return;
      }
      if (isAuthenticated && !isInApp) {
        await router.replace("home");
      } else if (!isAuthenticated) {
        await router.replace("new-user");
      }
    }

    if (loaded && isAuthenticated !== undefined) {
      SplashScreen.hideAsync();
      handleNavigation();
    }
  }, [loaded, isAuthenticated]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <GestureHandlerRootView>
        <MenuProvider>
          <MainLayout />
        </MenuProvider>
      </GestureHandlerRootView>
    </AuthContextProvider>
  );
}
