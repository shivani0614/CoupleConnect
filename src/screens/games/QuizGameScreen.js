// src/screens/games/QuizGameScreen.js

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

/* ====================================================== */
/* AI-LIKE DYNAMIC QUESTION GENERATOR */
/* ====================================================== */

const PEOPLE = ['Shivani', 'Goutham'];

const OPENERS = [
  'Who',
  'Which person',
  'Who among you',
  'Who secretly',
  'Who usually',
];

const ACTIONS = [
  'gets jealous faster',
  'falls asleep first',
  'takes longer to reply',
  'starts arguments more',
  'is more romantic',
  'is more emotional',
  'gets angry first',
  'acts more cute',
  'misses the other more',
  'is more dramatic',
  'takes more selfies',
  'gets hungry faster',
  'is more possessive',
  'overthinks more',
  'would survive a zombie apocalypse',
  'would win in an argument',
  'would cry first in a sad movie',
  'is secretly more obsessed',
  'is more addicted to their phone',
  'is more protective',
  'would spend more money',
  'is more stubborn',
  'would flirt more',
  'would forget anniversaries',
  'would get lost while travelling',
  'would get ready slower',
  'would spoil the other more',
  'would panic first in danger',
  'would text first after a fight',
  'would become famous first',
];

const ENDINGS = [
  '?',
  ' honestly?',
  ' most of the time?',
  ' according to your love story?',
  ' in real life?',
  ' secretly?',
];

/* ====================================================== */
/* RANDOM HELPERS */
/* ====================================================== */

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

/* ====================================================== */
/* QUESTION GENERATOR */
/* ====================================================== */

function generateDynamicQuestion() {
  const opener = random(OPENERS);
  const action = random(ACTIONS);
  const ending = random(ENDINGS);

  const answer = random(PEOPLE);

  return {
    question: `${opener} ${action}${ending}`,
    options: PEOPLE,
    answer,
  };
}

/* ====================================================== */
/* GENERATE ENTIRE QUIZ */
/* ====================================================== */

function generateQuiz(total = 10) {
  const used = new Set();
  const questions = [];

  while (questions.length < total) {
    const q = generateDynamicQuestion();

    if (!used.has(q.question)) {
      used.add(q.question);
      questions.push(q);
    }
  }

  return questions;
}

/* ====================================================== */
/* PARTICLES */
/* ====================================================== */

