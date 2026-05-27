// src/navigation/RootNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOW } from '../theme';
import SavingsTracker from '../screens/SavingsTracker';
import GamesScreen    from '../screens/GamesScreen';

import HomeScreen      from '../screens/HomeScreen';
import TasksScreen     from '../screens/TasksScreen';
import DatesScreen     from '../screens/DatesScreen';
import ChatScreen      from '../screens/ChatScreen';
import UsScreen        from '../screens/UsScreen';
import ProfileScreen   from '../screens/ProfileScreen';
import AdminScreen     from '../screens/AdminScreen';
import HashtagScreen from '../screens/HashtagScreen';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Home',  label: 'Home',  icon: 'home-outline',         screen: HomeScreen  },
  { name: 'Games', label: 'Games', icon: 'cards-heart-outline',  screen: GamesScreen },
  { name: 'Tasks', label: 'Tasks', icon: 'clipboard-text-outline', screen: TasksScreen },
  { name: 'Dates', label: 'Dates', icon: 'calendar-month-outline', screen: DatesScreen },
  { name: 'Chat',  label: 'Chat',  icon: 'chat-outline',          screen: ChatScreen  },
  { name: 'Us', label: 'Profile', icon: 'account-circle-outline', screen: ProfileScreen },
  { name: 'Hashtags', label: 'Hashtags', icon: 'tag-outline', screen: HashtagScreen },
];

function TabIcon({ icon, label, focused }) {
  return (
    <View style={styles.tabItem}>
      <MaterialCommunityIcons
        name={icon}
        size={22}
        color={focused ? COLORS.rose : COLORS.subtle}
        style={styles.tabIcon}
      />
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
    </View>
  );
}

export default function RootNavigator() {
  const { user } = useAuth();
  const tabs = [...TABS];

  if (user?.isAdmin) {
    tabs.push({
      name: 'Admin',
      label: 'Admin',
      icon: 'shield-account-outline',
      screen: AdminScreen,
    });
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      {tabs.map(({ name, label, icon, screen }) => (
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
