import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import useGameLoop from '../gameEngine/useGameLoop';

const { width } = Dimensions.get('window');
const FINISH = width - 120;

export default function RaceGameScreen() {
  const [running, setRunning] = useState(true);
  const [winner, setWinner] = useState(null);

  const p1 = useRef(new Animated.Value(0)).current;
  const p2 = useRef(new Animated.Value(0)).current;

  const v1 = useRef(0);
  const v2 = useRef(0);

  const gameOver = useRef(false);

  const update = useCallback(() => {
    if (!running || gameOver.current) return;

    // friction
    v1.current *= 0.92;
    v2.current *= 0.92;

    let p1x = p1.__getValue() + v1.current;
    let p2x = p2.__getValue() + v2.current;

    p1x = Math.max(0, Math.min(FINISH, p1x));
    p2x = Math.max(0, Math.min(FINISH, p2x));

    p1.setValue(p1x);
    p2.setValue(p2x);

    if (p1x >= FINISH && !gameOver.current) {
      gameOver.current = true;
      setWinner('Player 1 Wins');
    }

    if (p2x >= FINISH && !gameOver.current) {
      gameOver.current = true;
      setWinner('Player 2 Wins');
    }
  }, [running]);

  useGameLoop(update, running);

  const boost = (player) => {
    if (gameOver.current) return;

    const power = 2 + Math.random() * 3;

    if (player === 1) v1.current += power;
    else v2.current += power;
  };

  const reset = () => {
    gameOver.current = false;
    setWinner(null);
    v1.current = 0;
    v2.current = 0;
    p1.setValue(0);
    p2.setValue(0);
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>RACE ARENA</Text>

      <View style={styles.track}>
        <View style={styles.finish} />

        <Animated.View style={[styles.car1, { left: p1 }]}>
          <Text style={styles.text}>A</Text>
        </Animated.View>

        <Animated.View style={[styles.car2, { left: p2 }]}>
          <Text style={styles.text}>B</Text>
        </Animated.View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={() => boost(1)} style={styles.btn}>
          <Text style={styles.btnText}>BOOST A</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => boost(2)} style={styles.btn}>
          <Text style={styles.btnText}>BOOST B</Text>
        </TouchableOpacity>
      </View>

      {winner && (
        <View style={styles.win}>
          <Text style={styles.winText}>{winner}</Text>
          <TouchableOpacity onPress={reset} style={styles.reset}>
            <Text style={{ color: '#fff' }}>RESTART</Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f', paddingTop: 60 },
  title: { color: '#fff', fontSize: 22, textAlign: 'center', marginBottom: 20 },

  track: {
    height: 180,
    margin: 20,
    borderRadius: 12,
    backgroundColor: '#1a1a2a',
    justifyContent: 'center',
  },

  finish: {
    position: 'absolute',
    right: 30,
    width: 4,
    height: '100%',
    backgroundColor: '#fff',
  },

  car1: {
    position: 'absolute',
    top: 50,
    backgroundColor: '#ff4757',
    padding: 10,
    borderRadius: 8,
  },

  car2: {
    position: 'absolute',
    top: 110,
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 8,
  },

  text: { color: '#fff', fontWeight: '700' },

  controls: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },

  btn: {
    backgroundColor: '#2f3542',
    padding: 12,
    borderRadius: 10,
  },

  btnText: { color: '#fff', fontWeight: '700' },

  win: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 12,
  },

  winText: { color: '#fff', fontSize: 20, marginBottom: 10 },

  reset: { backgroundColor: '#ff4757', padding: 10, borderRadius: 8 },
});