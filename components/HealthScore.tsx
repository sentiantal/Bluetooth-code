import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type HealthScoreProps = {
  score: number;
  status: string;
};

export default function HealthScore({ score, status }: HealthScoreProps) {
  const getStatusColor = () => {
    if (score >= 80) return '#2E7D32';
    if (score >= 60) return '#F57C00';
    return '#D32F2F';
  };

  const getDescription = () => {
    if (score >= 80) return 'Your soil is in excellent condition with optimal health parameters';
    if (score >= 60) return 'Your soil is generally healthy with some areas for improvement';
    return 'Your soil needs immediate attention to improve key health indicators';
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreCircle}>
        <Text style={[styles.scoreNumber, { color: getStatusColor() }]}>{score}</Text>
        <Text style={[styles.scoreLabel, { color: getStatusColor() }]}>Health Score</Text>
      </View>
      <View style={styles.scoreDetails}>
        <Text style={[styles.scoreTitle, { color: getStatusColor() }]}>{status}</Text>
        <Text style={styles.scoreDescription}>{getDescription()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 12,
  },
  scoreDetails: {
    flex: 1,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  scoreDescription: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
});