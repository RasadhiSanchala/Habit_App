// src/screens/HabitListScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HabitItem from '../components/HabitItem';
import { Habit } from '../models/Habit';
import { getHabits, saveHabits } from '../services/storage';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

type FilterType = 'all' | 'today' | 'completed';

const HabitListScreen: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { logout } = useContext(AuthContext);

  const loadHabits = async () => {
    try {
      const loadedHabits = await getHabits();
      setHabits(loadedHabits);
      applyFilter(loadedHabits, filter);
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  // Load habits when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [])
  );

  // Apply filter when filter changes
  useEffect(() => {
    applyFilter(habits, filter);
  }, [filter]);

  const applyFilter = (habitList: Habit[], filterType: FilterType) => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (filterType) {
      case 'today':
        setFilteredHabits(
          habitList.filter(habit => 
            habit.frequency === 'daily' ||
            (habit.frequency === 'weekly' && 
              new Date().getDay() === new Date(habit.createdAt).getDay())
          )
        );
        break;
      case 'completed':
        setFilteredHabits(
          habitList.filter(habit => 
            habit.completedDates.includes(today)
          )
        );
        break;
      case 'all':
      default:
        setFilteredHabits(habitList);
        break;
    }
  };

  const isHabitCompletedToday = (habit: Habit): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDates.includes(today);
  };

  const handleToggleComplete = async (habit: Habit) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const updatedHabits = habits.map(h => {
        if (h.id === habit.id) {
          const completedDates = [...h.completedDates];
          
          // If already completed today, remove it; otherwise, add it
          const dateIndex = completedDates.indexOf(today);
          if (dateIndex >= 0) {
            completedDates.splice(dateIndex, 1);
          } else {
            completedDates.push(today);
          }
          
          return { ...h, completedDates };
        }
        return h;
      });
      
      await saveHabits(updatedHabits);
      setHabits(updatedHabits);
      applyFilter(updatedHabits, filter);
    } catch (error) {
      console.error('Error toggling habit completion:', error);
    }
  };

  const handleAddHabit = () => {
    navigation.navigate('Create Habit');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  // Add logout button to header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#4CAF50" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterOption, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterOption, filter === 'today' && styles.activeFilter]}
          onPress={() => setFilter('today')}
        >
          <Text style={[styles.filterText, filter === 'today' && styles.activeFilterText]}>
            Today
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterOption, filter === 'completed' && styles.activeFilter]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[styles.filterText, filter === 'completed' && styles.activeFilterText]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>
      
      {filteredHabits.length > 0 ? (
        <FlatList
          data={filteredHabits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HabitItem
              habit={item}
              onToggleComplete={() => handleToggleComplete(item)}
              isCompletedToday={isHabitCompletedToday(item)}
            />
          )}
          contentContainerStyle={styles.habitList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {filter === 'all' 
              ? "You don't have any habits yet"
              : filter === 'today'
              ? "No habits scheduled for today"
              : "No completed habits today"}
          </Text>
          {filter === 'all' && (
            <TouchableOpacity style={styles.addButton} onPress={handleAddHabit}>
              <Text style={styles.addButtonText}>Add your first habit</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      <TouchableOpacity style={styles.fab} onPress={handleAddHabit}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeFilter: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  filterText: {
    fontSize: 16,
    color: '#666',
  },
  activeFilterText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  habitList: {
    paddingBottom: 80, // Space for FAB
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  logoutButton: {
    marginRight: 16,
  },
});

export default HabitListScreen;