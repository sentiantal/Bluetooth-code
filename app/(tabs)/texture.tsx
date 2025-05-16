import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { mockSoilData } from '@/data/mockData';
import { Info } from 'lucide-react-native';

export default function TextureScreen() {
  const soilData = mockSoilData.texture;
  
  // Calculate the soil type based on the percentages
  const getSoilType = () => {
    const clay = soilData.clay.value;
    const sand = soilData.sand.value;
    const silt = soilData.silt.value;
    
    if (clay >= 40) return "Clay";
    if (sand >= 85) return "Sand";
    if (silt >= 80) return "Silt";
    if (clay >= 27 && sand < 20) return "Silty Clay";
    if (clay >= 27 && silt < 28) return "Sandy Clay";
    if (silt >= 50 && clay >= 27) return "Silty Clay Loam";
    if (sand >= 52 && clay >= 20) return "Sandy Clay Loam";
    if (sand >= 50 && sand <= 70 && silt >= 0 && silt <= 50 && clay <= 20) return "Sandy Loam";
    if (silt >= 50 && clay <= 27) return "Silt Loam";
    return "Loam"; // Default if none of the above
  };
  
  const soilType = getSoilType();
  
  // Characteristics and recommendations based on soil type
  const getSoilInfo = () => {
    switch(soilType) {
      case "Clay":
        return {
          characteristics: [
            "High water retention",
            "Poor drainage",
            "Slow to warm up in spring",
            "Can be difficult to work with when wet",
            "Rich in nutrients"
          ],
          recommendations: [
            "Add organic matter to improve drainage",
            "Add coarse sand to improve structure",
            "Be careful not to overwater",
            "Use raised beds to improve drainage",
            "Avoid walking on wet clay soil to prevent compaction"
          ]
        };
      case "Sandy Loam":
        return {
          characteristics: [
            "Good drainage",
            "Warms up quickly in spring",
            "Easy to work with",
            "Low water retention",
            "Moderate nutrient content"
          ],
          recommendations: [
            "Add organic matter to improve water retention",
            "Use mulch to conserve moisture",
            "Use compost to increase nutrient content",
            "Consider more frequent, lighter watering",
            "Use cover crops to prevent erosion"
          ]
        };
      // Other soil types can be added similarly
      default:
        return {
          characteristics: [
            "Balanced properties",
            "Good water infiltration",
            "Good aeration",
            "Moderate nutrient content",
            "Versatile for many crops"
          ],
          recommendations: [
            "Maintain organic matter with compost",
            "Rotate crops to maintain soil health",
            "Test soil regularly",
            "Add appropriate fertilizers based on crop needs",
            "Practice minimal tillage to preserve soil structure"
          ]
        };
    }
  };
  
  const soilInfo = getSoilInfo();
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Soil Texture Analysis</Text>
        <Text style={styles.subtitle}>
          Your soil texture affects water retention, drainage, and nutrient availability
        </Text>
      </View>
      
      <View style={styles.textureCard}>
        <Text style={styles.textureTitle}>Your Soil Type</Text>
        <Text style={styles.textureType}>{soilType}</Text>
        <View style={styles.compositionContainer}>
          {Object.entries(soilData).map(([key, item]) => (
            <View key={key} style={styles.compositionItem}>
              <View 
                style={[
                  styles.percentageFill, 
                  { 
                    width: `${Math.min(item.value, 100)}%`,
                    backgroundColor: getComponentColor(key)
                  }
                ]} 
              />
              <View style={styles.compositionTextContainer}>
                <Text style={styles.compositionLabel}>{item.name}</Text>
                <Text style={styles.compositionValue}>{item.value}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.triangleContainer}>
        <Text style={styles.sectionTitle}>Soil Texture Triangle</Text>
        <View style={styles.triangleImageContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/5486/bird-s-eye-view-of-soil-triangle.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' }}
            style={styles.triangleImage}
            resizeMode="contain"
          />
          <View style={styles.triangleOverlay}>
            <View style={styles.pinpoint} />
          </View>
        </View>
        <View style={styles.triangleLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#D7CCC8' }]} />
            <Text style={styles.legendText}>Clay</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FFE0B2' }]} />
            <Text style={styles.legendText}>Sand</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#C8E6C9' }]} />
            <Text style={styles.legendText}>Silt</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.pinpoint} />
            <Text style={styles.legendText}>Your Soil</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.characteristicsContainer}>
        <Text style={styles.sectionTitle}>Characteristics</Text>
        {soilInfo.characteristics.map((item, index) => (
          <View key={index} style={styles.characteristicItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.characteristicText}>{item}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.recommendationsContainer}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        {soilInfo.recommendations.map((item, index) => (
          <View key={index} style={styles.recommendationItem}>
            <Text style={styles.recommendationNumber}>{index + 1}</Text>
            <Text style={styles.recommendationText}>{item}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoHeader}>
          <Info size={20} color="#757575" />
          <Text style={styles.infoTitle}>Why Soil Texture Matters</Text>
        </View>
        <Text style={styles.infoText}>
          Soil texture determines how water moves through soil, how much water can be 
          stored, and how easily roots can penetrate. It affects nutrient availability, 
          aeration, and temperature regulation. Understanding your soil texture helps you 
          manage irrigation, choose appropriate crops, and improve soil health.
        </Text>
      </View>
    </ScrollView>
  );
}

const getComponentColor = (component) => {
  switch(component) {
    case 'clay':
      return '#D7CCC8';
    case 'sand':
      return '#FFE0B2';
    case 'silt':
      return '#C8E6C9';
    default:
      return '#BDBDBD';
  }
};

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
  textureCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textureTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#616161',
    marginBottom: 8,
  },
  textureType: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 16,
  },
  compositionContainer: {
    marginTop: 8,
  },
  compositionItem: {
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    marginBottom: 12,
    overflow: 'hidden',
  },
  percentageFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 6,
  },
  compositionTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: '100%',
  },
  compositionLabel: {
    fontWeight: '500',
    color: '#424242',
  },
  compositionValue: {
    fontWeight: '700',
    color: '#424242',
  },
  triangleContainer: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  triangleImageContainer: {
    position: 'relative',
    width: '100%',
    height: 220,
    marginBottom: 16,
  },
  triangleImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  triangleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinpoint: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F44336',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  triangleLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#616161',
  },
  characteristicsContainer: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  characteristicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 12,
  },
  characteristicText: {
    fontSize: 14,
    color: '#616161',
    flex: 1,
  },
  recommendationsContainer: {
    margin: 16,
    marginTop: 0,
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
    marginBottom: 12,
  },
  recommendationNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8BC34A',
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
  infoContainer: {
    margin: 16,
    marginTop: 0,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F1F8E9',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8BC34A',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#33691E',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#33691E',
  },
});