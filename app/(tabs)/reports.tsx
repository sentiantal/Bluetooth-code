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
  FileText,
  Download,
  ChevronRight,
  Filter,
  Share2,
  Printer,
  Calendar,
  FileBarChart,
  AlertTriangle,
  CheckCircle,
} from "lucide-react-native"
import * as Print from "expo-print"
import * as Sharing from "expo-sharing"
import * as FileSystem from "expo-file-system"
import { useSoilData } from "../../context/SoilDataContext"

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

const mockReports: Report[] = [
  {
    id: "1",
    title: "Comprehensive Soil Analysis",
    date: "2023-05-07",
    status: "complete",
    summary: "Full soil health evaluation with nutrient analysis and recommendations",
    size: "2.4 MB",
    type: "comprehensive",
  },
  {
    id: "2",
    title: "Monthly Moisture Trends",
    date: "2023-05-01",
    status: "complete",
    summary: "Analysis of soil moisture levels for the past 30 days",
    size: "1.2 MB",
    type: "moisture",
  },
  {
    id: "3",
    title: "Nutrient Deficiency Report",
    date: "2023-04-15",
    status: "complete",
    summary: "Detailed analysis of nutrient deficiencies and correction strategies",
    size: "1.8 MB",
    type: "nutrients",
  },
]

