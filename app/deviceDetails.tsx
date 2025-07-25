"use client"

import React from "react"
import { useEffect, useState, useCallback } from "react"
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Platform, TouchableOpacity } from "react-native"
import { BleManager, type Device } from "react-native-ble-plx"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useSoilData } from "@/context/SoilDataContext"
import { TranslatedText } from "@/components/TranslatedText"

// Initialize BleManager only if we're not on web platform
const bleManager = Platform.OS !== "web" ? new BleManager() : null

const DeviceDetails: React.FC = () => {
  const { deviceId } = useLocalSearchParams()
  const router = useRouter()
  const safeDeviceId = typeof deviceId === "string" ? deviceId : ""
  const [device, setDevice] = useState<Device | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const { soilData } = useSoilData() // ✅ soil predictions from context

  const connectAndFetchDeviceData = useCallback(async () => {
    if (!safeDeviceId) {
      setError("No device ID provided.")
      setLoading(false)
      return
    }

    // Check if BLE is available (not on web)
    if (!bleManager) {
      setError("Bluetooth functionality is not available on this platform.")
      setLoading(false)
      return
    }

    try {
      const isConnected = await bleManager.isDeviceConnected(safeDeviceId)
      let connectedDevice: Device

      if (!isConnected) {
        connectedDevice = await bleManager.connectToDevice(safeDeviceId)
      } else {
        const devices = await bleManager.devices([safeDeviceId])
        connectedDevice = devices[0]
        if (!connectedDevice) throw new Error("Device not found.")
      }

      await connectedDevice.discoverAllServicesAndCharacteristics()
      setDevice(connectedDevice)
    } catch (err: any) {
      const errorMessage = err?.message || String(err)
      setError(`Failed to connect: ${errorMessage}`)
      console.error("❌ Error:", errorMessage)
    } finally {
      setLoading(false)
    }
  }, [safeDeviceId])

  useEffect(() => {
    console.log("🧪 soilData received in DeviceDetails:", soilData) // ✅ Print here
  }, [soilData])

  useEffect(() => {
    connectAndFetchDeviceData()

    return () => {
      if (device && bleManager) {
        bleManager.cancelDeviceConnection(device.id).catch((err) => {
          console.error("⚠️ Disconnect error:", err)
        })
      }
    }
  }, [connectAndFetchDeviceData])

  const handleGoBack = () => {
    router.back()
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Text style={styles.backArrow}>{"<"}</Text>
      </TouchableOpacity>

      <Text style={styles.title}><TranslatedText text="Device Details"/></Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : error ? (
        <Text style={styles.errorText}><TranslatedText text="{error}"/></Text>
      ) : device ? (
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceText}>Connected to: {device.name || "Unknown Device"}</Text>
        </View>
      ) : (
        <Text style={styles.errorText}><TranslatedText text="No device data available."/></Text>
      )}

      <Text style={styles.subtitle}><TranslatedText text="Soil Predictions"/></Text>

      {soilData.length === 0 ? (
        <Text style={styles.deviceText}><TranslatedText text="Waiting for predictions..."/></Text>
      ) : (
        soilData.map((item, index) => (
          <View key={index} style={styles.resultCard}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>
              {item.value} {item.unit}
            </Text>
            <Text style={styles.range}>
              Recommended: {item.goodRangeMin} – {item.goodRangeMax}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    paddingTop: 60,
  },
  backButton: {
    position: "absolute",
    top: 40, // moved slightly downward
    left: 15,
    zIndex: 10,
    padding: 10,
  },
  backArrow: {
    fontSize: 30,
    color: "#000000",
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 25,
    marginBottom: 10,
    color: "#4CAF50",
    textAlign: "center",
  },
  deviceInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  deviceText: {
    fontSize: 16,
    marginVertical: 3,
    color: "#333",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginVertical: 10,
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
  },
  range: {
    fontSize: 14,
    color: "#888",
  },
})

export default DeviceDetails
