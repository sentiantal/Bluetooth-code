import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { mockSoilData } from '@/data/mockData';
import NutrientCard from '@/components/NutrientCard';
import { Info } from 'lucide-react-native';

export default function NutrientsScreen() {
  const [selectedNutrient, setSelectedNutrient] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (nutrient) => {
    setSelectedNutrient(nutrient);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Soil Nutrients Analysis</Text>
        <Text style={styles.subtitle}>
          Tap on any nutrient to learn more and get recommendations
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {mockSoilData.nutrients.map((nutrient) => (
          <NutrientCard
            key={nutrient.id}
            nutrient={nutrient}
            onPress={() => openModal(nutrient)}
          />
        ))}
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoHeader}>
          <Info size={20} color="#757575" />
          <Text style={styles.infoTitle}>Understanding Nutrient Status</Text>
        </View>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#E57373' }]} />
            <Text style={styles.legendText}>Low - Needs attention</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FFD54F' }]} />
            <Text style={styles.legendText}>Moderate - Monitor levels</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#81C784' }]} />
            <Text style={styles.legendText}>Good - Optimal range</Text>
          </View>
        </View>
      </View>

      {selectedNutrient && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedNutrient.name}</Text>
              <Text style={styles.modalValue}>
                {selectedNutrient.value} {selectedNutrient.unit}
              </Text>
              
              <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(selectedNutrient.status) }]}>
                <Text style={styles.statusText}>{selectedNutrient.status}</Text>
              </View>
              
              <Text style={styles.modalLabel}>What is {selectedNutrient.name}?</Text>
              <Text style={styles.modalDescription}>{selectedNutrient.description}</Text>
              
              <Text style={styles.modalLabel}>Role in Plant Growth</Text>
              <Text style={styles.modalDescription}>{selectedNutrient.role}</Text>
              
              <Text style={styles.modalLabel}>Recommendations</Text>
              <Text style={styles.modalDescription}>{selectedNutrient.recommendation}</Text>
              
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
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
  cardsContainer: {
    padding: 16,
    paddingTop: 8,
  },
  infoSection: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#616161',
    marginLeft: 8,
  },
  legendContainer: {
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  modalValue: {
    fontSize: 18,
    fontWeight: '500',
    color: '#424242',
    marginBottom: 16,
  },
  statusIndicator: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#616161',
    marginBottom: 4,
    marginTop: 16,
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#616161',
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});