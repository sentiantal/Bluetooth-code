// app/_layout.tsx
import { Stack } from 'expo-router';
import { SoilDataProvider } from '@/context/SoilDataContext';
import { StatusBar } from 'expo-status-bar';
import { LanguageProvider } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

export default function RootLayout() {
  return (
    <LanguageProvider>
    <SoilDataProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </SoilDataProvider>
    </LanguageProvider>
  );
}