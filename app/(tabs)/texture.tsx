import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSoilData } from '@/context/SoilDataContext';
import { Mountain, ChevronLeft, Info } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { TranslatedText } from '@/components/TranslatedText';

export default function TextureScreen() {
  const router = useRouter();
  const { soilData } = useSoilData();

  const getStatusColor = (value: string): string => {
    switch (value) {
      case 'Good': return '#2E7D32';
      case 'Moderate': return '#F57C00';
      case 'Poor': return '#D32F2F';
      default: return '#757575';
    }
  };
  const textureDetails = {
  type: soilData.find(d => d.label === 'Texture Type')?.value ?? 'Unknown',
  composition: {
    sand: parseFloat(soilData.find(d => d.label === 'Total Sand')?.value ?? '0'),
    silt: parseFloat(soilData.find(d => d.label === 'Total Silt')?.value ?? '0'),
    clay: parseFloat(soilData.find(d => d.label === 'Total Clay')?.value ?? '0'),
  },
  properties: [
    {
      name: 'Water Retention',
      value: soilData.find(d => d.label === 'Water Retention')?.value ?? 'Moderate',
      description: 'Capacity of soil to hold water for plant use.',
    },
    {
      name: 'Drainage',
      value: soilData.find(d => d.label === 'Drainage')?.value ?? 'Good',
      description: 'Ability of soil to remove excess water.',
    },
    {
      name: 'Aeration',
      value: soilData.find(d => d.label === 'Aeration')?.value ?? 'Moderate',
      description: 'Movement of air within soil particles.',
    },
  ],
};


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
          <Mountain size={32} color="#FFFFFF" />
          <Text style={styles.headerTitle}><TranslatedText text="Soil Texture"/></Text>
          <Text style={styles.headerSubtitle}><TranslatedText text="Composition and structure of your soil"/></Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.infoBox}>
          <View style={styles.infoIconContainer}>
            <Info size={20} color="#1976D2" />
          </View>
          <Text style={styles.infoText}>
            <TranslatedText text="Soil texture affects water retention, drainage, aeration, and nutrient availability. 
            It's determined by the proportion of sand, silt, and clay particles."/>
          </Text>
        </View>

        

        <View style={styles.section}>
          <Text style={styles.sectionTitle}><TranslatedText text="Soil Composition"/></Text>
          <View style={styles.compositionCard}>
            <View style={styles.compositionChart}>
              <View style={styles.compositionBar}>
                <View 
                  style={[
                    styles.compositionSegment, 
                    { width: `${textureDetails.composition.sand}%`, backgroundColor: '#F9A825' }
                  ]}
                />
                <View 
                  style={[
                    styles.compositionSegment, 
                    { width: `${textureDetails.composition.silt}%`, backgroundColor: '#8D6E63' }
                  ]}
                />
                <View 
                  style={[
                    styles.compositionSegment, 
                    { width: `${textureDetails.composition.clay}%`, backgroundColor: '#B71C1C' }
                  ]}
                />
              </View>
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#F9A825' }]} />
                  <Text style={styles.legendText}><TranslatedText text="Sand: "/>{textureDetails.composition.sand}%</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#8D6E63' }]} />
                  <Text style={styles.legendText}><TranslatedText text="Silt: "/>{textureDetails.composition.silt}%</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#B71C1C' }]} />
                  <Text style={styles.legendText}><TranslatedText text="Clay: "/>{textureDetails.composition.clay}%</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}><TranslatedText text="Soil Properties"/></Text>
          <Text style={styles.sectionDescription}>
            <TranslatedText text="Physical characteristics that affect plant growth"/>
          </Text>
          {textureDetails.properties.map((property, index) => (
            <View key={index} style={styles.propertyCard}>
              <View style={styles.propertyHeader}>
                <Text style={styles.propertyName}><TranslatedText text={property.name}/></Text>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(property.value)}20` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(property.value) }]}>
                    <TranslatedText text={property.value}/>
                  </Text>
                </View>
              </View>
              <Text style={styles.propertyDescription}><TranslatedText text={property.description}/></Text>
            </View>
          ))}
        </View>

        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}><TranslatedText text="Recommendations"/></Text>
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}><TranslatedText text="Add Organic Matter"/></Text>
            <Text style={styles.recommendationText}>
              <TranslatedText text="Incorporate compost or well-rotted manure to improve water retention while maintaining good drainage."/>
            </Text>
          </View>
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}><TranslatedText text="Mulch Regularly"/></Text>
            <Text style={styles.recommendationText}>
              <TranslatedText text="Apply 2-3 inches of organic mulch to maintain soil moisture and prevent erosion."/>
            </Text>
          </View>
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}><TranslatedText text="Avoid Compaction"/></Text>
            <Text style={styles.recommendationText}>
              <TranslatedText text="Limit traffic on soil and avoid working it when wet to maintain good structure."/>
            </Text>
          </View>
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
    backgroundColor: '#795548',
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
  typeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#795548',
    marginBottom: 12,
    textAlign: 'center',
  },
  typeDescription: {
    fontSize: 14,
    color: '#616161',
    lineHeight: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  compositionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  compositionChart: {
    width: '100%',
  },
  compositionBar: {
    height: 24,
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 16,
  },
  compositionSegment: {
    height: '100%',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
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
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#616161',
  },
  propertyCard: {
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
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  propertyDescription: {
    fontSize: 14,
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
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#616161',
    lineHeight: 20,
  },
});