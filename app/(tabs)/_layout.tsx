// TabLayout.tsx
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LanguageSelector from '@/components/LanguageSelector';
import { View } from 'react-native';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import { useTranslatedText } from '@/hooks/useTranslatedText';
import { useMemo } from 'react';

function DynamicTabs() {
  const home = useTranslatedText('Home');
  const nutrients = useTranslatedText('Nutrients');
  const texture = useTranslatedText('Texture');
  const water = useTranslatedText('Water');
  const reports = useTranslatedText('Reports');

  const tabOptions = useMemo(() => ({
    home,
    nutrients,
    texture,
    water,
    reports,
  }), [home, nutrients, texture, water, reports]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerRight: () => (
          <View style={{ paddingRight: 15 }}>
            <LanguageSelector />
          </View>
        )
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: tabOptions.home,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="nutrients"
        options={{
          title: tabOptions.nutrients,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="leaf" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="texture"
        options={{
          title: tabOptions.texture,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="terrain" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="water"
        options={{
          title: tabOptions.water,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="water" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: tabOptions.reports,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="file-document" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <LanguageProvider>
      <DynamicTabs />
    </LanguageProvider>
  );
}
