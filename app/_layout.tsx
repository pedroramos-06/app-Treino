import { myTheme } from "../theme/theme";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import {
  Inter_400Regular,
  Inter_500Medium,
} from "@expo-google-fonts/inter";
import {
  Poppins_600SemiBold,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import { PaperProvider } from 'react-native-paper';
import { StatusBar } from "expo-status-bar";
import { ExercicioProvider } from "@/contexts/ExercicioContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    InterRegular: Inter_400Regular,
    InterMedium: Inter_500Medium,
    PoppinsSemiBold: Poppins_600SemiBold,
    PoppinsMedium: Poppins_500Medium,
    PoppinsBold: Poppins_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <PaperProvider theme={myTheme}>
      <StatusBar style="light" />
      <ExercicioProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="exercicios/gerenciar" options={{ headerShown: false }} />
          <Stack.Screen name="exercicios/historico" options={{ headerShown: false }} />
        </Stack>
      </ExercicioProvider>
    </PaperProvider>
  );
}