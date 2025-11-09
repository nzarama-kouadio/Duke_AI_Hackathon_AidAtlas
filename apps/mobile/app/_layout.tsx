import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { queryClient } from "@/config/queryClient";
import { AidAtlasTheme } from "@/config/theme";

SplashScreen.preventAutoHideAsync().catch(() => null);

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (fontsLoaded && !appIsReady) {
    setAppIsReady(true);
    SplashScreen.hideAsync().catch(() => null);
  }

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={AidAtlasTheme}>
          <StatusBar style="dark" />
          <Slot />
        </PaperProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
