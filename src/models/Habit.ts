// src/models/Habit.ts

export interface HabitCompletion {
    date: string; // ISO date string
    completed: boolean;
  }
  
  export interface Habit {
    id: string;
    title: string;
    description?: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
    customFrequency?: string;
    goal?: number;
    unit?: string;
    color?: string;
    icon?: string;
    createdAt: string;
    completions: any[];
    reminderTime?: string;
    category?: string;
    completedDates: string[]; 
  }