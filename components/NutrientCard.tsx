import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface NutrientProps {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  status: 'low' | 'moderate' | 'good';
  description?: string;
  role?: string;
  recommendation?: string;
}

interface NutrientCardProps {
  nutrient: NutrientProps;
  onPress: () => void;
}

export default function NutrientCard({ nutrient, onPress }: NutrientCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low':
        return '#E57373';
      case 'moderate':
        return '#FFD54F';
      case 'good':
        return '#81C784';
      default:
        return '#BDBDBD';
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { borderColor: getStatusColor(nutrient.status) }]} 
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{nutrient.name}</Text>
      </View>
      <Text style={styles.subtitle}>
        {typeof nutrient.value === 'string' ? nutrient.value : nutrient.value.toFixed(2)} {nutrient.unit}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
  },
});