import { useState, useEffect, useCallback } from 'react';
import { BleManager, Device, LogLevel } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import { Buffer } from 'buffer';
import { useSoilData } from '@/context/SoilDataContext';
import { useRouter } from 'expo-router';

// Initialize BleManager only if we're not on web platform
const bleManager = Platform.OS !== 'web' ? new BleManager() : null;
if (bleManager) {
  bleManager.setLogLevel(LogLevel.Verbose);
}

const SERVICE_UUID = '0000180F-0000-1000-8000-00805F9B34FB';
const CHARACTERISTIC_UUID = '00002A19-0000-1000-8000-00805F9B34FB';

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
  getDisplayName: (device: Device) => string;
  handleDevicePress: (device: Device) => void;
}

const useBluetooth = (): BluetoothHook => {
  const [deviceNames, setDeviceNames] = useState<{ [id: string]: string }>({});
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setSoilData, setBleInput } = useSoilData();
  const router = useRouter();

  const getDisplayName = useCallback((device: Device): string => {
    return device.localName && device.localName.trim() !== '' ? device.localName : '';
  }, []);

  const requestBluetoothPermissions = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    const permissions = [
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ];

    try {
      let allGranted = true;
      for (const perm of permissions) {
        const granted = await PermissionsAndroid.check(perm);
        if (!granted) {
          const result = await PermissionsAndroid.request(perm);
          if (result !== PermissionsAndroid.RESULTS.GRANTED) {
            allGranted = false;
            Alert.alert(
              'Bluetooth Permissions Required',
              `Please grant ${perm.split('.').pop()?.replace('_', ' ').toLowerCase()} in Settings.`,
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
      setError('Failed to request permissions.');
      return false;
    }
  }, []);

  useEffect(() => {
    if (!bleManager) {
      setError('Bluetooth is not available on this platform.');
      return;
    }

    const subscription = bleManager.onStateChange((state) => {
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
                } catch {
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
      if (bleManager) {
        bleManager.stopDeviceScan();
      }
    };
  }, []);

  const startScan = useCallback(async () => {
    if (isScanning) return;
    
    if (!bleManager) {
      setError('Bluetooth is not available on this platform.');
      return;
    }
    
    if (!(await requestBluetoothPermissions())) {
      setError('Bluetooth permissions not granted.');
      return;
    }

    setDevices([]);
    setIsScanning(true);
    setError(null);

    bleManager.startDeviceScan(null, null, (err, device) => {
      if (err) {
        setError(`Scan failed: ${err.message}`);
        setIsScanning(false);
        bleManager.stopDeviceScan();
        return;
      }
      if (device) {
        const displayName = getDisplayName(device);
        if (!displayName) return;
        setDevices((prev) => {
          const exists = prev.find((d) => d.id === device.id);
          return exists ? prev.map(d => d.id === device.id ? device : d) : [...prev, device];
        });
      }
    });

    setTimeout(() => {
      if (bleManager) {
        bleManager.stopDeviceScan();
      }
      setIsScanning(false);
    }, 15000);
  }, [requestBluetoothPermissions, getDisplayName]);

  const handleDevicePress = async (device: Device) => {
    console.log('🔘 Connecting to device:', device.id);

    const connected = await connectToDevice(device.id);

    if (connected) {
      console.log('✅ Connected, navigating to deviceDetails.tsx');
      router.push(`/deviceDetails?deviceId=${device.id}`);
    } else {
      console.warn('❌ Failed to connect, not navigating');
    }
  };


  const stopScan = useCallback(() => {
    if (bleManager) {
      bleManager.stopDeviceScan();
    }
    setIsScanning(false);
    setError(null);
  }, []);

  const clearDevices = useCallback(() => {
    setDevices([]);
  }, []);

  const connectToDevice = async (deviceId: string): Promise<Device | null> => {
    if (connectedDevice && connectedDevice.id === deviceId) {
      console.log('✅ Device already connected');
      return connectedDevice;
    }

    if (!bleManager) {
      //console.error('❌ Bluetooth is not available on this platform');
      setError('Bluetooth is not available on this platform.');
      return null;
    }

    try {
      const device = await bleManager.connectToDevice(deviceId, { timeout: 5000 });
      await device.discoverAllServicesAndCharacteristics();
      setConnectedDevice(device);

      console.log('🔌 Connected to device:', device.name, device.id);

      const services = await device.services();
      for (const service of services) {
        const characteristics = await service.characteristics();
        for (const char of characteristics) {
          //console.log('  🔗 Characteristic:', char.uuid, '| Notifiable:', char.isNotifiable);
        }
      }

      let buffer: number[] = [];
      let isAwaitingBackend = false;

      device.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        (error: Error | null, characteristic: import('react-native-ble-plx').Characteristic | null) => {
          if (error) {
            console.error('❌ Monitor error:', error.message);
            return;
          }

          const value = characteristic?.value;
          if (value) {
            const decoded = Buffer.from(value, 'base64').toString('utf-8');
            const parsed = parseFloat(decoded);

            if (!isNaN(parsed)) {
              //console.log('📥 Received value:', parsed);
              if (!isAwaitingBackend) {
                buffer.push(parsed);
              }

              if (buffer.length === 18 && !isAwaitingBackend) {
                const valuesToSend = [...buffer];
                buffer = [];
                isAwaitingBackend = true;
                setBleInput(valuesToSend);
                //console.log('🚀 Sending to backend:', JSON.stringify({ data: valuesToSend }));

                sendDataToBackendAndUpdate(valuesToSend)
                  .then(() => (isAwaitingBackend = false))
                  .catch((err) => {
                    console.error('❌ Backend error:', err);
                    isAwaitingBackend = false;
                  });
              }
            }
          }
        }
      );

      return device;
    } catch (err) {
      console.error('❌ Connection failed:', err);
      return null;
    }
  };


  const sendDataToBackendAndUpdate = async (valuesArray: number[]) => {
    try {
      const jsonBody = JSON.stringify({ data: valuesArray });
      //console.log('Sending to backend:', jsonBody);

      const response = await fetch('https://spectro.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonBody,
      });

      const result = await response.json();
      //console.log('Backend response:', result);

      if (result && result.predictions) {
        const transformed = transformBackendResponse(result);
        if (transformed.length === 20) {
          setSoilData(transformed);
        } else {
          console.error('⚠️ Received incorrect number of fields:', transformed.length);
        }
      } else {
        console.error('❌ Unexpected backend response:', result);
      }
    } catch (error) {
      console.error('Backend call failed:', error);
    }
  };

  const disconnectDevice = useCallback(async () => {
    if (!connectedDevice || !bleManager) return;
    try {
      await bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
    } catch {
      setError('Failed to disconnect from device.');
      Alert.alert('Disconnect Error', 'Failed to disconnect from device.');
    }
  }, [connectedDevice]);

  // 🧠 Continuous Monitoring
  useEffect(() => {
    if (!connectedDevice || !bleManager) return;

    console.log('📡 Monitoring BLE for data...');
    let buffer: number[] = [];
    let isAwaitingBackend = false;

    const subscription = connectedDevice.monitorCharacteristicForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      async (error, characteristic) => {
        if (error || !characteristic?.value) return;

        const decoded = Buffer.from(characteristic.value, 'base64').toString('utf-8');
        const parsed = parseFloat(decoded);

        if (!isNaN(parsed)) {
          //console.log('📥 Value from device:', parsed);
          buffer.push(parsed);
        }

        if (buffer.length === 18 && !isAwaitingBackend) {
          const valuesToSend = [...buffer];
          buffer = [];
          isAwaitingBackend = true;

          //console.log('📤 Sending to backend:', valuesToSend);
          setBleInput(valuesToSend);

          try {
            const response = await fetch('https://spectro.onrender.com/predict', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: valuesToSend }),
            });

            const result = await response.json();
            //console.log('📬 Backend response:', result);

            if (result?.predictions) {
              const transformed = transformBackendResponse(result);
              //console.log('📦 Transformed predictions:', transformed);
              if (transformed.length === 20) {
                setSoilData(transformed);
              }
            }
          } catch (err) {
            console.error('❌ Backend error:', err);
          } finally {
            isAwaitingBackend = false;
          }
        }
      }
    );

    return () => subscription?.remove();
  }, [connectedDevice]);

  const transformBackendResponse = (response: any): SoilDataPoint[] => {
    const pred = response.predictions;
    const keys = [
      'b_ext', 'ca_ext', 'cu_ext', 'ec_usda', 'fe_ext', 'k_ext', 'mg_ext', 'n_tot', 'oc_usda', 'p_ext', 'ph_h2o', 's_ext', 'zn_ext', 'clay_tot', 'sand_tot', 'silt_tot', 'wr_10kPa', 'wr_1500kPa', 'wr_33kPa', 'soil_moisture'
    ];
    const missing = keys.filter(k => !(k in pred));
    if (missing.length) return [];

    return [
      { label: 'Potassium Content', value: pred.k_ext.toFixed(2), unit: 'kg/ha', goodRangeMin: 300, goodRangeMax: 450 },
      { label: 'Total Nitrogen (N)', value: pred.n_tot.toFixed(2), unit: 'kg/ha', goodRangeMin: 140, goodRangeMax: 280 },
      { label: 'Organic Carbon (OC)', value: pred.oc_usda.toFixed(2), unit: '%', goodRangeMin: 0.21, goodRangeMax: 1.0 },
      { label: 'Phosphorus Content', value: pred.p_ext.toFixed(2), unit: 'kg/ha', goodRangeMin: 7, goodRangeMax: 14 },
      { label: 'pH Level', value: pred.ph_h2o.toFixed(2), unit: '', goodRangeMin: 7.5, goodRangeMax: 9.0 },
      { label: 'Boron (B)', value: pred.b_ext.toFixed(2), unit: 'ppm', goodRangeMin: 0.5, goodRangeMax: 1.5 },
      { label: 'Calcium (Ca)', value: pred.ca_ext.toFixed(2), unit: 'ppm', goodRangeMin: 1000, goodRangeMax: 3000 },
      { label: 'Copper (Cu)', value: pred.cu_ext.toFixed(2), unit: 'ppm', goodRangeMin: 0.2, goodRangeMax: 2.0 },
      { label: 'Electrical Conductivity (EC)', value: pred.ec_usda.toFixed(2), unit: 'dS/m', goodRangeMin: 0, goodRangeMax: 1.5 },
      { label: 'Iron (Fe)', value: pred.fe_ext.toFixed(2), unit: 'ppm', goodRangeMin: 4.5, goodRangeMax: 10 },
      { label: 'Magnesium (Mg)', value: pred.mg_ext.toFixed(2), unit: 'ppm', goodRangeMin: 200, goodRangeMax: 600 },
      { label: 'Sulfur (S)', value: pred.s_ext.toFixed(2), unit: 'ppm', goodRangeMin: 10, goodRangeMax: 30 },
      { label: 'Zinc (Zn)', value: pred.zn_ext.toFixed(2), unit: 'ppm', goodRangeMin: 0.5, goodRangeMax: 3.0 },
      { label: 'Total Clay', value: pred.clay_tot.toFixed(2), unit: '%', goodRangeMin: 15, goodRangeMax: 35 },
      { label: 'Total Sand', value: pred.sand_tot.toFixed(2), unit: '%', goodRangeMin: 40, goodRangeMax: 60 },
      { label: 'Total Silt', value: pred.silt_tot.toFixed(2), unit: '%', goodRangeMin: 10, goodRangeMax: 30 },
      { label: 'Water Retention 10 kPa', value: pred.wr_10kPa.toFixed(2), unit: '%', goodRangeMin: 10, goodRangeMax: 40 },
      { label: 'Water Retention 1500 kPa', value: pred.wr_1500kPa.toFixed(2), unit: '%', goodRangeMin: 5, goodRangeMax: 20 },
      { label: 'Water Retention 33 kPa', value: pred.wr_33kPa.toFixed(2), unit: '%', goodRangeMin: 10, goodRangeMax: 30 },
      { label: 'Soil Moisture', value: pred.soil_moisture.toFixed(2), unit: '%', goodRangeMin: 10, goodRangeMax: 30 },
    ];
  };

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
    getDisplayName,
    handleDevicePress,
  };
};

export default useBluetooth;