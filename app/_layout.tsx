// app/_layout.tsx
import { Stack } from 'expo-router';
import { SoilDataProvider } from '@/context/SoilDataContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <SoilDataProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </SoilDataProvider>
  );
}