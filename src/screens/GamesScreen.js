import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

/* ---------------- GAMES ---------------- */

const GAMES = [
  {
    id: 'race',
    title: 'Couple Race',
    subtitle: 'Sprint battle with physics engine',
    screen: 'RaceGame',
    color: '#C0394B',
  },
  {
    id: 'quiz',
    title: 'Love Quiz',
    subtitle: 'Test your connection',
    screen: 'QuizGame',
    color: '#4B7BEC',
  },
  {
    id: 'memory',
    title: 'Memory Lane',
    subtitle: 'Relive your story',
    screen: 'MemoryGame',
    color: '#27AE60',
  },
];

/* ---------------- GAME CARD ---------------- */

function GameCard({ item, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const rotateX = useRef(new Animated.Value(0)).current;
  const rotateY = useRef(new Animated.Value(0)).current;

  const animatedStyle = {
    transform: [
      { perspective: 1000 },
      {
        rotateX: rotateX.interpolate({
          inputRange: [-1, 1],
          outputRange: ['10deg', '-10deg'],
        }),
      },
      {
        rotateY: rotateY.interpolate({
          inputRange: [-1, 1],
          outputRange: ['-10deg', '10deg'],
        }),
      },
      { scale },
    ],
  };

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 1.08,
      useNativeDriver: true,
    }).start();

    Animated.timing(rotateX, {
      toValue: -1,
      duration: 120,
      useNativeDriver: true,
    }).start();

    Animated.timing(rotateY, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    Animated.timing(rotateX, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start();

    Animated.timing(rotateY, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    onPress?.();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={pressIn}
      onPressOut={pressOut}
      onPress={handlePress}
    >
      <Animated.View
        style={[
          styles.card,
          animatedStyle,
          { borderColor: item.color },
        ]}
      >
        <View style={[styles.glow, { backgroundColor: item.color }]} />

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>

        <Text style={styles.play}>START GAME ▶</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

/* ---------------- MAIN SCREEN ---------------- */

export default function GamesScreen() {
  const navigation = useNavigation();

  const launchGame = (screen) => {
    // PS5 STYLE CINEMATIC DELAY
    requestAnimationFrame(() => {
      setTimeout(() => {
        navigation.navigate(screen);
      }, 280);
    });
  };

  return (
    <LinearGradient colors={['#05060a', '#1a0a1e']} style={styles.container}>

      {/* HEADER */}
      <Text style={styles.header}>GAME LIBRARY</Text>
      <Text style={styles.subHeader}>Choose your battle</Text>

      {/* GAME LIST */}
      <FlatList
        data={GAMES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <GameCard
            item={item}
            onPress={() => launchGame(item.screen)}
          />
        )}
      />

    </LinearGradient>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },

  header: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '900',
    paddingHorizontal: 20,
    letterSpacing: 2,
  },

  subHeader: {
    color: '#aaa',
    fontSize: 12,
    paddingHorizontal: 20,
    marginBottom: 18,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },

  card: {
    width: width - 40,
    height: 150,
    marginBottom: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    padding: 18,
    justifyContent: 'center',
  },

  glow: {
    position: 'absolute',
    left: 0,
    width: 6,
    height: '100%',
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },

  subtitle: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 6,
  },

  play: {
    color: '#fff',
    marginTop: 12,
    fontWeight: '700',
    opacity: 0.8,
    fontSize: 11,
  },
});