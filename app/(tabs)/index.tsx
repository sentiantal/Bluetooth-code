import React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import useBluetooth from "@/hooks/useBluetooth"
import { type Device, BleManager } from "react-native-ble-plx"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useSoilData } from "@/context/SoilDataContext"
import { useRouter } from "expo-router"
import { TranslatedText } from "@/components/TranslatedText"
import { useTranslatedText } from "@/hooks/useTranslatedText"

// Initialize BleManager only if we're not on web platform
const bleManager = Platform.OS !== "web" ? new BleManager() : null

const HomeScreen: React.FC = () => {
  const { devices, isScanning, error, startScan, stopScan, connectToDevice, handleDevicePress } = useBluetooth()
  const { soilData } = useSoilData()
  const [spinAnim] = useState(new Animated.Value(0))
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null)
  const [deviceLoading, setDeviceLoading] = useState<boolean>(false)
  const [deviceError, setDeviceError] = useState<string | null>(null)
  const router = useRouter()
  const convertKgHaToMgSample = (kgHa: number): string => {
    const mgSample = kgHa * 0.064;
    return `${mgSample.toFixed(2)} mg/sample`;
  };


  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start()
    } else {
      spinAnim.setValue(0)
    }
  }, [isScanning, spinAnim])

  useEffect(() => {
    if (error) {
      Alert.alert("Bluetooth Error", error)
    }
  }, [error])

  // Debug: Log soilData changes
  useEffect(() => {
    //console.log("🧪 soilData in HomeScreen:", soilData)
  }, [soilData])

  const handleConnect = async (device: Device) => {
    try {
      setDeviceLoading(true)
      setDeviceError(null)

      if (!bleManager) {
        setDeviceError("Bluetooth functionality is not available on this platform.")
        setDeviceLoading(false)
        return
      }

      // Use the connectToDevice from useBluetooth hook
      const connectedDeviceResult = await connectToDevice(device.id)

      if (connectedDeviceResult) {
        // Additional connection setup if needed
        await connectedDeviceResult.discoverAllServicesAndCharacteristics()
        setConnectedDevice(connectedDeviceResult)

        // Simulate soil data generation after connection (remove this in production)
        // This is just for testing - your actual soil data should come from the device
        setTimeout(() => {
          console.log("🌱 Simulating soil data after connection...")
        }, 2000)
      }
    } catch (err: any) {
      const errorMessage = err?.message || String(err)
      setDeviceError(`Failed to connect: ${errorMessage}`)
      console.error("❌ Error:", errorMessage)
      Alert.alert("Connection Error", "Failed to connect to device.")
    } finally {
      setDeviceLoading(false)
    }
  }

  const handleDisconnect = async () => {
    if (connectedDevice && bleManager) {
      try {
        await bleManager.cancelDeviceConnection(connectedDevice.id)
        setConnectedDevice(null)
        setDeviceError(null)
      } catch (err) {
        console.error("⚠️ Disconnect error:", err)
      }
    }
  }

  const getDisplayName = (device: Device) => {
    return device.name || device.localName || `Device_${device.id.slice(-8).replace(/:/g, "")}`
  }

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  // If device is connected, show device details
  if (connectedDevice) {
    return (
      <ScrollView contentContainerStyle={styles.deviceDetailsContainer}>
        <View style={styles.deviceDetailsHeader}>
          <Text style={styles.deviceDetailsTitle}><TranslatedText text="Device Connected" /></Text>
          <TouchableOpacity onPress={handleDisconnect} style={styles.disconnectButton}>
            <Text style={styles.disconnectButtonText}><TranslatedText text="Disconnect" /></Text>
          </TouchableOpacity>
        </View>

        {deviceLoading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : deviceError ? (
          <Text style={styles.errorText}><TranslatedText text={deviceError} /></Text>
        ) : (
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceText}><TranslatedText text="Connected to: " /><TranslatedText text={connectedDevice.name || "Unknown Device"} /></Text>
          </View>
        )}

        {/*
        <Text style={styles.subtitle}><TranslatedText text="Soil Predictions" /></Text>

         //Debug info
        <Text style={styles.debugText}><TranslatedText text="Soil Data Length: " />{soilData.length}</Text>
        */}

        {soilData.length === 0 ? (
          <View style={styles.waitingContainer}>
            <ActivityIndicator size="small" color="#4CAF50" style={styles.waitingSpinner} />
            <Text style={styles.deviceText}><TranslatedText text="Waiting for predictions..." /></Text>
          </View>
        ) : (
          soilData.map((item, index) => {
            const isMacro = item.label.includes("Nitrogen") || item.label.includes("Phosphorus") || item.label.includes("Potassium");

            return (
              <View key={index} style={styles.resultCard}>
                <Text style={styles.label}><TranslatedText text={item.label} /></Text>

                <Text style={styles.value}>
                  {isMacro && (
                    <>
                      {`${(Number(item.value) * 0.064).toFixed(2)} `}
                      <TranslatedText text="mg/sample" />
                      {"\n"}
                    </>
                  )}
                  {item.value} <TranslatedText text={item.unit} />
                </Text>

{/* 
                <Text style={styles.range}>
                  <TranslatedText text="Recommended: " />
                  {"\n"}
                  {isMacro && (
                    <>
                      {convertKgHaToMgSample(Number(item.goodRangeMin)).split(" ")[0]} – {convertKgHaToMgSample(Number(item.goodRangeMax)).split(" ")[0]}{" "}
                      <TranslatedText text="mg/sample" />
                      {"\n"}
                    </>
                  )}
                  {item.goodRangeMin} – {item.goodRangeMax} <TranslatedText text="kg/ha" />
                </Text>
                */
}
              </View>
            );
          })
        )}
      </ScrollView>
    )
  }

  // Default home screen when no device is connected
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/farm-background.jpg")}
        style={styles.header}
        resizeMode="cover"
        onError={(e) => console.error("Image load error:", e.nativeEvent.error)}
      >
        <Text style={styles.title}><TranslatedText text="Welcome to Agrow" /></Text>
        <Text style={styles.subtitle}><TranslatedText text="Comprehensive soil analysis for better farming" /></Text>
      </ImageBackground>

      <View style={styles.content}>
        {error && <Text style={styles.errorText}><TranslatedText text={error} /></Text>}

        <View style={styles.deviceSection}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="bluetooth" size={24} color="#333" style={styles.icon} />
            <Text style={styles.sectionTitle}><TranslatedText text="Bluetooth Devices" /></Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={startScan}
              style={[styles.scanButton, isScanning && styles.disabledButton]}
              disabled={isScanning}
            >
              <Text style={styles.buttonText}><TranslatedText text="Start Scan" /></Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={stopScan}
              style={[styles.scanButton, !isScanning && styles.disabledButton]}
              disabled={!isScanning}
            >
              <Text style={styles.buttonText}><TranslatedText text="Stop Scan" /></Text>
            </TouchableOpacity>
          </View>

          {isScanning ? (
            <View style={styles.scannerContainer}>
              <Animated.View style={[styles.scanner, { transform: [{ rotate: spin }] }]}>
                <MaterialCommunityIcons name="radar" size={40} color="#4CAF50" />
              </Animated.View>
              <Text style={styles.scanningText}><TranslatedText text="Scanning..." /></Text>
            </View>
          ) : devices.length > 0 ? (
            <FlatList
              data={devices}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleConnect(item)} style={styles.deviceItem}>
                  <Text style={styles.deviceText}><TranslatedText text={getDisplayName(item)} /></Text>
                  <MaterialCommunityIcons name="bluetooth-connect" size={20} color="#4CAF50" />
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.deviceText}><TranslatedText text="No devices found. Tap Start Scan to search." /></Text>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  deviceSection: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  scanButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  scannerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  scanner: {
    marginBottom: 10,
  },
  scanningText: {
    fontSize: 16,
    color: "#4CAF50",
  },
  deviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  deviceText: {
    fontSize: 16,
    marginVertical: 5,
    color: "#333",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  // Device Details Styles
  deviceDetailsContainer: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    paddingTop: 10,
  },
  deviceDetailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  deviceDetailsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  disconnectButton: {
    backgroundColor: "#f44336",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  disconnectButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  deviceInfo: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  deviceId: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  waitingContainer: {
    alignItems: "center",
    padding: 20,
  },
  waitingSpinner: {
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginBottom: 10,
  },
  resultCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#4CAF50",
    marginTop: 5,
  },
  range: {
    fontSize: 14,
    color: "#888",
    marginTop: 3,
  },
  testButton: {
    backgroundColor: "#FF9800",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  testButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
})

export default HomeScreen
