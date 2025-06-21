import { useState, useEffect, useCallback } from 'react';
import { BleManager, Device, Characteristic, Subscription } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import { Buffer } from 'buffer';
import { useSoilData } from '@/context/SoilDataContext';

const bleManager = new BleManager();

interface SoilDataPoint {
  label: string;
  value: string;
  unit: string;
  goodRangeMin: number;
  goodRangeMax: number;
}

interface BluetoothHook {
  devices: Device[];
  connectedDevice: Device | null;
  isScanning: boolean;
  error: string | null;
  startScan: () => Promise<void>;
  stopScan: () => void;
  clearDevices: () => void;
  connectToDevice: (deviceId: string) => Promise<Device | null>;
  disconnectDevice: () => Promise<void>;
}

const useBluetooth = (): BluetoothHook => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setSoilData, setBleInput } = useSoilData();

  const requestBluetoothPermissions = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    const permissions = [
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ];

    try {
      let allGranted = true;
      for (const perm of permissions) {
        const granted = await PermissionsAndroid.check(perm);
        console.log(`Checking ${perm}: ${granted}`);
        if (!granted) {
          const result = await PermissionsAndroid.request(perm);
          console.log(`Requested ${perm}: ${result}`);
          if (result !== PermissionsAndroid.RESULTS.GRANTED) {
            allGranted = false;
            Alert.alert(
              'Bluetooth Permissions Required',
              `Please grant ${perm.split('.').pop()?.replace('_', ' ').toLowerCase()} in Settings to scan for devices.`,
              [
                { text: 'OK', style: 'cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() },
              ]
            );
          }
        }
      }
      return allGranted;
    } catch (err) {
      console.error('Permission request failed:', err);
      setError('Failed to request permissions.');
      return false;
    }
  }, []);

  useEffect(() => {
    const subscription = bleManager.onStateChange((state) => {
      console.log('Bluetooth state:', state);
      if (state === 'PoweredOn') {
        setError(null);
      } else if (state === 'PoweredOff') {
        setError('Bluetooth is disabled. Please enable it.');
        Alert.alert(
          'Bluetooth Disabled',
          'Please enable Bluetooth to scan for devices.',
          [
            { text: 'OK', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: async () => {
                try {
                  await Linking.openURL('android.settings.BLUETOOTH_SETTINGS');
                } catch (err) {
                  console.error('Failed to open settings:', err);
                  await Linking.openSettings();
                }
              },
            },
          ]
        );
      } else {
        setError(`Bluetooth state: ${state}`);
      }
    }, true);

    return () => {
      subscription.remove();
      bleManager.stopDeviceScan();
      bleManager.destroy();
      console.log('BLE manager destroyed');
    };
  }, []);

  const startScan = useCallback(async () => {
    if (isScanning) {
      console.log('Scan already in progress');
      return;
    }

    if (!(await requestBluetoothPermissions())) {
      setError('Bluetooth permissions not granted.');
      return;
    }

    setDevices([]);
    setIsScanning(true);
    setError(null);

    try {
      console.log('Starting Bluetooth scan...');
      bleManager.startDeviceScan(null, { allowDuplicates: false, scanMode: 'LowLatency' }, (err, device) => {
        if (err) {
          console.error('Scan error:', err.message, 'Code:', err.errorCode);
          setError(`Scan failed: ${err.message} (Code: ${err.errorCode})`);
          setIsScanning(false);
          bleManager.stopDeviceScan();
          Alert.alert('Scan Error', `Failed to scan: ${err.message}`);
          return;
        }

        if (device) {
          console.log('Found device:', {
            id: device.id,
            name: device.name,
            localName: device.localName,
            rssi: device.rssi,
            isConnectable: device.isConnectable,
            manufacturerData: device.manufacturerData,
            serviceData: device.serviceData,
            serviceUUIDs: device.serviceUUIDs,
            rawScanRecord: device.rawScanRecord,
            mtu: device.mtu,
          });
          setDevices((prev) => {
            if (!prev.find((d) => d.id === device.id)) {
              return [...prev, device];
            }
            return prev;
          });
        }
      });

      setTimeout(() => {
        bleManager.stopDeviceScan();
        setIsScanning(false);
        console.log('Scan timed out');
      }, 15000);
    } catch (err) {
      console.error('Scan failed:', err);
      setError('An error occurred while scanning.');
      setIsScanning(false);
      bleManager.stopDeviceScan();
      Alert.alert('Scan Error', 'An error occurred while scanning.');
    }
  }, [requestBluetoothPermissions]);

  const stopScan = useCallback(() => {
    try {
      bleManager.stopDeviceScan();
      setIsScanning(false);
      setError(null);
      console.log('Scan stopped');
    } catch (err) {
      console.error('Stop scan failed:', err);
      setError('Failed to stop scanning.');
      Alert.alert('Stop Scan Error', 'Failed to stop scanning.');
    }
  }, []);

  const clearDevices = useCallback(() => {
    setDevices([]);
    console.log('Devices cleared');
  }, []);

  const connectToDevice = useCallback(
    async (deviceId: string): Promise<Device | null> => {
      if (connectedDevice && connectedDevice.id === deviceId) {
        console.log('Device already connected:', connectedDevice.name || connectedDevice.id);
        return connectedDevice;
      }

      try {
        if (connectedDevice) {
          await bleManager.cancelDeviceConnection(connectedDevice.id);
          setConnectedDevice(null);
        }

        const device = await bleManager.connectToDevice(deviceId);
        await device.discoverAllServicesAndCharacteristics();
        setConnectedDevice(device);
        console.log('Connected to device:', device.name || device.id, 'MTU:', device.mtu);

        // Attempt to read Device Name characteristic
        // Attempt to read Device Name characteristic
        try {
          const characteristic = await device.readCharacteristicForService('1800', '00002A00-0000-1000-8000-00805F9B34FB');
          if (characteristic?.value) {
            try {
              const deviceName = Buffer.from(characteristic.value, 'base64').toString('utf8');
              console.log('Read device name:', deviceName);
              // No need to update devices state, as getDisplayName handles name display
            } catch (decodeError) {
              console.warn('Failed to decode Device Name characteristic value:', decodeError);
            }
          }
        } catch (nameError) {
          console.warn('Failed to read Device Name characteristic:', nameError);
        }

        return device;
      } catch (err) {
        console.error('Connection failed:', err);
        setError('Failed to connect to device.');
        Alert.alert('Connection Error', 'Failed to connect to device.');
        return null;
      }
    },
    [connectedDevice]
  );

  const disconnectDevice = useCallback(async () => {
    if (!connectedDevice) {
      console.log('No connected device');
      return;
    }

    try {
      await bleManager.cancelDeviceConnection(connectedDevice.id);
      console.log('Disconnected from device:', connectedDevice.name || connectedDevice.id);
      setConnectedDevice(null);
    } catch (err) {
      console.error('Disconnect failed:', err);
      setError('Failed to disconnect from device.');
      Alert.alert('Disconnect Error', 'Failed to disconnect from device.');
    }
  }, [connectedDevice]);

  return {
    devices,
    startScan,
    stopScan,
    clearDevices,
    connectToDevice,
    disconnectDevice,
    connectedDevice,
    isScanning,
    error,
  };
};

export default useBluetooth;