// src/screens/ProgressScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ProgressChart from '../components/ProgressChart';
import { getHabits } from '../services/storage';
import { Habit } from '../models/Habit';

interface WeeklyProgress {
  day: string;
  completed: number;
  total: number;
  percentage: number;
}

const ProgressScreen: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayProgress, setTodayProgress] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress[]>([]);

  const loadHabits = async () => {
    try {
      const loadedHabits = await getHabits();
      setHabits(loadedHabits);
      calculateProgress(loadedHabits);
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadHabits();
    }, [])
  );

  const calculateProgress = (habitList: Habit[]) => {
    // Calculate today's progress
    const today = new Date().toISOString().split('T')[0];
    const dailyHabits = habitList.filter(
      h => h.frequency === 'daily' || 
      (h.frequency === 'weekly' && new Date().getDay() === new Date(h.createdAt).getDay())
    );
    
    const completedToday = dailyHabits.filter(h => 
      h.completedDates.includes(today)
    ).length;
    
    const todayPercentage = dailyHabits.length > 0 
      ? (completedToday / dailyHabits.length) * 100 
      : 0;
    
    setTodayProgress(todayPercentage);

    // Calculate weekly progress
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekProgress: WeeklyProgress[] = [];
    
    // Get today's day index
    const todayIndex = new Date().getDay();
    
    // Calculate for the past 7 days
    for (let i = 6; i >= 0; i--) {
      const dayIndex = (todayIndex - i + 7) % 7;
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Get habits that should be tracked on this day
      const dayHabits = habitList.filter(h => 
        h.frequency === 'daily' || 
        (h.frequency === 'weekly' && dayIndex === new Date(h.createdAt).getDay())
      );
      
      // Count completed habits for this day
      const completedOnDay = dayHabits.filter(h => 
        h.completedDates.includes(dateString)
      ).length;
      
      const percentage = dayHabits.length > 0 
        ? (completedOnDay / dayHabits.length) * 100 
        : 0;
      
      weekProgress.push({
        day: days[dayIndex],
        completed: completedOnDay,
        total: dayHabits.length,
        percentage,
      });
    }
    
    setWeeklyProgress(weekProgress);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Progress</Text>
        <ProgressChart completedPercentage={todayProgress} />
        <Text style={styles.statsText}>
          {habits.length > 0 
            ? `You've completed ${todayProgress.toFixed(0)}% of your habits today!` 
            : "You don't have any habits to track yet."}
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Overview</Text>
        {weeklyProgress.map((day, index) => (
          <View key={index} style={styles.dayProgressContainer}>
            <Text style={styles.dayText}>{day.day}</Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${day.percentage}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {day.completed}/{day.total}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{habits.length}</Text>
            <Text style={styles.statLabel}>Total Habits</Text>
          </View>
          
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {habits.filter(h => h.frequency === 'daily').length}
            </Text>
            <Text style={styles.statLabel}>Daily Habits</Text>
          </View>
          
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {habits.filter(h => h.frequency === 'weekly').length}
            </Text>
            <Text style={styles.statLabel}>Weekly Habits</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4CAF50',
  },
  statsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    color: '#666',
  },
  dayProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayText: {
    width: 80,
    fontSize: 14,
    color: '#666',
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    width: 40,
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    margin: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default ProgressScreen;