import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSoilData } from '@/context/SoilDataContext';
import { Droplets, ChevronLeft, Info } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function WaterScreen() {
  const router = useRouter();
  const { soilData } = useSoilData();

  // Extract relevant values from soilData
  const currentMoisture = parseFloat(soilData.find(d => d.label === 'Soil Moisture')?.value ?? '0');
  const fieldCapacity = parseFloat(soilData.find(d => d.label === 'Water Retention 10 kPa')?.value ?? '0');
  const wiltingPoint = parseFloat(soilData.find(d => d.label === 'Water Retention 1500 kPa')?.value ?? '0');
  const availableWaterCapacity = Math.max(0, fieldCapacity - wiltingPoint);

  const optimalRange = {
    min: 10, // fallback values
    max: 30,
  };

  const history = [
    { date: new Date().toISOString(), value: currentMoisture },
    { date: new Date(Date.now() - 86400000).toISOString(), value: currentMoisture * 0.95 },
    { date: new Date(Date.now() - 2 * 86400000).toISOString(), value: currentMoisture * 0.9 },
  ];

  const recommendations = [
    "Use drip irrigation to manage water efficiently.",
    "Improve organic matter to increase water retention.",
    "Monitor weather and avoid overwatering."
  ];

  const waterDetails = {
    currentMoisture,
    optimalRange,
    fieldCapacity,
    wiltingPoint,
    availableWaterCapacity,
    history,
    recommendations,
  };

  const getMoistureStatus = () => {
    if (waterDetails.currentMoisture < waterDetails.optimalRange.min) {
      return { status: 'Low', color: '#D32F2F' };
    } else if (waterDetails.currentMoisture > waterDetails.optimalRange.max) {
      return { status: 'High', color: '#F57C00' };
    } else {
      return { status: 'Optimal', color: '#2E7D32' };
    }
  };

  const moistureStatus = getMoistureStatus();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Droplets size={32} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Soil Moisture</Text>
          <Text style={styles.headerSubtitle}>Water content and retention</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.infoBox}>
          <View style={styles.infoIconContainer}>
            <Info size={20} color="#1976D2" />
          </View>
          <Text style={styles.infoText}>
            Soil moisture affects plant growth, nutrient availability, and microbial activity. 
            Maintaining proper moisture levels is essential for healthy plant development.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Moisture Level</Text>
          <View style={styles.moistureCard}>
            <View style={styles.moistureIndicatorContainer}>
              <Text style={[styles.moistureValue, { color: moistureStatus.color }]}>
                {waterDetails.currentMoisture}%
              </Text>
              <Text style={[styles.moistureStatus, { color: moistureStatus.color }]}>
                {moistureStatus.status}
              </Text>
            </View>
            <View style={styles.moistureGauge}>
              <View style={styles.gaugeBackground}>
                <View 
                  style={[
                    styles.gaugeOptimal, 
                    { 
                      left: `${waterDetails.optimalRange.min}%`, 
                      width: `${waterDetails.optimalRange.max - waterDetails.optimalRange.min}%` 
                    }
                  ]} 
                />
                <View 
                  style={[
                    styles.gaugeIndicator, 
                    { 
                      left: `${waterDetails.currentMoisture}%`,
                      backgroundColor: moistureStatus.color
                    }
                  ]}
                />
              </View>
              <View style={styles.gaugeLabels}>
                <Text style={styles.gaugeLabel}>0%</Text>
                <Text style={styles.gaugeLabel}>
                  {waterDetails.optimalRange.min}% - {waterDetails.optimalRange.max}%
                </Text>
                <Text style={styles.gaugeLabel}>100%</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Water Capacity Details</Text>
          <View style={styles.capacityCard}>
            <View style={styles.capacityRow}>
              <Text style={styles.capacityLabel}>Field Capacity:</Text>
              <Text style={styles.capacityValue}>{waterDetails.fieldCapacity}%</Text>
            </View>
            <Text style={styles.capacityDescription}>
              Maximum amount of water soil can hold after gravity drainage
            </Text>
            
            <View style={styles.divider} />
            
            <View style={styles.capacityRow}>
              <Text style={styles.capacityLabel}>Wilting Point:</Text>
              <Text style={styles.capacityValue}>{waterDetails.wiltingPoint}%</Text>
            </View>
            <Text style={styles.capacityDescription}>
              Minimum moisture level at which plants can extract water
            </Text>
            
            <View style={styles.divider} />
            
            <View style={styles.capacityRow}>
              <Text style={styles.capacityLabel}>Available Water:</Text>
              <Text style={styles.capacityValue}>{waterDetails.availableWaterCapacity.toFixed(3)}%</Text>
            </View>
            <Text style={styles.capacityDescription}>
              Water content available for plant use
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Moisture Trend</Text>
          <View style={styles.trendCard}>
            <View style={styles.trendChart}>
              {waterDetails.history.map((item, index) => {
                const percentage = Math.max(
                  5, 
                  Math.min(
                    100, 
                    ((item.value - waterDetails.wiltingPoint) / 
                    (waterDetails.fieldCapacity - waterDetails.wiltingPoint)) * 100
                  )
                );
                
                return (
                  <View key={index} style={styles.trendBar}>
                    <View style={styles.trendBarLabels}>
                      <Text style={styles.trendDate}>
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Text>
                      <Text style={styles.trendValue}>{item.value.toFixed(3)}%</Text>
                    </View>
                    <View style={styles.trendBarContainer}>
                      <View 
                        style={[
                          styles.trendBarFill, 
                          { 
                            height: `${percentage}%`,
                            backgroundColor: item.value < waterDetails.optimalRange.min ? '#D32F2F' : 
                                            item.value > waterDetails.optimalRange.max ? '#F57C00' : '#2E7D32'
                          }
                        ]} 
                      />
                    </View>
                  </View>
                );
              })}
            </View>
            <View style={styles.trendLegend}>
              <View style={styles.trendLegendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#2E7D32' }]} />
                <Text style={styles.legendText}>Optimal</Text>
              </View>
              <View style={styles.trendLegendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#F57C00' }]} />
                <Text style={styles.legendText}>High</Text>
              </View>
              <View style={styles.trendLegendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#D32F2F' }]} />
                <Text style={styles.legendText}>Low</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          {waterDetails.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationCard}>
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
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
    backgroundColor: '#1976D2',
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    padding: 16,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconContainer: {
    marginRight: 12,
  },
  infoText: {
    color: '#0D47A1',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 16,
  },
  moistureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  moistureIndicatorContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  moistureValue: {
    fontSize: 36,
    fontWeight: '700',
  },
  moistureStatus: {
    fontSize: 18,
    fontWeight: '600',
  },
  moistureGauge: {
    marginTop: 8,
  },
  gaugeBackground: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    position: 'relative',
  },
  gaugeOptimal: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 10,
  },
  gaugeIndicator: {
    position: 'absolute',
    width: 4,
    height: 30,
    bottom: -5,
    marginLeft: -2,
    borderRadius: 2,
  },
  gaugeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  gaugeLabel: {
    fontSize: 12,
    color: '#757575',
  },
  capacityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  capacityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  capacityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
  },
  capacityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
  },
  capacityDescription: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  trendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  trendChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 200,
    marginBottom: 16,
  },
  trendBar: {
    flex: 1,
    alignItems: 'center',
  },
  trendBarLabels: {
    alignItems: 'center',
    marginBottom: 8,
  },
  trendDate: {
    fontSize: 10,
    color: '#757575',
    marginBottom: 4,
  },
  trendValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#424242',
  },
  trendBarContainer: {
    width: 16,
    height: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  trendBarFill: {
    width: '100%',
    borderRadius: 8,
  },
  trendLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    gap: 16,
  },
  trendLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#616161',
  },
  recommendationsSection: {
    marginBottom: 24,
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recommendationText: {
    fontSize: 14,
    color: '#616161',
    lineHeight: 20,
  },
});