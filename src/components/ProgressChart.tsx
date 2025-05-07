// src/components/ProgressChart.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressChartProps {
  completedPercentage: number;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ completedPercentage }) => {
  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${completedPercentage}%` }]} />
      </View>
      <Text style={styles.progressText}>{completedPercentage.toFixed(0)}% Completed</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  progressContainer: {
    width: '100%',
    height: 24,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProgressChart;