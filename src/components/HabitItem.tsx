// src/components/HabitItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Habit } from '../models/Habit';

interface HabitItemProps {
  habit: Habit;
  onToggleComplete: () => void;
  isCompletedToday: boolean;
}

const HabitItem: React.FC<HabitItemProps> = ({ habit, onToggleComplete, isCompletedToday }) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.habitName}>{habit.name}</Text>
        <Text style={styles.habitFrequency}>{habit.frequency}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.completeButton,
          isCompletedToday ? styles.completedButton : styles.notCompletedButton,
        ]}
        onPress={onToggleComplete}
      >
        <Text style={styles.buttonText}>
          {isCompletedToday ? 'Completed' : 'Mark Complete'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  habitFrequency: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  completeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  completedButton: {
    backgroundColor: '#4CAF50',
  },
  notCompletedButton: {
    backgroundColor: '#FFA500',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HabitItem;