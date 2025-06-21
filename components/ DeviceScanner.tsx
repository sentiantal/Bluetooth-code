// components/DeviceScanner.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { deviceManager } from '../utils/deviceManager'; // ✅ correct import

type Device = {
  id: string;
  name: string;
};

const DeviceScanner: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const handleScan = async () => {
    setIsScanning(true);
    const foundDevices = await deviceManager.scan();
    setDevices(foundDevices);
    setIsScanning(false);
  };

  return (
    <View style={styles.container}>
      <Button title="Scan for Devices" onPress={handleScan} />

      {isScanning && (
        <View style={styles.scanning}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.scanningText}>Scanning...</Text>
        </View>
      )}

      {!isScanning && devices.length > 0 && (
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={styles.deviceItem}>
              {item.name} (ID: {item.id})
            </Text>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
  },
  scanning: {
    marginTop: 20,
    alignItems: 'center',
  },
  scanningText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  deviceItem: {
    marginTop: 15,
    fontSize: 16,
  },
});

export default DeviceScanner;
