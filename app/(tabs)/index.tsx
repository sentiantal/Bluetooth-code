import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Link } from 'expo-router';
import { Activity, Plug, Battery, Wifi, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, ArrowRight } from 'lucide-react-native';
import { mockSoilData } from '@/data/mockData';
import SummaryCard from '@/components/SummaryCard';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(78);
  const [signalStrength, setSignalStrength] = useState(65);
  
  const handleConnect = () => {
    setIsConnected(true);
  };
  
  const handleDisconnect = () => {
    setIsConnected(false);
  };

  const getAnalysisScore = () => {
    return 75;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg' }}
          style={styles.headerImage}
        />
        <View style={styles.headerOverlay}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.headerTitle}>Soil Report</Text>
          <Text style={styles.headerSubtitle}>Comprehensive soil analysis for better farming</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.deviceSection}>
          <View style={[styles.deviceCard, isConnected ? styles.connected : styles.disconnected]}>
            {isConnected ? (
              <>
                <View style={styles.deviceHeader}>
                  <View style={styles.deviceStatus}>
                    <Activity size={24} color="#2E7D32" />
                    <Text style={styles.deviceStatusText}>Sensor Connected</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.disconnectButton}
                    onPress={handleDisconnect}
                  >
                    <Text style={styles.disconnectText}>Disconnect</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.deviceStats}>
                  <View style={styles.statItem}>
                    <Battery size={20} color="#2E7D32" />
                    <View style={styles.statContent}>
                      <Text style={styles.statLabel}>Battery</Text>
                      <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, { width: `${batteryLevel}%`, backgroundColor: batteryLevel > 20 ? '#2E7D32' : '#D32F2F' }]} />
                        <Text style={styles.progressText}>{batteryLevel}%</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.statItem}>
                    <Wifi size={20} color="#1976D2" />
                    <View style={styles.statContent}>
                      <Text style={styles.statLabel}>Signal</Text>
                      <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, { width: `${signalStrength}%`, backgroundColor: '#1976D2' }]} />
                        <Text style={styles.progressText}>{signalStrength}%</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.connectContainer}>
                <View style={styles.connectIcon}>
                  <Plug size={32} color="#2E7D32" />
                </View>
                <Text style={styles.connectTitle}>Connect Soil Sensor</Text>
                <Text style={styles.connectSubtitle}>Get real-time soil analysis and recommendations</Text>
                <TouchableOpacity 
                  style={styles.connectButton}
                  onPress={handleConnect}
                >
                  <Text style={styles.connectButtonText}>Connect Now</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {isConnected && (
          <>
            <View style={styles.healthScoreSection}>
              <Text style={styles.sectionTitle}>Soil Health Overview</Text>
              <View style={styles.healthScoreCard}>
                <View style={styles.scoreCircle}>
                  <Text style={styles.scoreNumber}>{getAnalysisScore()}</Text>
                  <Text style={styles.scoreLabel}>Health Score</Text>
                </View>
                <View style={styles.scoreDetails}>
                  <Text style={styles.scoreTitle}>Good Condition</Text>
                  <Text style={styles.scoreDescription}>Your soil is generally healthy with some areas for improvement</Text>
                </View>
              </View>
            </View>

            <View style={styles.summarySection}>
              <Text style={styles.sectionTitle}>Key Indicators</Text>
              <SummaryCard 
                title="Nutrients"
                status="moderate"
                value="7/13 optimal"
                icon="leaf"
                description="Essential nutrients for plant growth"
                details={[
                  "Nitrogen: 0.09%",
                  "Phosphorus: 16.24 ppm",
                  "Potassium: moderate"
                ]}
                onPress={() => router.push('/(tabs)/nutrients')}
              />
              <SummaryCard 
                title="Texture"
                status="good"
                value="Sandy Loam"
                icon="mountain"
                description="Soil composition and structure"
                details={[
                  "Clay: 17.12%",
                  "Sand: 48.52%",
                  "Good drainage"
                ]}
                onPress={() => router.push('/(tabs)/texture')}
              />
              <SummaryCard 
                title="Water"
                status="poor"
                value="Low"
                icon="droplets"
                description="Soil moisture and water retention"
                details={[
                  "Moisture: 27.51%",
                  "Optimal: 30-40%",
                  "Needs irrigation"
                ]}
                onPress={() => router.push('/(tabs)/water')}
              />
            </View>

            <View style={styles.alertsSection}>
              <Text style={styles.sectionTitle}>Important Alerts</Text>
              <View style={styles.alertCard}>
                <AlertTriangle size={24} color="#D32F2F" />
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>Low Nitrogen Levels</Text>
                  <Text style={styles.alertDescription}>
                    Nitrogen deficiency detected. This may affect plant growth and yield.
                  </Text>
                  <TouchableOpacity style={styles.alertButton}>
                    <Text style={styles.alertButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.actionsSection}>
              <Text style={styles.sectionTitle}>Recommended Actions</Text>
              <View style={styles.actionCards}>
                {[
                  {
                    title: 'Add Organic Matter',
                    description: 'Improve soil structure and fertility',
                    icon: CheckCircle,
                    color: '#2E7D32'
                  },
                  {
                    title: 'Apply Fertilizer',
                    description: 'Address nutrient deficiencies',
                    icon: CheckCircle,
                    color: '#1976D2'
                  },
                  {
                    title: 'Monitor pH',
                    description: 'Check soil pH regularly',
                    icon: CheckCircle,
                    color: '#F57C00'
                  }
                ].map((action, index) => (
                  <TouchableOpacity key={index} style={styles.actionCard}>
                    <View style={[styles.actionIcon, { backgroundColor: `${action.color}10` }]}>
                      <action.icon size={24} color={action.color} />
                    </View>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionDescription}>{action.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Link href="/(tabs)/reports" asChild>
              <TouchableOpacity style={styles.reportButton}>
                <Text style={styles.reportButtonText}>View Full Report</Text>
                <ArrowRight size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </Link>
          </>
        )}
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
    height: 250,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  mainContent: {
    marginTop: -40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
  },
  deviceSection: {
    paddingHorizontal: 16,
  },
  deviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  connected: {
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  disconnected: {
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  deviceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceStatusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginLeft: 8,
  },
  disconnectButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
  },
  disconnectText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '500',
  },
  deviceStats: {
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    position: 'absolute',
    right: 0,
    top: -18,
    fontSize: 12,
    color: '#757575',
  },
  connectContainer: {
    alignItems: 'center',
    padding: 20,
  },
  connectIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  connectTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  connectSubtitle: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
  },
  connectButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  healthScoreSection: {
    padding: 16,
  },
  healthScoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2E7D32',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#2E7D32',
  },
  scoreDetails: {
    flex: 1,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  scoreDescription: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
  summarySection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 16,
  },
  alertsSection: {
    padding: 16,
  },
  alertCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 12,
  },
  alertButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  alertButtonText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '500',
  },
  actionsSection: {
    padding: 16,
  },
  actionCards: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#757575',
    flex: 1,
  },
  reportButton: {
    backgroundColor: '#2E7D32',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  reportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});