"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native"
import {
  Download,
} from "lucide-react-native"
import * as Print from "expo-print"
import * as FileSystem from "expo-file-system"
import * as Asset from "expo-asset"
import { useSoilData } from "../../context/SoilDataContext"
import { TranslatedText } from "@/components/TranslatedText"

const { width } = Dimensions.get("window")

interface Report {
  id: string
  title: string
  date: string
  status: string
  summary: string
  size: string
  type: "comprehensive" | "nutrients" | "moisture" | "microbial"
}

export default function ReportsScreen() {
  const { soilData, bleInput } = useSoilData()
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const getBase64Logo = async () => {
    const asset = Asset.Asset.fromModule(require("@/assets/images/logo.jpg"))
    await asset.downloadAsync()
    const fileUri = asset.localUri || asset.uri
    const base64 = await FileSystem.readAsStringAsync(fileUri!, {
      encoding: FileSystem.EncodingType.Base64,
    })
    return `data:image/jpeg;base64,${base64}`
  }

  const generateHTMLReport = (logoBase64: string) => {
    const currentDate = new Date().toLocaleDateString()
    let bleDataHTML = ""

    let soilDataHTML = ""
    soilData.forEach((item) => {
      const valueKgHa = Number.parseFloat(item.value)
      const valueMgSample = (valueKgHa * 0.064).toFixed(2)
      const isInRange = valueKgHa >= item.goodRangeMin && valueKgHa <= item.goodRangeMax
      const status = isInRange ? "Good" : "Needs Attention"
      const statusColor = isInRange ? "#4CAF50" : "#F44336"

      const showDualUnit = ["Total Nitrogen (N)", "Phosphorus Content", "Potassium Content"].includes(item.label)

      const valueHTML = showDualUnit
        ? `${valueMgSample} mg/sample<br/><span style="font-size: 11px; color: #555;">(${item.value} ${item.unit})</span>`
        : `${item.value} ${item.unit}`

      const rangeHTML = showDualUnit
        ? `${(item.goodRangeMin * 0.064).toFixed(2)} - ${(item.goodRangeMax * 0.064).toFixed(2)} mg/sample<br/><span style="font-size: 11px; color: #555;">(${item.goodRangeMin} - ${item.goodRangeMax} ${item.unit})</span>`
        : `${item.goodRangeMin} - ${item.goodRangeMax} ${item.unit}`

      soilDataHTML += `
    <tr>
      <td style="padding: 4px; border: 1px solid #ccc;">${item.label}</td>
      <td style="padding: 4px; border: 1px solid #ccc;">${valueHTML}</td>
      <td style="padding: 4px; border: 1px solid #ccc;">${rangeHTML}</td>
      <td style="padding: 4px; border: 1px solid #ccc; color: ${statusColor}; font-weight: bold;">${status}</td>
    </tr>
  `
    })

    return `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Soil Analysis Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              font-size: 12px;
              margin: 0;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
            }
            .logo {
              height: 40px;
            }
            .title {
              flex: 1;
              text-align: center;
              font-size: 20px;
              font-weight: bold;
              color: #1976D2;
              margin: 0;
            }
            h3 {
              margin-top: 10px;
              font-size: 14px;
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              font-size: 12px;
            }
            th {
              background-color: #1976D2;
              color: white;
              padding: 6px;
              border: 1px solid #ccc;
              text-align: left;
            }
            td {
              padding: 4px;
              border: 1px solid #ccc;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logoBase64}" alt="Logo" class="logo" />
            <h1 class="title">Soil Analysis Report</h1>
            <div style="width: 70px;"></div>
          </div>

          <p style="text-align:center;">Generated on: ${currentDate}</p>

          <h3>Soil Parameters</h3>
          <table>
            <tr>
              <th>Parameter</th>
              <th>Value</th>
              <th>Optimal Range</th>
              <th>Status</th>
            </tr>
            ${soilDataHTML}
          </table>

          ${bleInput.length > 0 ? bleDataHTML : ""}
        </body>
      </html>
    `
  }

  const printReport = async () => {
    if (soilData.length === 0) {
      Alert.alert("No Data", "No soil data available to print")
      return
    }

    try {
      const base64Logo = await getBase64Logo()
      const htmlContent = generateHTMLReport(base64Logo)
      await Print.printAsync({
        html: htmlContent,
      })
    } catch (error) {
      console.error("Error printing:", error)
      Alert.alert("Error", "Failed to print report")
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}><TranslatedText text="Soil Reports" /></Text>
        <Text style={styles.headerSubtitle}><TranslatedText text="Analysis and recommendations" /></Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {soilData.length > 0 && (
          <TouchableOpacity
            style={styles.generateButton}
            onPress={printReport}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Download size={16} color="white" />
                <Text style={styles.generateButtonText}><TranslatedText text="Download PDF" /></Text>
              </>
            )}
          </TouchableOpacity>
        )}
        {soilData.length === 0 && (
          <Text style={styles.noDataText}><TranslatedText text="No soil data available. Please collect data first." /></Text>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#424242",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  generateButton: {
    backgroundColor: "#1976D2",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  noDataText: {
    fontSize: 12,
    color: "#757575",
    textAlign: "center",
    marginTop: 16,
  },
})
