// App.tsx
import React from 'react';
import { SafeAreaView } from 'react-native';
import DeviceScanner from './components/ DeviceScanner'; // ✅ adjust path if needed

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DeviceScanner />
    </SafeAreaView>
  );
};

export default App;
