import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import LoginScreen from './src/screens/LoginScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CoupleProvider } from './src/context/CoupleContext';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAF7F5' }}>
        <ActivityIndicator size="large" color="#C0394B" />
        <Text style={{ marginTop: 16, color: '#6B5B65' }}>Restoring your session...</Text>
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <CoupleProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <RootNavigator />
      </NavigationContainer>
    </CoupleProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
