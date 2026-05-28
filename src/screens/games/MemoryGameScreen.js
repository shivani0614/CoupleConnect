// src/screens/games/MemoryGameScreen.js

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  Modal,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

/* ====================================================== */
/* TAROT MEMORY GENERATOR */
/* ====================================================== */

const TITLES = [
  'The First Glance',
  'Moonlit Call',
  'The Heart Sync',
  'The Jealousy Arc',
  'The Midnight Laugh',
  'The Destiny Thread',
  'The Rain Memory',
  'The Warm Hug',
  'The Secret Smile',
  'The Chaos Bond',
  'The Soul Mirror',
  'The Obsession',
  'The Protective One',
  'The Late Night',
  'The Forever Scene',
];

const MEMORIES = [
  'You both stayed awake till sunrise talking about life.',
  'One small moment suddenly became unforgettable.',
  'You both laughed so hard that nothing else mattered.',
  'A random conversation turned into emotional comfort.',
  'One stare felt louder than a thousand words.',
  'The silence between you felt peaceful and safe.',
  'A tiny fight ended in the sweetest apology.',
  'That memory still feels cinematic.',
  'Everything around disappeared in that moment.',
  'One hug fixed an entire bad day.',
  'The chemistry felt unreal.',
  'That moment changed the relationship forever.',
];

const AURAS = [
  '#C0394B',
  '#9B59B6',
  '#4B7BEC',
  '#E67E22',
  '#27AE60',
  '#E84393',
];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateCards(count = 12) {
  const used = new Set();
  const cards = [];

  while (cards.length < count) {
    const title = random(TITLES);
    const text = random(MEMORIES);

    const key = title + text;

    if (!used.has(key)) {
      used.add(key);

      cards.push({
        title,
        text,
        aura: random(AURAS),
      });
    }
  }

  return cards;
}

/* ====================================================== */
/* PARTICLES */
/* ====================================================== */

function Particle() {
  const anim = useRef(new Animated.Value(0)).current;

  const startX = Math.random() * width;
  const size = Math.random() * 3 + 2;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 8000 + Math.random() * 4000,
          useNativeDriver: true,
        }),

        Animated.timing(anim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [height + 100, -100],
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: startX,
          width: size,
          height: size,
          transform: [{ translateY }],
        },
      ]}
    />
  );
}

/* ====================================================== */
/* TAROT CARD */
/* ====================================================== */

function TarotCard({ item, index, onReveal }) {
  const rotate = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),

        Animated.timing(glow, {
          toValue: 0.3,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const onPressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1.06,
        useNativeDriver: true,
      }),

      Animated.timing(rotate, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onPressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),

      Animated.timing(rotate, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const rotateY = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '8deg'],
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => onReveal(item)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View
        style={[
          styles.card,
          {
            borderColor: item.aura,
            opacity: glow,
            transform: [
              { perspective: 1000 },
              { rotateY },
              { scale },
            ],
          },
        ]}
      >

        {/* GLOW */}
        <View
          style={[
            styles.glow,
            { backgroundColor: item.aura },
          ]}
        />

        <Text style={styles.symbol}>
          ✦
        </Text>

        <Text style={styles.cardTitle}>
          {item.title}
        </Text>

        <Text style={styles.tap}>
          TAP TO REVEAL
        </Text>

      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

/* ====================================================== */
/* MAIN SCREEN */
/* ====================================================== */

export default function MemoryGameScreen() {
  const [cards, setCards] = useState(generateCards());
  const [selected, setSelected] = useState(null);

  const revealCard = (card) => {
    setSelected(card);
  };

  return (
    <LinearGradient
      colors={['#04040A', '#0A0A14', '#1A0A1E']}
      style={styles.container}
    >

      {/* PARTICLES */}
      {Array.from({ length: 45 }).map((_, i) => (
        <Particle key={i} />
      ))}

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>
          MEMORY TAROT
        </Text>

        <Text style={styles.subtitle}>
          Reveal your relationship destiny
        </Text>
      </View>

      {/* CARD GRID */}
      <View style={styles.grid}>
        {cards.map((item, index) => (
          <TarotCard
            key={index}
            item={item}
            index={index}
            onReveal={revealCard}
          />
        ))}
      </View>

      {/* MODAL */}
      <Modal
        visible={!!selected}
        transparent
        animationType="fade"
      >
        <View style={styles.modalWrap}>

          <Animated.View
            style={[
              styles.modalCard,
              {
                borderColor: selected?.aura || '#fff',
              },
            ]}
          >

            <View
              style={[
                styles.modalGlow,
                {
                  backgroundColor:
                    selected?.aura || '#fff',
                },
              ]}
            />

            <Text style={styles.modalSymbol}>
              ✦
            </Text>

            <Text style={styles.modalTitle}>
              {selected?.title}
            </Text>

            <Text style={styles.modalText}>
              {selected?.text}
            </Text>

            <TouchableWithoutFeedback
              onPress={() => setSelected(null)}
            >
              <View style={styles.closeBtn}>
                <Text style={styles.closeText}>
                  CLOSE
                </Text>
              </View>
            </TouchableWithoutFeedback>

          </Animated.View>

        </View>
      </Modal>

    </LinearGradient>
  );
}

/* ====================================================== */
/* STYLES */
/* ====================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },

  header: {
    alignItems: 'center',
    marginBottom: 30,
  },

  title: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 3,
  },

  subtitle: {
    color: '#999',
    marginTop: 8,
    fontSize: 12,
    letterSpacing: 1,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  card: {
    width: width / 2 - 24,
    height: 240,
    margin: 8,
    borderRadius: 28,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  glow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 999,
    opacity: 0.15,
  },

  symbol: {
    color: '#fff',
    fontSize: 42,
    marginBottom: 20,
  },

  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    paddingHorizontal: 10,
  },

  tap: {
    color: '#aaa',
    marginTop: 18,
    fontSize: 10,
    letterSpacing: 2,
  },

  modalWrap: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalCard: {
    width: width - 40,
    borderRadius: 32,
    padding: 30,
    borderWidth: 1,
    backgroundColor: '#0B1020',
    overflow: 'hidden',
  },

  modalGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 999,
    opacity: 0.1,
    top: -80,
    right: -80,
  },

  modalSymbol: {
    color: '#fff',
    fontSize: 56,
    textAlign: 'center',
    marginBottom: 20,
  },

  modalTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 20,
  },

  modalText: {
    color: '#ddd',
    fontSize: 18,
    lineHeight: 32,
    textAlign: 'center',
  },

  closeBtn: {
    marginTop: 30,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },

  closeText: {
    color: '#000',
    fontWeight: '900',
    letterSpacing: 1,
  },

  particle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});