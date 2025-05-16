import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { mockSoilData } from '@/data/mockData';
import { Droplets, Info } from 'lucide-react-native';

export default function WaterScreen() {
  const waterData = mockSoilData.waterRetention;
  
  // Calculate water availability
  const getWaterAvailability = () => {
    const fieldCapacity = waterData.at10kPa.value;
    const wiltingPoint = waterData.at1500kPa.value;
    
    // Available water capacity
    const awc = fieldCapacity - wiltingPoint;
    
    if (awc < 10) return { level: 'Low', color: '#E57373' };
    if (awc < 20) return { level: 'Moderate', color: '#FFD54F' };
    return { level: 'High', color: '#81C784' };
  };
  
  const waterAvailability = getWaterAvailability();
  const screenWidth = Dimensions.get('window').width;
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Water Retention Analysis</Text>
        <Text style={styles.subtitle}>
          Understanding how your soil holds and releases water for plant growth
        </Text>
      </View>
      
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Droplets size={24} color="#2196F3" />
          <Text style={styles.summaryTitle}>Plant Available Water</Text>
        </View>
        <View style={[styles.availabilityIndicator, { backgroundColor: waterAvailability.color }]}>
          <Text style={styles.availabilityText}>{waterAvailability.level}</Text>
        </View>
        <Text style={styles.summaryDescription}>
          Plant available water is the amount of water that can be stored in soil and be available for plant uptake.
        </Text>
      </View>
      
      <View style={styles.retentionCard}>
        <Text style={styles.cardTitle}>Water Retention Measurements</Text>
        
        <View style={styles.measurementContainer}>
          {Object.entries(waterData).map(([key, item]) => (
            <View key={key} style={styles.measurementItem}>
              <View style={styles.measurementHeader}>
                <Text style={styles.measurementName}>{item.name}</Text>
                <Text style={styles.measurementValue}>{item.value}%</Text>
              </View>
              <Text style={styles.measurementDescription}>{item.description}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.graphCard}>
        <Text style={styles.cardTitle}>Water Retention Curve</Text>
        
        <View style={styles.graphContainer}>
          {/* Y-axis (Pressure) */}
          <View style={styles.yAxis}>
            <Text style={styles.axisLabel}>Pressure (kPa)</Text>
            <View style={styles.tickContainer}>
              <Text style={styles.tickLabel}>1500</Text>
              <View style={styles.tickLine} />
            </View>
            <View style={styles.tickContainer}>
              <Text style={styles.tickLabel}>33</Text>
              <View style={styles.tickLine} />
            </View>
            <View style={styles.tickContainer}>
              <Text style={styles.tickLabel}>10</Text>
              <View style={styles.tickLine} />
            </View>
          </View>
          
          {/* Graph Area */}
          <View style={styles.graphArea}>
            {/* Curve Line */}
            <View style={styles.curveLine} />
            
            {/* Data Points */}
            <View style={[styles.dataPoint, { bottom: '85%', left: '20%' }]}>
              <Text style={styles.dataPointValue}>{waterData.at1500kPa.value}%</Text>
            </View>
            <View style={[styles.dataPoint, { bottom: '50%', left: '60%' }]}>
              <Text style={styles.dataPointValue}>{waterData.at33kPa.value}%</Text>
            </View>
            <View style={[styles.dataPoint, { bottom: '20%', left: '80%' }]}>
              <Text style={styles.dataPointValue}>{waterData.at10kPa.value}%</Text>
            </View>
            
            {/* Available Water Range */}
            <View style={styles.availableWaterRange}>
              <Text style={styles.rangeLabel}>Available Water</Text>
            </View>
          </View>
          
          {/* X-axis (Water Content) */}
          <View style={styles.xAxis}>
            <Text style={styles.axisLabel}>Water Content (%)</Text>
            <View style={styles.xTicksContainer}>
              <Text style={styles.xTickLabel}>0</Text>
              <Text style={styles.xTickLabel}>20</Text>
              <Text style={styles.xTickLabel}>40</Text>
              <Text style={styles.xTickLabel}>60</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.graphLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendPoint, { backgroundColor: '#E57373' }]} />
            <Text style={styles.legendText}>Wilting Point</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendPoint, { backgroundColor: '#64B5F6' }]} />
            <Text style={styles.legendText}>Field Capacity</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendPoint, { backgroundColor: '#81C784' }]} />
            <Text style={styles.legendText}>Saturation</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Info size={20} color="#757575" />
          <Text style={styles.infoTitle}>Understanding Water Retention</Text>
        </View>
        <Text style={styles.infoText}>
          <Text style={styles.boldText}>Field Capacity (10 kPa):</Text> The amount of water held in soil after excess water has drained away.
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.boldText}>Permanent Wilting Point (1500 kPa):</Text> The point at which plants can no longer extract water from the soil.
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.boldText}>Available Water Capacity:</Text> The difference between field capacity and wilting point, representing water available to plants.
        </Text>
      </View>
      
      <View style={styles.recommendationsCard}>
        <Text style={styles.cardTitle}>Recommendations</Text>
        
        <View style={styles.recommendationItem}>
          <Text style={styles.recommendationNumber}>1</Text>
          <Text style={styles.recommendationText}>
            Add organic matter to improve water retention capacity
          </Text>
        </View>
        <View style={styles.recommendationItem}>
          <Text style={styles.recommendationNumber}>2</Text>
          <Text style={styles.recommendationText}>
            Consider mulching to reduce water evaporation from soil
          </Text>
        </View>
        <View style={styles.recommendationItem}>
          <Text style={styles.recommendationNumber}>3</Text>
          <Text style={styles.recommendationText}>
            Implement drip irrigation for more efficient water use
          </Text>
        </View>
        <View style={styles.recommendationItem}>
          <Text style={styles.recommendationNumber}>4</Text>
          <Text style={styles.recommendationText}>
            Schedule irrigation based on soil moisture levels rather than calendar
          </Text>
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
  summaryCard: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginLeft: 8,
  },
  availabilityIndicator: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  availabilityText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  summaryDescription: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
  retentionCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 16,
  },
  measurementContainer: {
    marginTop: 8,
  },
  measurementItem: {
    marginBottom: 16,
  },
  measurementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  measurementName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#424242',
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2196F3',
  },
  measurementDescription: {
    fontSize: 14,
    color: '#757575',
  },
  graphCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  graphContainer: {
    flexDirection: 'row',
    height: 220,
    marginTop: 8,
  },
  yAxis: {
    width: 50,
    height: '100%',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  graphArea: {
    flex: 1,
    height: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    backgroundColor: '#FAFAFA',
    position: 'relative',
  },
  axisLabel: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 4,
  },
  tickContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tickLabel: {
    fontSize: 10,
    color: '#757575',
    marginRight: 4,
  },
  tickLine: {
    width: 4,
    height: 1,
    backgroundColor: '#9E9E9E',
  },
  xAxis: {
    height: 40,
    position: 'absolute',
    bottom: 0,
    left: 50,
    right: 0,
    alignItems: 'center',
  },
  xTicksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
  },
  xTickLabel: {
    fontSize: 10,
    color: '#757575',
    marginTop: 4,
  },
  curveLine: {
    position: 'absolute',
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
    borderWidth: 2,
    borderColor: '#2196F3',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 100,
    borderStyle: 'dashed',
  },
  dataPoint: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataPointValue: {
    position: 'absolute',
    bottom: 16,
    fontSize: 10,
    fontWeight: '500',
    color: '#2196F3',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  availableWaterRange: {
    position: 'absolute',
    bottom: '35%',
    left: '40%',
    right: '20%',
    height: 24,
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rangeLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#2196F3',
  },
  graphLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendPoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#757575',
  },
  infoCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D47A1',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#0D47A1',
    marginBottom: 8,
  },
  boldText: {
    fontWeight: '600',
  },
  recommendationsCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  recommendationNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2196F3',
    textAlign: 'center',
    lineHeight: 24,
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 12,
  },
  recommendationText: {
    fontSize: 14,
    color: '#616161',
    flex: 1,
  },
});