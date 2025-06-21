// components/DeviceCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

interface DeviceCardProps {
  isConnected: boolean;
  deviceName: string;
  devices: any[];
  isScanning: boolean;
  onConnect: (deviceId: string) => void;
  onDisconnect: () => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({
  isConnected,
  deviceName,
  devices,
  isScanning,
  onConnect,
  onDisconnect,
}) => {
  const renderDeviceItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => onConnect(item.id)}
      disabled={isConnected}
    >
      <Text style={styles.deviceItemText}>{item.name || 'Unknown Device'} ({item.id})</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Bluetooth Devices</Text>
      <Text style={styles.status}>
        {isConnected
          ? `Connected to: ${deviceName}`
          : isScanning
          ? 'Scanning for devices...'
          : devices.length > 0
          ? 'Select a device to connect'
          : 'No devices found'}
      </Text>
      {isScanning && <ActivityIndicator size="small" color="#2E7D32" style={styles.scanningIndicator} />}
      {!isConnected && devices.length > 0 && (
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={renderDeviceItem}
          style={styles.deviceList}
        />
      )}
      {isConnected && (
        <TouchableOpacity style={styles.button} onPress={onDisconnect}>
          <Text style={styles.buttonText}>Disconnect</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 12,
  },
  scanningIndicator: {
    marginBottom: 12,
  },
  deviceList: {
    maxHeight: 150,
  },
  deviceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  deviceItemText: {
    fontSize: 16,
    color: '#424242',
  },
  button: {
    backgroundColor: '#2E7D32',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DeviceCard;