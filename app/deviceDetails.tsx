import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { useLocalSearchParams } from 'expo-router';

const bleManager = new BleManager();

const DeviceDetails: React.FC = () => {
  const { deviceId } = useLocalSearchParams<{ deviceId: string }>();
  const [device, setDevice] = useState<Device | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const connectAndFetchDeviceData = useCallback(async () => {
    if (!deviceId) {
      setError('No device ID provided.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if already connected
      const isConnected = await bleManager.isDeviceConnected(deviceId);
      let connectedDevice: Device;

      if (!isConnected) {
        // Connect to the device
        connectedDevice = await bleManager.connectToDevice(deviceId);
      } else {
        // Retrieve device if already connected
        const devices = await bleManager.devices([deviceId]);
        connectedDevice = devices[0];
        if (!connectedDevice) {
          throw new Error('Device not found.');
        }
      }

      // Discover services and characteristics
      await connectedDevice.discoverAllServicesAndCharacteristics();
      console.log('Services discovered for:', connectedDevice.name);
      setDevice(connectedDevice);
    } catch (err: any) { // Use 'any' or 'unknown' and safely handle error
      const errorMessage = err?.message || String(err) || 'Unknown error';
      console.error('Error connecting to device:', err);
      setError(`Failed to connect to device: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  useEffect(() => {
    connectAndFetchDeviceData();

    return () => {
      if (device && deviceId) {
        bleManager.cancelDeviceConnection(deviceId).catch((err) => {
          console.error('Error disconnecting device:', err);
        });
      }
    };
  }, [deviceId, connectAndFetchDeviceData, device]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device Details</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : device ? (
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceText}>
            Connected to: {device.name || 'Unknown Device'}
          </Text>
          <Text style={styles.deviceText}>ID: {deviceId}</Text>
        </View>
      ) : (
        <Text style={styles.errorText}>No device data available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  deviceInfo: {
    alignItems: 'center',
  },
  deviceText: {
    fontSize: 18,
    marginVertical: 5,
    color: '#4CAF50',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default DeviceDetails;