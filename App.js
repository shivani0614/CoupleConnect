import React from 'react';
import { View, ActivityIndicator, Text, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RootNavigator from './src/navigation/RootNavigator';
import LoginScreen from './src/screens/LoginScreen';
import LandingScreen from './src/screens/LandingScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CoupleProvider } from './src/context/CoupleContext';
import { ProfileProvider } from './src/context/ProfileContext';

const Stack = createStackNavigator();

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
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Landing">
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <ProfileProvider>
    <CoupleProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <RootNavigator />
      </NavigationContainer>
    </CoupleProvider>
    </ProfileProvider>
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
