import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Leaf, Mountain, Droplets } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

interface SummaryCardProps {
  title: string;
  status: 'poor' | 'moderate' | 'good';
  value: string;
  icon: 'leaf' | 'mountain' | 'droplets';
  description: string;
  details: string[];
  onPress: () => void;
}

export default function SummaryCard({ 
  title, 
  status, 
  value, 
  icon, 
  description, 
  details,
  onPress 
}: SummaryCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'poor':
        return '#D32F2F';
      case 'moderate':
        return '#F57C00';
      case 'good':
        return '#2E7D32';
      default:
        return '#757575';
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'poor':
        return '#FFEBEE';
      case 'moderate':
        return '#FFF3E0';
      case 'good':
        return '#E8F5E9';
      default:
        return '#F5F5F5';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'poor':
        return 'Needs Attention';
      case 'moderate':
        return 'Average';
      case 'good':
        return 'Optimal';
      default:
        return status;
    }
  };

  const renderIcon = () => {
    const size = 32;
    const color = getStatusColor(status);
    
    switch (icon) {
      case 'leaf':
        return <Leaf size={size} color={color} />;
      case 'mountain':
        return <Mountain size={size} color={color} />;
      case 'droplets':
        return <Droplets size={size} color={color} />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: getStatusBackground(status) }]}
      onPress={onPress}
    >
      <View style={styles.topSection}>
        <View style={[styles.iconContainer, { backgroundColor: `${getStatusColor(status)}15` }]}>
          {renderIcon()}
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>

      <View style={styles.middleSection}>
        <View style={styles.valueContainer}>
          <Text style={styles.valueLabel}>Current Reading</Text>
          <Text style={[styles.value, { color: getStatusColor(status) }]}>{value}</Text>
        </View>
        <View style={[styles.statusContainer, { backgroundColor: `${getStatusColor(status)}15` }]}>
          <Text style={[styles.statusValue, { color: getStatusColor(status) }]}>
            {getStatusText(status)}
          </Text>
        </View>
      </View>

      <View style={styles.detailsSection}>
        {details.map((detail, index) => (
          <View key={index} style={styles.detailItem}>
            <View style={[styles.detailDot, { backgroundColor: getStatusColor(status) }]} />
            <Text style={styles.detailText}>{detail}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.footer, { backgroundColor: getStatusColor(status) }]}>
        <Text style={styles.footerText}>View Detailed Analysis</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  topSection: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#616161',
    lineHeight: 20,
  },
  middleSection: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valueContainer: {
    flex: 1,
  },
  valueLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
    fontWeight: '500',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
  },
  statusContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailsSection: {
    padding: 16,
    paddingTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#424242',
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    padding: 12,
    alignItems: 'center',
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});