import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { FileText, Share2, Cloud, Download, Calendar, ChartBar as BarChart, Trash2 } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function ReportsScreen() {
  const [reports, setReports] = useState([
    {
      id: '1',
      name: 'North Field Analysis',
      date: 'Jun 15, 2025',
      size: '1.2 MB',
    },
    {
      id: '2',
      name: 'South Field - Before Treatment',
      date: 'May 28, 2025',
      size: '1.5 MB',
    },
    {
      id: '3',
      name: 'West Field - Post Fertilizer',
      date: 'May 10, 2025',
      size: '1.3 MB',
    },
  ]);
  
  const handleDownload = (report) => {
    // In a real app, this would trigger the actual download
    Alert.alert('Download Started', `Downloading "${report.name}" report.`);
  };
  
  const handleShare = (report) => {
    // In a real app, this would open the share dialog
    Alert.alert('Share', `Sharing "${report.name}" report.`);
  };
  
  const handleDelete = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this report?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            setReports(reports.filter(report => report.id !== id));
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleCloudSync = () => {
    // In a real app, this would trigger cloud synchronization
    Alert.alert('Cloud Sync', 'Syncing your reports with the cloud.');
  };
  
  const handleGenerateNewReport = () => {
    // In a real app, this would generate a new report
    Alert.alert('Generate Report', 'Would initiate the report generation process.');
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Soil Analysis Reports</Text>
        <Text style={styles.subtitle}>
          View, download, and share your soil analysis reports
        </Text>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleGenerateNewReport}
        >
          <FileText size={22} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Generate Report</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.syncButton]}
          onPress={handleCloudSync}
        >
          <Cloud size={22} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Cloud Sync</Text>
        </TouchableOpacity>
      </View>
      
      {reports.length === 0 ? (
        <View style={styles.emptyState}>
          <FileText size={60} color="#BDBDBD" />
          <Text style={styles.emptyStateText}>No Reports Available</Text>
          <Text style={styles.emptyStateSubText}>
            Connect your device and generate a soil analysis report
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Your Reports</Text>
          {reports.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.reportIcon}>
                <FileText size={24} color="#4CAF50" />
              </View>
              <View style={styles.reportInfo}>
                <Text style={styles.reportName}>{report.name}</Text>
                <View style={styles.reportMeta}>
                  <View style={styles.metaItem}>
                    <Calendar size={14} color="#757575" />
                    <Text style={styles.metaText}>{report.date}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <BarChart size={14} color="#757575" />
                    <Text style={styles.metaText}>{report.size}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.reportActions}>
                <TouchableOpacity 
                  style={styles.reportAction}
                  onPress={() => handleDownload(report)}
                >
                  <Download size={20} color="#616161" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.reportAction}
                  onPress={() => handleShare(report)}
                >
                  <Share2 size={20} color="#616161" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.reportAction}
                  onPress={() => handleDelete(report.id)}
                >
                  <Trash2 size={20} color="#F44336" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </>
      )}
      
      <View style={styles.compareSection}>
        <Text style={styles.sectionTitle}>Compare Reports</Text>
        <TouchableOpacity style={styles.compareButton}>
          <Text style={styles.compareButtonText}>Select Reports to Compare</Text>
        </TouchableOpacity>
        
        <Text style={styles.helperText}>
          Compare multiple soil analyses to track changes over time
        </Text>
      </View>
      
      <View style={styles.exportSection}>
        <Text style={styles.sectionTitle}>Export Options</Text>
        <View style={styles.exportOptions}>
          <TouchableOpacity style={styles.exportOption}>
            <FileText size={20} color="#4CAF50" />
            <Text style={styles.exportOptionText}>PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportOption}>
            <FileText size={20} color="#2196F3" />
            <Text style={styles.exportOptionText}>CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportOption}>
            <FileText size={20} color="#FFC107" />
            <Text style={styles.exportOptionText}>Excel</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.storageInfo}>
        <Text style={styles.storageText}>Using 4.0 MB of 100 MB</Text>
        <View style={styles.storageBar}>
          <View style={styles.storageUsed} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  syncButton: {
    backgroundColor: '#2196F3',
    marginRight: 0,
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  reportCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reportIcon: {
    marginRight: 16,
    justifyContent: 'center',
  },
  reportInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  reportName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#424242',
    marginBottom: 4,
  },
  reportMeta: {
    flexDirection: 'row',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
  reportActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportAction: {
    padding: 8,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#757575',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
  },
  compareSection: {
    padding: 16,
    paddingTop: 8,
  },
  compareButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  compareButtonText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  helperText: {
    color: '#757575',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  exportSection: {
    padding: 16,
    paddingTop: 0,
  },
  exportOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  exportOption: {
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    width: '30%',
  },
  exportOptionText: {
    marginTop: 8,
    color: '#616161',
    fontWeight: '500',
  },
  storageInfo: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  storageText: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 8,
  },
  storageBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  storageUsed: {
    width: '4%', // Represents 4MB of 100MB
    height: 4,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
});