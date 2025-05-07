// src/navigation/AppNavigator.tsx
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../contexts/AuthContext';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const AppNavigator: React.FC = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;
