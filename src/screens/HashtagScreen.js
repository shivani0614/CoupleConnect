import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePartner } from '../hooks/usePartner';

const { width, height } = Dimensions.get('window');

const COLS = 3;
const COL_WIDTH = width / COLS;

/* ---------------- COLORS ---------------- */

const colors = [
  '#ff6b6b',
  '#feca57',
  '#48dbfb',
  '#1dd1a1',
  '#5f27cd',
  '#ff9ff3',
  '#54a0ff',
  '#ff9f43',
];

const pickColor = () =>
  colors[Math.floor(Math.random() * colors.length)];

/* ---------------- CLEAN ---------------- */

const clean = (str = '') =>
  str.toLowerCase().replace(/[^a-z]/g, '');

/* ---------------- SYLLABLES ---------------- */

const syllables = [
  'ra','shi','vi','na','ga','thu','sha','ka','lu','mi',
  'di','ya','su','thi','lo','re','pa','ta','ne','ka'
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ---------------- UNIQUE ---------------- */

const used = new Set();

const makeTag = (a, b) => {
  const baseA = clean(a);
  const baseB = clean(b);

  const patterns = [
    `${baseA}${baseB}`,
    `${baseB}${baseA}`,
    `${baseA}x${baseB}`,
    `${baseA}and${baseB}`,
    `forever${baseA}${baseB}`,
    `love${baseA}${baseB}`,
    `${baseA}${pick(syllables)}${baseB}`,
    `${pick(syllables)}${baseA}${pick(syllables)}${baseB}`,
  ];

  let tag = '#' + pick(patterns);

  while (used.has(tag)) {
    tag = '#' + pick(patterns) + Math.floor(Math.random() * 9999);
  }

  used.add(tag);
  return tag;
};

/* ---------------- GENERATE LANE ---------------- */

const generateLane = (a, b, count = 90) => {
  const list = [];
  for (let i = 0; i < count; i++) {
    list.push({
      text: makeTag(a, b),
      color: pickColor(),
    });
  }
  return list;
};

/* ---------------- FLOATING TAG ---------------- */

const FloatingTag = ({ text, color, laneIndex }) => {
  const anim = useRef(new Animated.Value(0)).current;
  const [hover, setHover] = useState(false);

  const baseX =
    laneIndex * COL_WIDTH +
    10 +
    Math.random() * (COL_WIDTH - 90);

  const baseY = Math.random() * (height * 0.85);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 3500 + Math.random() * 2000,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 3500 + Math.random() * 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [baseY, baseY - 30],
  });

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [baseX, baseX + 10],
  });

  return (
    <View style={{ position: 'absolute' }}>

      {/* POPUP PREVIEW */}
      {hover && (
        <View style={styles.popup}>
          <Text style={styles.popupText}>{text}</Text>
        </View>
      )}

      <Animated.View
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onTouchStart={() => setHover(true)}
        onTouchEnd={() => setHover(false)}
        style={[
          styles.tag,
          {
            backgroundColor: color,
            transform: [{ translateX }, { translateY }],
          },
        ]}
      >
        <Text style={styles.text}>{text}</Text>
      </Animated.View>

    </View>
  );
};

/* ---------------- SCREEN ---------------- */

export default function HashtagUniverseScreen() {
  const { myName, partnerName } = usePartner();

  const [left, setLeft] = useState([]);
  const [middle, setMiddle] = useState([]);
  const [right, setRight] = useState([]);

  const generate = () => {
    used.clear();

    const a = myName || 'shivani';
    const b = partnerName || 'goutham';

    setLeft(generateLane('shivani', a));
    setMiddle(generateLane(a, b));
    setRight(generateLane('goutham', b));
  };

  useEffect(() => {
    generate();
  }, [myName, partnerName]);

  return (
    <LinearGradient colors={['#0d0a14', '#1A0A1E']} style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Name Universe</Text>

        <TouchableOpacity onPress={generate} style={styles.btn}>
          <Text style={styles.btnText}>Regenerate</Text>
        </TouchableOpacity>
      </View>

      {/* LABELS */}
      <View style={styles.labels}>
        <Text style={styles.label}>Shivani</Text>
        <Text style={styles.label}>Couple</Text>
        <Text style={styles.label}>Goutham</Text>
      </View>

      {/* CANVAS */}
      <View style={styles.canvas}>
        {left.map((t, i) => (
          <FloatingTag
            key={`l${i}`}
            text={t.text}
            color={t.color}
            laneIndex={0}
          />
        ))}

        {middle.map((t, i) => (
          <FloatingTag
            key={`m${i}`}
            text={t.text}
            color={t.color}
            laneIndex={1}
          />
        ))}

        {right.map((t, i) => (
          <FloatingTag
            key={`r${i}`}
            text={t.text}
            color={t.color}
            laneIndex={2}
          />
        ))}
      </View>

    </LinearGradient>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  btn: {
    backgroundColor: '#C0394B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  btnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  labels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 10,
  },

  label: {
    color: '#aaa',
    fontSize: 12,
  },

  canvas: {
    flex: 1,
    position: 'relative',
  },

  tag: {
    position: 'absolute',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
  },

  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  /* POPUP */
  popup: {
    position: 'absolute',
    bottom: 55,
    left: -40,
    minWidth: 140,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    zIndex: 9999,
    alignItems: 'center',
  },

  popupText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});