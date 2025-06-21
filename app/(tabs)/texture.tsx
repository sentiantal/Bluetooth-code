import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TextureScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Soil Texture</Text>
      <Text style={styles.subtitle}>Analyze soil composition here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
});

export default TextureScreen;