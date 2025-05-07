// src/services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Habit } from '../models/Habit';

const STORAGE_KEYS = {
  USER: 'habit-tracker-user',
  HABITS: 'habit-tracker-habits',
};

export const saveUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const getUser = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const removeUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

export const saveHabits = async (habits: Habit[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  } catch (error) {
    console.error('Error saving habits:', error);
  }
};

export const getHabits = async (): Promise<Habit[]> => {
  try {
    const habitsData = await AsyncStorage.getItem(STORAGE_KEYS.HABITS);
    return habitsData ? JSON.parse(habitsData) : [];
  } catch (error) {
    console.error('Error getting habits:', error);
    return [];
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};