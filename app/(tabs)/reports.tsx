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
import { Download } from "lucide-react-native"
import * as Print from "expo-print"
import * as FileSystem from "expo-file-system"
import * as Asset from "expo-asset"
import { useSoilData } from "../../context/SoilDataContext"
import { useLanguage } from "@/context/LanguageContext"
import { translateText } from "@/services/translateService"
import { TranslatedText } from "@/components/TranslatedText"
import logoAsset from "@/assets/images/logo.jpg";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import React from "react"

const { width } = Dimensions.get("window")

export default function ReportsScreen() {
  const { soilData, bleInput } = useSoilData()
  const { language } = useLanguage()
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

 const getBase64Logo = async (): Promise<string> => {
  const asset = Asset.Asset.fromModule(logoAsset);
  await asset.downloadAsync();

  let fileUri = asset.localUri ?? asset.uri;

  if (!fileUri.startsWith("file://")) {
    const tempPath = FileSystem.cacheDirectory + "logo.jpg";
    await FileSystem.copyAsync({ from: fileUri, to: tempPath });
    fileUri = tempPath;
  }

  const base64 = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return `data:image/jpeg;base64,${base64}`;
};

  const generateHTMLReport = async (logoBase64: string) => {
    const currentDate = new Date().toLocaleDateString()

    // Translate headers
    const title = await translateText("Soil Analysis Report", language)
    const generatedOn = await translateText("Generated on", language)
    const heading = await translateText("Soil Parameters", language)
    const paramText = await translateText("Parameter", language)
    const valueText = await translateText("Value", language)
    const optimalRangeText = await translateText("Optimal Range", language)
    const statusText = await translateText("Status", language)
    const goodStatus = await translateText("Is Sufficient", language)
    const needsAttentionStatus = await translateText("Needs Attention", language)

    let soilDataHTML = ""

    for (const item of soilData) {
      const translatedLabel = await translateText(item.label, language)

      const valueKgHa = Number.parseFloat(item.value)
      const valueMgSample = (valueKgHa * 0.064).toFixed(2)
      const isInRange = valueKgHa >= item.goodRangeMin && valueKgHa <= item.goodRangeMax
      const status = isInRange ? goodStatus : needsAttentionStatus
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
        <td style="padding: 4px; border: 1px solid #ccc;">${translatedLabel}</td>
        <td style="padding: 4px; border: 1px solid #ccc;">${valueHTML}</td>
        <td style="padding: 4px; border: 1px solid #ccc;">${rangeHTML}</td>
        <td style="padding: 4px; border: 1px solid #ccc; color: ${statusColor}; font-weight: bold;">${status}</td>
      </tr>
    `
    }

    return `
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
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
          <h1 class="title">${title}</h1>
          <div style="width: 70px;"></div>
        </div>

        <p style="text-align:center;">${generatedOn}: ${currentDate}</p>

        <h3>${heading}</h3>
        <table>
          <tr>
            <th>${paramText}</th>
            <th>${valueText}</th>
            <th>${optimalRangeText}</th>
            <th>${statusText}</th>
          </tr>
          ${soilDataHTML}
        </table>
      </body>
    </html>
  `
  }
  const sharePDFReport = async () => {
  if (soilData.length === 0) {
    Alert.alert("No Data", "No soil data available to share");
    return;
  }

  try {
    setIsGeneratingPDF(true);

    const base64Logo = await getBase64Logo();
    const htmlContent = await generateHTMLReport(base64Logo);

    // Generate a local PDF file
    const { uri } = await Print.printToFileAsync({ html: htmlContent });


    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("Not Supported", "Sharing is not available on this device");
      return;
    }

    await Sharing.shareAsync(uri);
  } catch (error) {
    console.error("Error sharing PDF:", error);
    Alert.alert("Error", "Failed to share report");
  } finally {
    setIsGeneratingPDF(false);
  }
};

  const printReport = async () => {
    if (soilData.length === 0) {
      Alert.alert("No Data", "No soil data available to print")
      return
    }

    try {
      setIsGeneratingPDF(true)
      const base64Logo = await getBase64Logo()
      const htmlContent = await generateHTMLReport(base64Logo)
      await Print.printAsync({ html: htmlContent })
    } catch (error) {
      console.error("Error printing:", error)
      Alert.alert("Error", "Failed to print report")
    } finally {
      setIsGeneratingPDF(false)
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
          <>
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
          <TouchableOpacity
  style={[styles.generateButton, { marginTop: 12, backgroundColor: "#2E7D32" }]}
  onPress={sharePDFReport}
  disabled={isGeneratingPDF}
>
  {isGeneratingPDF ? (
    <ActivityIndicator size="small" color="white" />
  ) : (
    <>
      <Download size={16} color="white" />
      <Text style={styles.generateButtonText}><TranslatedText text="Share PDF" /></Text>
    </>
  )}
</TouchableOpacity>

          </>
          
          
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