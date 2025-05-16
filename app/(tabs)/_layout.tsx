import { Tabs } from 'expo-router';
import { Chrome as Home, Leaf, Mountain, Droplets, FileText } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#78909C',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E0E0E0',
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerStyle: {
          backgroundColor: '#2E7D32',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'Soil Report',
        }}
      />
      <Tabs.Screen
        name="nutrients"
        options={{
          title: 'Nutrients',
          tabBarIcon: ({ color, size }) => <Leaf size={size} color={color} />,
          headerTitle: 'Soil Nutrients',
        }}
      />
      <Tabs.Screen
        name="texture"
        options={{
          title: 'Texture',
          tabBarIcon: ({ color, size }) => <Mountain size={size} color={color} />,
          headerTitle: 'Soil Texture',
        }}
      />
      <Tabs.Screen
        name="water"
        options={{
          title: 'Water',
          tabBarIcon: ({ color, size }) => <Droplets size={size} color={color} />,
          headerTitle: 'Water Content',
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, size }) => <FileText size={size} color={color} />,
          headerTitle: 'Soil Reports',
        }}
      />
    </Tabs>
  );
}