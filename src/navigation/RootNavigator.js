// src/navigation/RootNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { COLORS, SHADOW } from '../theme';import SavingsTracker from '../screens/SavingsTracker';


import HomeScreen      from '../screens/HomeScreen';
import TasksScreen     from '../screens/TasksScreen';
import DatesScreen     from '../screens/DatesScreen';
import ChatScreen      from '../screens/ChatScreen';
import UsScreen        from '../screens/UsScreen';

const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Home',  label: 'Home',  icon: '🏠', screen: HomeScreen  },
  { name: 'Tasks', label: 'Tasks', icon: '✅', screen: TasksScreen },
  { name: 'Dates', label: 'Dates', icon: '📅', screen: DatesScreen },
  { name: 'Chat',  label: 'Chat',  icon: '💬', screen: ChatScreen  },
  { name: 'Us',    label: 'Us',    icon: '❤️', screen: UsScreen    },
];

function TabIcon({ icon, label, focused }) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{icon}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
    </View>
  );
}

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      {TABS.map(({ name, label, icon, screen }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={screen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon icon={icon} label={label} focused={focused} />
            ),
          }}
        />
        
      ))}
      <Tab.Screen name="Savings" component={SavingsTracker} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor:  COLORS.border,
    borderTopWidth:  1,
    height: Platform.OS === 'ios' ? 82 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    ...SHADOW.md,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.45,
  },
  tabIconFocused: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: COLORS.subtle,
    fontWeight: '400',
  },
  tabLabelFocused: {
    color: COLORS.rose,
    fontWeight: '600',
  },
});
