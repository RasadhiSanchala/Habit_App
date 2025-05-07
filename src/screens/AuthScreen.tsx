// src/screens/AuthScreen.tsx
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

enum AuthMode {
  LOGIN,
  REGISTER,
}

const AuthScreen: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.LOGIN);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login, register } = useContext(AuthContext);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (authMode === AuthMode.REGISTER && !name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (authMode === AuthMode.REGISTER && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const userData = { name, email, password };

    if (authMode === AuthMode.LOGIN) {
      await login(userData);
    } else {
      await register(userData);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === AuthMode.LOGIN ? AuthMode.REGISTER : AuthMode.LOGIN);
    setErrors({});
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            {authMode === AuthMode.LOGIN ? 'Welcome Back!' : 'Create Account'}
          </Text>
          <Text style={styles.subtitle}>
            {authMode === AuthMode.LOGIN
              ? 'Log in to track your habits'
              : 'Register to start building better habits'}
          </Text>

          {authMode === AuthMode.REGISTER && (
            <Input
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              error={errors.name}
            />
          )}

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="your.email@example.com"
            keyboardType="email-address"
            error={errors.email}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            error={errors.password}
          />

          {authMode === AuthMode.REGISTER && (
            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              secureTextEntry
              error={errors.confirmPassword}
            />
          )}

          <Button
            title={authMode === AuthMode.LOGIN ? 'Login' : 'Register'}
            onPress={handleSubmit}
          />

          <TouchableOpacity onPress={toggleAuthMode} style={styles.toggleLink}>
            <Text style={styles.toggleText}>
              {authMode === AuthMode.LOGIN
                ? "Don't have an account? Register"
                : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
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
    justifyContent: 'center',
  },
  formContainer: {
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#4CAF50',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  toggleLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleText: {
    color: '#4CAF50',
    fontSize: 16,
  },
});

export default AuthScreen;