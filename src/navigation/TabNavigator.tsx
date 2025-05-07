import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import HabitListScreen from '../screens/HabitListScreen';
import CreateHabitScreen from '../screens/CreateHabitScreen';
import ProgressScreen from '../screens/ProgressScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HabitStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="My Habits" component={HabitListScreen} />
      <Stack.Screen name="Create Habit" component={CreateHabitScreen} />
    </Stack.Navigator>
  );
};

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: RouteProp<ParamListBase, string> }) => ({
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          let iconName: string = '';

          if (route.name === 'Habits') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Create') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Habits"
        component={HabitStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Create" component={CreateHabitScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;