function FloatingParticle({ delay }) {
  const anim = useRef(new Animated.Value(0)).current;

  const startX = Math.random() * width;
  const size = Math.random() * 4 + 2;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 7000 + delay,
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
/* MAIN SCREEN */
/* ====================================================== */

export default function QuizGameScreen() {
  const [questions, setQuestions] = useState(
    generateQuiz(10)
  );

  const [current, setCurrent] = useState(0);

  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  const [winner, setWinner] = useState(null);

  const cardScale = useRef(new Animated.Value(0.92)).current;
  const glow = useRef(new Animated.Value(0.5)).current;

  const q = questions[current];

  /* ====================================================== */
  /* CARD ANIMATION */
  /* ====================================================== */

  useEffect(() => {
    cardScale.setValue(0.92);

    Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),

      Animated.loop(
        Animated.sequence([
          Animated.timing(glow, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),

          Animated.timing(glow, {
            toValue: 0.5,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, [current]);

  /* ====================================================== */
  /* ANSWER */
  /* ====================================================== */

  const answer = (option) => {
    if (winner) return;

    const correct = q.answer === option;

    if (correct) {
      if (option === 'Shivani') {
        setScoreA((s) => s + 1);
      } else {
        setScoreB((s) => s + 1);
      }
    }

    setTimeout(() => {
      if (current + 1 >= questions.length) {
        finishGame();
      } else {
        setCurrent((c) => c + 1);
      }
    }, 600);
  };

  /* ====================================================== */
  /* FINISH */
  /* ====================================================== */

  const finishGame = () => {
    if (scoreA > scoreB) {
      setWinner('Shivani Wins');
    } else if (scoreB > scoreA) {
      setWinner('Goutham Wins');
    } else {
      setWinner('Draw Match');
    }
  };

  /* ====================================================== */
  /* RESET */
  /* ====================================================== */

  const resetGame = () => {
    setQuestions(generateQuiz(10));

    setCurrent(0);
    setScoreA(0);
    setScoreB(0);
    setWinner(null);
  };

  /* ====================================================== */
  /* UI */
  /* ====================================================== */

  return (
    <LinearGradient
      colors={['#04040A', '#0B1020', '#1A0A1E']}
      style={styles.container}
    >

      {/* PARTICLES */}
      {Array.from({ length: 40 }).map((_, i) => (
        <FloatingParticle
          key={i}
          delay={i * 100}
        />
      ))}

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>
          LOVE QUIZ ARENA
        </Text>

        <Text style={styles.subtitle}>
          Dynamic AI-generated couple battle
        </Text>
      </View>

      {/* SCOREBOARD */}
      <View style={styles.scoreBoard}>

        <View style={styles.playerRed}>
          <Text style={styles.playerName}>
            SHIVANI
          </Text>

          <Text style={styles.score}>
            {scoreA}
          </Text>
        </View>

        <Text style={styles.vs}>
          VS
        </Text>

        <View style={styles.playerBlue}>
          <Text style={styles.playerName}>
            GOUTHAM
          </Text>

          <Text style={styles.score}>
            {scoreB}
          </Text>
        </View>

      </View>

      {/* QUESTION CARD */}
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale: cardScale }],
            opacity: glow,
          },
        ]}
      >

        <Text style={styles.questionCount}>
          QUESTION {current + 1} / {questions.length}
        </Text>

        <Text style={styles.question}>
          {q.question}
        </Text>

        {/* OPTIONS */}

        <TouchableOpacity
          style={styles.optionRed}
          onPress={() => answer('Shivani')}
        >
          <Text style={styles.optionText}>
            SHIVANI
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionBlue}
          onPress={() => answer('Goutham')}
        >
          <Text style={styles.optionText}>
            GOUTHAM
          </Text>
        </TouchableOpacity>

      </Animated.View>

      {/* WINNER OVERLAY */}
      {winner && (
        <View style={styles.overlay}>

          <Text style={styles.winner}>
            {winner}
          </Text>

          <TouchableOpacity
            style={styles.playAgain}
            onPress={resetGame}
          >
            <Text style={styles.playAgainText}>
              PLAY AGAIN
            </Text>
          </TouchableOpacity>

        </View>
      )}

    </LinearGradient>
  );
}

/* ====================================================== */
/* STYLES */
/* ====================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },

  header: {
    paddingTop: 60,
    alignItems: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 2,
  },

  subtitle: {
    color: '#999',
    marginTop: 8,
    fontSize: 12,
  },

  scoreBoard: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  playerRed: {
    width: 130,
    backgroundColor: '#C0394B',
    borderRadius: 24,
    padding: 18,
    alignItems: 'center',
  },

  playerBlue: {
    width: 130,
    backgroundColor: '#4B7BEC',
    borderRadius: 24,
    padding: 18,
    alignItems: 'center',
  },

  playerName: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },

  score: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '900',
    marginTop: 10,
  },

  vs: {
    color: '#fff',
    fontSize: 22,
    marginHorizontal: 20,
    fontWeight: '900',
  },

  card: {
    marginTop: 40,
    marginHorizontal: 20,
    padding: 28,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  questionCount: {
    color: '#888',
    fontSize: 11,
    marginBottom: 14,
    letterSpacing: 2,
  },

  question: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 40,
    marginBottom: 30,
  },

  optionRed: {
    backgroundColor: '#C0394B',
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 16,
  },

  optionBlue: {
    backgroundColor: '#4B7BEC',
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
  },

  optionText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.88)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  winner: {
    color: '#fff',
    fontSize: 44,
    fontWeight: '900',
    marginBottom: 24,
  },

  playAgain: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 20,
  },

  playAgainText: {
    fontWeight: '900',
    fontSize: 14,
  },

  particle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});