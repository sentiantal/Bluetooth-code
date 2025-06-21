import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Leaf, Mountain, Droplets, ChevronDown, ArrowRight } from 'lucide-react-native';

type SummaryCardProps = {
  title: string;
  status: 'good' | 'moderate' | 'poor';
  value: string;
  icon: string;
  description: string;
  details: string[];
  onPress: () => void;
};

export default function SummaryCard({
  title, 
  status, 
  value,
  icon,
  description,
  details,
  onPress
}: SummaryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleExpanded = () => {
    const toValue = expanded ? 0 : 1;
    
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    setExpanded(!expanded);
  };

  const getStatusColor = () => {
    switch (status) {
      case 'good': return '#2E7D32';
      case 'moderate': return '#F57C00';
      case 'poor': return '#D32F2F';
      default: return '#757575';
    }
  };

  const getIcon = () => {
    switch (icon) {
      case 'leaf': return <Leaf size={24} color={getStatusColor()} />;
      case 'mountain': return <Mountain size={24} color={getStatusColor()} />;
      case 'droplets': return <Droplets size={24} color={getStatusColor()} />;
      default: return <Leaf size={24} color={getStatusColor()} />;
    }
  };

  const detailsHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, details.length * 30 + 10]
  });

  const iconRotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardHeader} onPress={toggleExpanded}>
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color: getStatusColor() }]}>{value}</Text>
          <Animated.View style={{ transform: [{ rotate: iconRotation }] }}>
            <ChevronDown size={20} color="#757575" />
          </Animated.View>
        </View>
      </TouchableOpacity>

      <Animated.View style={[styles.detailsContainer, { height: detailsHeight }]}>
        {details.map((detail, index) => (
          <Text key={index} style={styles.detailItem}>• {detail}</Text>
        ))}
        <TouchableOpacity style={styles.detailsButton} onPress={onPress}>
          <Text style={styles.detailsButtonText}>View Details</Text>
          <ArrowRight size={16} color="#2E7D32" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#757575',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
  },
  detailsContainer: {
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  detailItem: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 8,
    paddingLeft: 8,
  },
  detailsButton: {
    marginTop: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  detailsButtonText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
});