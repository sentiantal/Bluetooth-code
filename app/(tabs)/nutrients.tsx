import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
//import { mockSoilData } from '@/data/mockData';
import { useSoilData } from '@/context/SoilDataContext';
import { Leaf, ChevronLeft, Info } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { TranslatedText } from '@/components/TranslatedText';
import { useTranslatedText } from '@/hooks/useTranslatedText';

export default function NutrientsScreen() {
  const router = useRouter();
  const { soilData } = useSoilData();
  const error = useTranslatedText('error')
  const low = useTranslatedText('low')
  const moderate = useTranslatedText('moderate')
  const good = useTranslatedText('good')
  if (!soilData || soilData.length === 0) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text><TranslatedText text="Loading soil data..." /></Text>
    </View>
  );
}
  const getStatus = (value: number, min: number, max: number): string => {
    if (isNaN(value)) return error;
    if (value < min) return low;
    if (value > max) return moderate; // can also return 'high' if you want
    return good;
  };
  const convertKgHaToMgSample = (kgHa: number): number => {
  return parseFloat((kgHa * 0.064).toFixed(2));
};

  const nutrientDetails = {
    ph: {
      value: parseFloat(soilData.find(d => d.label === 'pH Level')?.value ?? '0'),
      optimal: '7.5 - 9.0',
      status: getStatus(
        parseFloat(soilData.find(d => d.label === 'pH Level')?.value ?? '0'),
        7.5,
        9.0
      ),
    },
    macronutrients: [
      {
        name: 'Nitrogen (N)',
        value: parseFloat(soilData.find(d => d.label === 'Total Nitrogen (N)')?.value ?? '0'),
        optimal: '8.96 - 17.92 mg/sample',
        status: getStatus(
          parseFloat(soilData.find(d => d.label === 'Total Nitrogen (N)')?.value ?? '0'),
          8.96,
          17.92
        ),
      },
      {
        name: 'Phosphorus (P)',
        value: parseFloat(soilData.find(d => d.label === 'Phosphorus Content')?.value ?? '0'),
        optimal: '0.45 - 0.90 mg/sample',
        status: getStatus(
          parseFloat(soilData.find(d => d.label === 'Phosphorus Content')?.value ?? '0'),
          0.45,
          0.90
        ),
      },
      {
        name: 'Potassium (K)',
        value: parseFloat(soilData.find(d => d.label === 'Potassium Content')?.value ?? '0'),
        optimal: '19.20 - 28.80 mg/sample',
        status: getStatus(
          parseFloat(soilData.find(d => d.label === 'Potassium Content')?.value ?? '0'),
          19.20,
          28.80
        ),
      },
    ],
    micronutrients: [
      {
        name: 'Zinc (Zn)',
        value: parseFloat(soilData.find(d => d.label === 'Zinc (Zn)')?.value ?? '0'),
        optimal: '0.5 - 3.0 ppm',
        status: getStatus(
          parseFloat(soilData.find(d => d.label === 'Zinc (Zn)')?.value ?? '0'),
          0.5,
          3.0
        ),
      },
      {
        name: 'Iron (Fe)',
        value: parseFloat(soilData.find(d => d.label === 'Iron (Fe)')?.value ?? '0'),
        optimal: '4.5 - 10 ppm',
        status: getStatus(
          parseFloat(soilData.find(d => d.label === 'Iron (Fe)')?.value ?? '0'),
          4.5,
          10
        ),
      },
      {
        name: 'Boron (B)',
        value: parseFloat(soilData.find(d => d.label === 'Boron (B)')?.value ?? '0'),
        optimal: '0.5 - 1.5 ppm',
        status: getStatus(
          parseFloat(soilData.find(d => d.label === 'Boron (B)')?.value ?? '0'),
          0.5,
          1.5
        ),
      },
    ],
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case good: return '#2E7D32';
      case moderate: return '#F57C00';
      case low: return '#D32F2F';
      case error: return '#BDBDBD'; // gray for error/missing data
      default: return '#757575';
    }
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
          <Leaf size={32} color="#FFFFFF" />
          <Text style= {styles.headerTitle}><TranslatedText text="Nutrients" /></Text>
          <Text style={styles.headerSubtitle}><TranslatedText text="Essential elements for plant growth"/></Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.infoBox}>
          <View style={styles.infoIconContainer}>
            <Info size={20} color="#1976D2" />
          </View>
          <Text style={styles.infoText}>
            <TranslatedText text="Soil nutrients are vital for plant growth. Maintaining proper
            nutrient levels ensures healthy crop development and maximum yield."/>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}><TranslatedText text="pH Level" /></Text>
          <View style={styles.phContainer}>
            <View style={styles.phScaleContainer}>
              <View style={styles.phScale}>
                <View style={styles.phRanges}>
                  <View style={[styles.phRange, { backgroundColor: '#D32F2F' }]} />
                  <View style={[styles.phRange, { backgroundColor: '#F57C00' }]} />
                  <View style={[styles.phRange, { backgroundColor: '#2E7D32' }]} />
                  <View style={[styles.phRange, { backgroundColor: '#F57C00' }]} />
                  <View style={[styles.phRange, { backgroundColor: '#D32F2F' }]} />
                </View>
                <View
                  style={[
                    styles.phIndicator,
                    { left: `${((nutrientDetails.ph.value - 4) / 10) * 100}%` }
                  ]}
                />
              </View>
              <View style={styles.phLabels}>
                <Text style={styles.phLabel}>4.0</Text>
                <Text style={styles.phLabel}>5.5</Text>
                <Text style={styles.phLabel}>7.0</Text>
                <Text style={styles.phLabel}>8.5</Text>
                <Text style={styles.phLabel}>10.0</Text>
              </View>
            </View>
            <View style={styles.phDetails}>
              <Text style={styles.phValue}>
                <TranslatedText text="Current: " /><Text style={{ color: getStatusColor(nutrientDetails.ph.status) }}>
                  {nutrientDetails.ph.value}
                </Text>
              </Text>
              <Text style={styles.phOptimal}>
                <TranslatedText text="Optimal: " />{nutrientDetails.ph.optimal}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}><TranslatedText text="Macronutrients"/></Text>
          <Text style={styles.sectionDescription}>
            <TranslatedText text="Essential nutrients required in large amounts"/>
          </Text>
          {nutrientDetails.macronutrients.map((nutrient, index) => (
            <View key={index} style={styles.nutrientCard}>
              <View style={styles.nutrientHeader}>
                <Text style={styles.nutrientName}><TranslatedText text={nutrient.name}/></Text>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(nutrient.status)}20` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(nutrient.status) }]}>
                    {nutrient.status.charAt(0).toUpperCase() + nutrient.status.slice(1)}
                  </Text>
                </View>
              </View>
              <View style={styles.nutrientDetails}>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueLabel}><TranslatedText text="Current"/></Text>
                  <Text style={[styles.value, { color: getStatusColor(nutrient.status) }]}>
                   {convertKgHaToMgSample(nutrient.value)}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.valueContainer}>
                  <Text style={styles.valueLabel}><TranslatedText text="Optimal"/></Text>
                  <Text style={styles.value}><TranslatedText text={nutrient.optimal}/></Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}><TranslatedText text="Micronutrients"/></Text>
          <Text style={styles.sectionDescription}>
            <TranslatedText text="Essential nutrients required in small amounts"/>
          </Text>
          {nutrientDetails.micronutrients.map((nutrient, index) => (
            <View key={index} style={styles.nutrientCard}>
              <View style={styles.nutrientHeader}>
                <Text style={styles.nutrientName}><TranslatedText text={nutrient.name}/></Text>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(nutrient.status)}20` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(nutrient.status) }]}>
                    {nutrient.status.charAt(0).toUpperCase() + nutrient.status.slice(1)}
                  </Text>
                </View>
              </View>
              <View style={styles.nutrientDetails}>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueLabel}><TranslatedText text="Current"/></Text>
                  <Text style={[styles.value, { color: getStatusColor(nutrient.status) }]}>
                    {nutrient.value}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.valueContainer}>
                  <Text style={styles.valueLabel}><TranslatedText text="Optimal"/></Text>
                  <Text style={styles.value}><TranslatedText text={nutrient.optimal}/></Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}><TranslatedText text="Recommendations"/></Text>
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}><TranslatedText text="Address Nitrogen Deficiency"/></Text>
            <Text style={styles.recommendationText}>
              <TranslatedText text="Apply nitrogen-rich fertilizer such as urea (46-0-0) at a rate of 1-2 pounds per 1000 square feet."/>
            </Text>
          </View>
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}><TranslatedText text="Improve Zinc Levels"/></Text>
            <Text style={styles.recommendationText}>
              <TranslatedText text="Apply zinc sulfate at 1-2 pounds per acre to correct zinc deficiency."/>
            </Text>
          </View>
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}><TranslatedText text="Maintain pH Level"/></Text>
            <Text style={styles.recommendationText}>
              <TranslatedText text="Your soil pH is within optimal range. Continue monitoring but no adjustment needed at this time."/>
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
    backgroundColor: '#2E7D32',
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
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  phContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  phScaleContainer: {
    marginBottom: 16,
  },
  phScale: {
    height: 20,
    borderRadius: 10,
    position: 'relative',
    marginBottom: 8,
  },
  phRanges: {
    flexDirection: 'row',
    height: '100%',
  },
  phRange: {
    flex: 1,
    height: '100%',
  },
  phIndicator: {
    position: 'absolute',
    width: 12,
    height: 24,
    backgroundColor: '#212121',
    borderRadius: 6,
    top: -2,
    marginLeft: -6,
  },
  phLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  phLabel: {
    fontSize: 12,
    color: '#757575',
  },
  phDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  phValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
  },
  phOptimal: {
    fontSize: 14,
    color: '#757575',
  },
  nutrientCard: {
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
  nutrientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nutrientName: {
    fontSize: 18,
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
  nutrientDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueContainer: {
    flex: 1,
  },
  valueLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
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