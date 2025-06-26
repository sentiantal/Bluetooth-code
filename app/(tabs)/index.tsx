import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground, TouchableOpacity, Animated, Easing, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useBluetooth from '@/hooks/useBluetooth';
import { Device } from 'react-native-ble-plx';

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { devices, isScanning, error, startScan, stopScan, connectToDevice, handleDevicePress } = useBluetooth();
  const [spinAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.setValue(0);
    }
  }, [isScanning, spinAnim]);

  useEffect(() => {
    if (error) {
      Alert.alert('Bluetooth Error', error);
    }
  }, [error]);

  const handleConnect = async (device: Device) => {
    try {
      const connectedDevice = await connectToDevice(device.id);
      if (connectedDevice) {
        router.push({
          pathname: '../deviceDetails',
          params: { deviceId: '' },
        });
      }
    } catch (err) {
      console.error('Connection error:', err);
      Alert.alert('Connection Error', 'Failed to connect to device.');
    }
  };

  const getDisplayName = (device: Device) => {
    return (
      device.name ||
      device.localName ||
      `Device_${device.id.slice(-8).replace(/:/g, '')}`
    );
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/farm-background.jpg')}
        style={styles.header}
        resizeMode="cover"
        onError={(e) => console.error('Image load error:', e.nativeEvent.error)}
      >
        <Text style={styles.title}>Welcome to Agrow</Text>
        <Text style={styles.subtitle}>Comprehensive soil analysis for better farming</Text>
      </ImageBackground>
      <View style={styles.content}>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <View style={styles.deviceSection}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="bluetooth" size={24} color="#333" style={styles.icon} />
            <Text style={styles.sectionTitle}>Bluetooth Devices</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={startScan}
              style={[styles.scanButton, isScanning && styles.disabledButton]}
              disabled={isScanning}
            >
              <Text style={styles.buttonText}>Start Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={stopScan}
              style={[styles.scanButton, !isScanning && styles.disabledButton]}
              disabled={!isScanning}
            >
              <Text style={styles.buttonText}>Stop Scan</Text>
            </TouchableOpacity>
          </View>
          {isScanning ? (
            <View style={styles.scannerContainer}>
              <Animated.View style={[styles.scanner, { transform: [{ rotate: spin }] }]}>
                <MaterialCommunityIcons name="radar" size={40} color="#4CAF50" />
              </Animated.View>
              <Text style={styles.scanningText}>Scanning...</Text>
            </View>
          ) : devices.length > 0 ? (
            <FlatList
              data={devices}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleDevicePress(item)}>
                  <Text style={styles.deviceText}>{getDisplayName(item)}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.deviceText}>No devices found. Tap "Start Scan" to search.</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  deviceSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  scanButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  scanner: {
    marginBottom: 10,
  },
  scanningText: {
    fontSize: 16,
    color: '#4CAF50',
  },
  deviceText: {
    fontSize: 16,
    marginVertical: 5,
    color: '#4CAF50',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default HomeScreen;