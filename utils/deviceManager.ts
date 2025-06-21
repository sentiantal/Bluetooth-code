// services/DeviceManager.ts
import { Platform } from 'react-native';

type Device = {
  id: string;
  name: string;
}

class DeviceManager {
  private batteryCallback: ((level: number) => void) | null = null;
  private signalCallback: ((level: number) => void) | null = null;
  private mockDeviceTimer: ReturnType<typeof setInterval> | null = null;
  private mockBatteryLevel = 85;
  private mockSignalStrength = 72;

  constructor() {
    if (Platform.OS === 'ios') {
      console.log('Using web fallback for BLE functionality');
    }
  }

  async scan(): Promise<Device[]> {
    if (Platform.OS === 'ios') {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { id: 'demo1', name: 'Demo Soil Sensor' },
            { id: 'demo2', name: 'SoilSensor Pro' },
          ]);
        }, 2000);
      });
    }

    return [];
  }

  async connectToDevice(deviceId: string) {
    if (Platform.OS === 'ios') {
      this.startMockDataSimulation();

      return {
        id: deviceId,
        name: deviceId === 'demo1' ? 'Demo Soil Sensor' : 'SoilSensor Pro',
        batteryLevel: this.mockBatteryLevel,
        signalStrength: this.mockSignalStrength,
      };
    }

    return null;
  }

  async disconnect() {
    if (Platform.OS === 'ios') {
      if (this.mockDeviceTimer) {
        clearInterval(this.mockDeviceTimer);
        this.mockDeviceTimer = null;
      }
      return true;
    }

    return true;
  }

  onBatteryChange(callback: (level: number) => void) {
    this.batteryCallback = callback;
  }

  onSignalChange(callback: (level: number) => void) {
    this.signalCallback = callback;
  }

  private startMockDataSimulation() {
    this.mockDeviceTimer = setInterval(() => {
      this.mockBatteryLevel = Math.max(0, this.mockBatteryLevel - 0.1);
      const fluctuation = Math.random() * 5 - 2.5;
      this.mockSignalStrength = Math.min(100, Math.max(0, this.mockSignalStrength + fluctuation));

      if (this.batteryCallback) {
        this.batteryCallback(Math.round(this.mockBatteryLevel));
      }

      if (this.signalCallback) {
        this.signalCallback(Math.round(this.mockSignalStrength));
      }
    }, 5000);
  }
}

export const deviceManager = new DeviceManager();
