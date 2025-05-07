// src/App.tsx
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { AuthProvider } from './contexts/AuthContext';
import AppNavigator from './navigation/AppNavigator';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
        <AppNavigator />
      </SafeAreaView>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;