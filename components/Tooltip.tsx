import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface TooltipProps {
  text: string;
}

export default function Tooltip({ text }: TooltipProps) {
  return (
    <View style={styles.container}>
      <View style={styles.arrow} />
      <View style={styles.content}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 10,
    top: 40,
    zIndex: 10,
    width: '80%',
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#333',
    position: 'absolute',
    top: -8,
    right: 10,
  },
  content: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
});