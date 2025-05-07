// src/screens/CreateHabitScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Input from '../components/Input';
import Button from '../components/Button';
import { Habit } from '../models/Habit';
import { getHabits, saveHabits } from '../services/storage';

const CreateHabitScreen: React.FC = () => {
  const [habitTitle, setHabitTitle] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigation = useNavigation<StackNavigationProp<any>>();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!habitTitle.trim()) {
      newErrors.habitTitle = 'Habit title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateHabit = async () => {
    if (!validateForm()) return;

    try {
      const habits = await getHabits();
      
      const newHabit: Habit = {
        id: Date.now().toString(),
        title: habitTitle,
        frequency,
        createdAt: new Date().toISOString(),
        completedDates: [], // For tracking dates when habit was completed
        completions: [],    // Keep this for backward compatibility
      };
      
      await saveHabits([...habits, newHabit]);
      
      // Reset form
      setHabitTitle('');
      setFrequency('daily');
      
      // Go back to habit list or show success message
      navigation.navigate('Habits');
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create New Habit</Text>
          <Text style={styles.subtitle}>Add a new habit to track your progress</Text>
          
          <Input
            label="Habit Title"
            value={habitTitle}
            onChangeText={setHabitTitle}
            placeholder="e.g., Morning Exercise, Reading"
            error={errors.habitTitle}
          />
          
          <Text style={styles.label}>Frequency</Text>
          <View style={styles.frequencyContainer}>
            <TouchableOpacity
              style={[
                styles.frequencyOption,
                frequency === 'daily' && styles.selectedFrequency,
              ]}
              onPress={() => setFrequency('daily')}
            >
              <Text
                style={[
                  styles.frequencyText,
                  frequency === 'daily' && styles.selectedFrequencyText,
                ]}
              >
                Daily
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.frequencyOption,
                frequency === 'weekly' && styles.selectedFrequency,
              ]}
              onPress={() => setFrequency('weekly')}
            >
              <Text
                style={[
                  styles.frequencyText,
                  frequency === 'weekly' && styles.selectedFrequencyText,
                ]}
              >
                Weekly
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.frequencyOption,
                frequency === 'monthly' && styles.selectedFrequency,
              ]}
              onPress={() => setFrequency('monthly')}
            >
              <Text
                style={[
                  styles.frequencyText,
                  frequency === 'monthly' && styles.selectedFrequencyText,
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>
          </View>
          
          <Button
            title="Create Habit"
            onPress={handleCreateHabit}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4CAF50',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333',
  },
  frequencyContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  frequencyOption: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 8,
  },
  selectedFrequency: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  frequencyText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedFrequencyText: {
    color: 'white',
  },
  button: {
    backgroundColor: '#4CAF50',
  },
});

export default CreateHabitScreen;