export default function ReportsScreen() {
  const { soilData, bleInput } = useSoilData()
  const [activeFilter, setActiveFilter] = useState("all")
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const filters = [
    { id: "all", name: "All Reports" },
    { id: "recent", name: "Recent" },
    { id: "nutrients", name: "Nutrients" },
    { id: "moisture", name: "Moisture" },
  ]

  const filteredReports = () => {
    if (activeFilter === "all") return mockReports
    if (activeFilter === "recent") return mockReports.slice(0, 2)
    if (activeFilter === "nutrients") return mockReports.filter((r) => r.type === "nutrients")
    if (activeFilter === "moisture") return mockReports.filter((r) => r.type === "moisture")
    return mockReports
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const generateRecommendations = () => {
    const recommendations: string[] = []

    soilData.forEach((item) => {
      const value = Number.parseFloat(item.value)
      const isInRange = value >= item.goodRangeMin && value <= item.goodRangeMax

      if (!isInRange) {
        if (value < item.goodRangeMin) {
          recommendations.push(
            `${item.label} is below optimal range. Consider adding appropriate amendments to increase levels.`,
          )
        } else {
          recommendations.push(`${item.label} is above optimal range. Consider reducing inputs or improving drainage.`)
        }
      }
    })

    if (recommendations.length === 0) {
      recommendations.push("All soil parameters are within optimal ranges. Continue current management practices.")
    }

    return recommendations
  }

  const generateHTMLReport = () => {
    const currentDate = new Date().toLocaleDateString()
    const recommendations = generateRecommendations()

    let soilDataHTML = ""
    soilData.forEach((item) => {
      const value = Number.parseFloat(item.value)
      const isInRange = value >= item.goodRangeMin && value <= item.goodRangeMax
      const status = isInRange ? "Good" : "Needs Attention"
      const statusColor = isInRange ? "#4CAF50" : "#F44336"

      soilDataHTML += `
        <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <strong>${item.label}:</strong>
            <span style="background-color: ${statusColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
              ${status}
            </span>
          </div>
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">
            ${item.value} ${item.unit}
          </div>
          <div style="font-size: 12px; color: #666;">
            Optimal Range: ${item.goodRangeMin} - ${item.goodRangeMax} ${item.unit}
          </div>
        </div>
      `
    })

    let bleDataHTML = ""
    if (bleInput.length > 0) {
      bleDataHTML = `
        <h2 style="color: #333; border-bottom: 2px solid #1976D2; padding-bottom: 5px;">Sensor Readings</h2>
        ${bleInput
          .map(
            (value, index) => `
          <div style="margin-bottom: 8px;">
            <strong>Sensor ${index + 1}:</strong> ${value}
          </div>
        `,
          )
          .join("")}
      `
    }

    let recommendationsHTML = ""
    if (recommendations.length > 0) {
      recommendationsHTML = `
        <h2 style="color: #333; border-bottom: 2px solid #1976D2; padding-bottom: 5px;">Recommendations</h2>
        <ul style="padding-left: 20px;">
          ${recommendations.map((rec) => `<li style="margin-bottom: 8px;">${rec}</li>`).join("")}
        </ul>
      `
    }

    return `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Soil Analysis Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            h1 { color: #1976D2; }
            h2 { color: #333; border-bottom: 2px solid #1976D2; padding-bottom: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Soil Analysis Report</h1>
            <p>Generated on: ${currentDate}</p>
          </div>
          
          <div class="section">
            <h2>Soil Parameters</h2>
            ${soilDataHTML}
          </div>
          
          ${bleInput.length > 0 ? `<div class="section">${bleDataHTML}</div>` : ""}
          
          <div class="section">
            ${recommendationsHTML}
          </div>
        </body>
      </html>
    `
  }

  const generateSoilDataPDF = async () => {
    if (soilData.length === 0) {
      Alert.alert("No Data", "No soil data available to generate report")
      return
    }

    setIsGeneratingPDF(true)

    try {
      const htmlContent = generateHTMLReport()

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      })

      const fileName = `soil-analysis-report-${new Date().toISOString().split("T")[0]}.pdf`
      const newUri = `${FileSystem.documentDirectory}${fileName}`

      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      })

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newUri, {
          mimeType: "application/pdf",
          dialogTitle: "Share Soil Analysis Report",
        })
      } else {
        Alert.alert("Success", `Report saved to: ${newUri}`)
      }
    } catch (error) {
      console.error("Error generating PDF:", error)
      Alert.alert("Error", "Failed to generate PDF report")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const shareReport = async (report: Report) => {
    const shareContent = {
      message: `${report.title}\n\n${report.summary}\n\nGenerated from Soil Analysis App`,
    }

    if (await Sharing.isAvailableAsync()) {
      try {
        await Sharing.shareAsync("", shareContent)
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      Alert.alert("Sharing not available", "Sharing is not available on this device")
    }
  }

  const printReport = async () => {
    if (soilData.length === 0) {
      Alert.alert("No Data", "No soil data available to print")
      return
    }

    try {
      const htmlContent = generateHTMLReport()
      await Print.printAsync({
        html: htmlContent,
      })
    } catch (error) {
      console.error("Error printing:", error)
      Alert.alert("Error", "Failed to print report")
    }
  }

  const renderSoilDataSummary = () => {
    if (soilData.length === 0) return null

    return (
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <FileBarChart size={20} color="#1976D2" />
          <Text style={styles.summaryTitle}>Current Soil Data Summary</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.summaryScroll}>
          {soilData.slice(0, 6).map((item, index) => {
            const value = Number.parseFloat(item.value)
            const isInRange = value >= item.goodRangeMin && value <= item.goodRangeMax

            return (
              <View key={index} style={styles.summaryItem}>
                <View style={styles.summaryItemHeader}>
                  <Text style={styles.summaryItemLabel}>{item.label}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: isInRange ? "#4CAF50" : "#F44336" }]}>
                    {isInRange ? <CheckCircle size={12} color="white" /> : <AlertTriangle size={12} color="white" />}
                  </View>
                </View>
                <Text style={styles.summaryItemValue}>
                  {item.value} {item.unit}
                </Text>
                <Text style={styles.summaryItemRange}>
                  Range: {item.goodRangeMin} - {item.goodRangeMax} {item.unit}
                </Text>
              </View>
            )
          })}
        </ScrollView>

        <View style={styles.summaryActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={generateSoilDataPDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? <ActivityIndicator size="small" color="white" /> : <Download size={16} color="white" />}
            <Text style={styles.primaryButtonText}>{isGeneratingPDF ? "Generating..." : "Generate PDF"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={printReport}>
            <Printer size={16} color="#1976D2" />
            <Text style={styles.secondaryButtonText}>Print</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderReportItem = ({ item }: { item: Report }) => (
    <TouchableOpacity style={styles.reportCard}>
      <View style={styles.reportIconContainer}>
        <FileText size={24} color="#1976D2" />
      </View>
      <View style={styles.reportContent}>
        <View style={styles.reportHeader}>
          <Text style={styles.reportTitle}>{item.title}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.reportDateContainer}>
          <Calendar size={14} color="#757575" />
          <Text style={styles.reportDate}>{formatDate(item.date)}</Text>
        </View>
        <Text style={styles.reportSummary}>{item.summary}</Text>
        <View style={styles.reportFooter}>
          <Text style={styles.reportSize}>{item.size}</Text>
          <View style={styles.reportActions}>
            <TouchableOpacity style={styles.downloadButton}>
              <Download size={14} color="#1976D2" />
              <Text style={styles.downloadText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={() => shareReport(item)}>
              <Share2 size={14} color="#1976D2" />
              <Text style={styles.shareText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Soil Reports</Text>
        <Text style={styles.headerSubtitle}>Analysis and recommendations</Text>
      </View>

      {/* Filter Section */}
      

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Soil Data Summary */}
        {renderSoilDataSummary()}

        {/* Reports List */}
        
      </ScrollView>

      {/* Generate New Report Button */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.generateButton, soilData.length === 0 && styles.generateButtonDisabled]}
          onPress={generateSoilDataPDF}
          disabled={soilData.length === 0 || isGeneratingPDF}
        >
          {isGeneratingPDF ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.generateButtonText}>Generate New Report</Text>
          )}
          <ChevronRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
        {soilData.length === 0 && (
          <Text style={styles.noDataText}>No soil data available. Please collect data first.</Text>
        )}
      </View>
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
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  filterHeaderText: {
    fontSize: 14,
    color: "#616161",
    marginLeft: 8,
  },
  filterContainer: {
    paddingRight: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: "#E3F2FD",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#616161",
  },
  activeFilterText: {
    color: "#1976D2",
    fontWeight: "600",
  },
  scrollContainer: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#424242",
    marginLeft: 8,
  },
  summaryScroll: {
    marginBottom: 16,
  },
  summaryItem: {
    width: 160,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginRight: 12,
  },
  summaryItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryItemLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#424242",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  summaryItemValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#424242",
    marginBottom: 4,
  },
  summaryItemRange: {
    fontSize: 10,
    color: "#757575",
  },
  summaryActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: "#1976D2",
  },
  secondaryButton: {
    backgroundColor: "#E3F2FD",
    borderWidth: 1,
    borderColor: "#1976D2",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#1976D2",
    fontWeight: "600",
  },
  reportsContainer: {
    padding: 16,
  },
  reportCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reportIconContainer: {
    width: 64,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  reportContent: {
    flex: 1,
    padding: 16,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#424242",
    flex: 1,
    marginRight: 8,
  },
  statusText: {
    fontSize: 10,
    color: "#757575",
    textTransform: "uppercase",
  },
  reportDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  reportDate: {
    fontSize: 12,
    color: "#757575",
    marginLeft: 4,
  },
  reportSummary: {
    fontSize: 14,
    color: "#616161",
    marginBottom: 12,
    lineHeight: 20,
  },
  reportFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reportSize: {
    fontSize: 12,
    color: "#757575",
  },
  reportActions: {
    flexDirection: "row",
    gap: 8,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
  },
  downloadText: {
    fontSize: 12,
    color: "#1976D2",
    marginLeft: 4,
    fontWeight: "500",
  },
  shareText: {
    fontSize: 12,
    color: "#1976D2",
    marginLeft: 4,
    fontWeight: "500",
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#757575",
    marginTop: 16,
  },
  actionContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  generateButton: {
    backgroundColor: "#1976D2",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  generateButtonDisabled: {
    backgroundColor: "#BDBDBD",
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  noDataText: {
    fontSize: 12,
    color: "#757575",
    textAlign: "center",
    marginTop: 8,
  },
})
