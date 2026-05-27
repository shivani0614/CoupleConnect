import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePartner } from '../hooks/usePartner';

const { width, height } = Dimensions.get('window');

/* ---------- helpers ---------- */

const clean = (str = '') =>
  str.toLowerCase().replace(/[^a-z]/g, '');

const splitName = (name) => {
  const c = clean(name);
  const mid = Math.floor(c.length / 2);
  return [c.slice(0, mid), c.slice(mid)];
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ---------- generator ---------- */

const generateHashtags = (a, b) => {
  const aParts = splitName(a);
  const bParts = splitName(b);

  const pool = [
    `#${a}${b}`,
    `#${b}${a}`,
    `#${a}and${b}`,
    `#forever${a}${b}`,
    `#team${a}${b}`,
    `#${a}x${b}`,
    `#${aParts[0]}${bParts[1]}`,
    `#${bParts[0]}${aParts[1]}`,
  ];

  const extra = [];
  for (let i = 0; i < 30; i++) {
    const x = pick(aParts);
    const y = pick(bParts);
    extra.push(`#${x}${y}`);
  }

  return [...pool, ...extra];
};

/* ---------- FLOATING TAG ---------- */

const FloatingTag = ({ text, index }) => {
  const anim = useRef(new Animated.Value(0)).current;
  const floatX = useRef(new Animated.Value(0)).current;

  const startX = Math.random() * (width - 80);
  const startY = Math.random() * (height * 0.6);

  useEffect(() => {
    // vertical slow float (up & down loop)
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 3000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 3000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // slight horizontal drift
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatX, {
          toValue: 1,
          duration: 4000 + Math.random() * 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatX, {
          toValue: 0,
          duration: 4000 + Math.random() * 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [startY, startY - 20], // gentle float up/down
  });

  const translateX = floatX.interpolate({
    inputRange: [0, 1],
    outputRange: [startX, startX + 10], // tiny side drift
  });

  const opacity = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.7, 1, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.tag,
        {
          transform: [{ translateX }, { translateY }],
          opacity,
        },
      ]}
    >
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
};

/* ---------- SCREEN ---------- */

export default function HashtagScreen() {
  const { myName, partnerName } = usePartner();
  const [tags, setTags] = useState([]);

  const generate = () => {
    const list = generateHashtags(myName || 'love', partnerName || 'you');
    const shuffled = list.sort(() => 0.5 - Math.random()).slice(0, 25);
    setTags(shuffled);
  };

  useEffect(() => {
    generate();
  }, [myName, partnerName]);

  return (
    <LinearGradient colors={['#0d0a14', '#1A0A1E']} style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Hashtag Generator</Text>

        <TouchableOpacity onPress={generate} style={styles.btn}>
          <Text style={styles.btnText}>Generate</Text>
        </TouchableOpacity>
      </View>

      {/* FLOATING AREA */}
      <View style={styles.canvas}>
        {tags.map((t, i) => (
          <FloatingTag key={`${t}-${i}`} text={t} index={i} />
        ))}
      </View>

    </LinearGradient>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  btn: {
    backgroundColor: '#C0394B',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  btnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  canvas: {
    flex: 1,
  },

  tag: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  text: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});