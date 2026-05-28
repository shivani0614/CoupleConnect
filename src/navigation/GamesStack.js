import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/* MAIN HUB */
import GamesScreen from '../screens/GamesScreen';

/* GAME SCREENS */
import RaceGameScreen from '../screens/games/RaceGameScreen';
import QuizGameScreen from '../screens/games/QuizGameScreen';
import MemoryGameScreen from '../screens/games/MemoryGameScreen';

const Stack = createNativeStackNavigator();

export default function GamesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: {
          backgroundColor: '#05060a',
        },
      }}
    >
      {/* GAME HUB */}
      <Stack.Screen
        name="GamesHome"
        component={GamesScreen}
      />

      {/* RACE GAME */}
      <Stack.Screen
        name="RaceGame"
        component={RaceGameScreen}
      />

      {/* QUIZ GAME */}
      <Stack.Screen
        name="QuizGame"
        component={QuizGameScreen}
      />

      {/* MEMORY GAME */}
      <Stack.Screen
        name="MemoryGame"
        component={MemoryGameScreen}
      />
    </Stack.Navigator>
  );
}