// src/screens/HomeScreen.js
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import { QUESTIONS, COUPLE } from '../data';
import { useCouple } from '../context/CoupleContext';
import {
  AppHeader, Card, SLabel, MoodChip, StatCard, PrimaryBtn, GhostBtn,
} from '../components/UI';

const MOODS = ['💑 In love', '😊 Happy', '🥺 Missing you', '😤 Stressed', '🎉 Excited', '💬 Need to talk'];

function daysUntil(date) {
  return Math.ceil((new Date(date) - new Date()) / 86400000);
}
function daysSince(date) {
  return Math.floor((new Date() - new Date(date)) / 86400000);
}

export default function HomeScreen() {
  const insets  = useSafeAreaInsets();
  const nav     = useNavigation();
  const { mood, setMood, sendHug, sendKiss, kisses } = useCouple();
  const [qIdx, setQIdx] = useState(0);

  const anniDays  = daysUntil(new Date(new Date(COUPLE.marriedSince).setFullYear(new Date().getFullYear())));
  const married   = daysSince(COUPLE.marriedSince);
  const visitDays = daysUntil(COUPLE.nextVisit);
  const years     = new Date().getFullYear() - COUPLE.marriedSince.getFullYear();

  return (
    <View style={styles.root}>
      <AppHeader
        name1={COUPLE.name1}
        name2={COUPLE.name2}
        subtitle={`Married · June 3, 2018 · ${years} years together`}
        rightLabel="Anniversary in"
        rightValue={`${anniDays} days`}
        pills={[
          { icon: '📍', text: `${COUPLE.distanceKm.toLocaleString()} km apart` },
          { icon: '🔥', text: `${COUPLE.streakDays} day streak` },
        ]}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90, paddingHorizontal: SPACING.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Mood */}
        <SLabel>How are you feeling today?</SLabel>
        <Card>
          <View style={styles.moodRow}>
            {MOODS.map(m => (
              <MoodChip key={m} label={m} selected={mood === m} onPress={() => setMood(m)} />
            ))}
          </View>
        </Card>

        {/* Anniversary */}
        <SLabel>Anniversary</SLabel>
        <Card style={styles.anniCard}>
          <View style={styles.anniRing}>
            <Text style={styles.anniNum}>{years}</Text>
            <Text style={styles.anniWord}>years</Text>
          </View>
          <Text style={styles.anniTitle}>Happy {years}th Anniversary soon! 🥂</Text>
          <Text style={styles.anniSub}>June 3rd · {anniDays} days away</Text>
          <View style={styles.divider} />
          <Text style={styles.marriedLbl}>Total days married</Text>
          <Text style={styles.marriedNum}>{married.toLocaleString()} days 💍</Text>
        </Card>

        {/* Tonight's Question */}
        <SLabel>Tonight's question</SLabel>
        <LinearGradient colors={['#FDF4EB', '#FFF8F0']} style={styles.questionCard}>
          <Text style={styles.questionTxt}>"{QUESTIONS[qIdx]}"</Text>
          <GhostBtn title="New question →" style={{ alignSelf: 'flex-start', marginTop: 10 }}
            onPress={() => setQIdx((qIdx + 1) % QUESTIONS.length)} />
        </LinearGradient>

        {/* Quick Connect */}
        <SLabel>Quick connect</SLabel>
        <View style={styles.connectRow}>
          <TouchableOpacity activeOpacity={0.8} style={styles.connectCard}
            onPress={() => { sendHug(); nav.navigate('Chat'); }}>
            <Text style={styles.connectIcon}>🤗</Text>
            <Text style={styles.connectName}>Send a hug</Text>
            <Text style={styles.connectSub}>Tap to send</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.connectCard}
            onPress={() => { sendKiss(); nav.navigate('Chat'); }}>
            <Text style={styles.connectIcon}>💋</Text>
            <Text style={styles.connectName}>Blow a kiss</Text>
            <Text style={styles.connectSub}>{kisses} sent today</Text>
          </TouchableOpacity>
        </View>

        {/* Countdown */}
        <SLabel>Next meet-up</SLabel>
        <Card style={styles.countdownCard}>
          <Text style={styles.countdownNum}>{visitDays}</Text>
          <Text style={styles.countdownLbl}>days until June 1st ✈️</Text>
          <Text style={styles.countdownSub}>Weekend getaway planned!</Text>
        </Card>

        {/* Stats */}
        <SLabel>Our stats</SLabel>
        <View style={styles.statsRow}>
          <StatCard value={`${married.toLocaleString()}`} label="Days married"   style={{ marginRight: 8 }} />
          <StatCard value={`${COUPLE.streakDays}`}        label="Day streak"     />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },

  moodRow: { flexDirection: 'row', flexWrap: 'wrap' },

  anniCard:    { alignItems: 'center' },
  anniRing: {
    width: 88, height: 88, borderRadius: 44,
    borderWidth: 3, borderColor: COLORS.gold,
    backgroundColor: COLORS.goldLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  anniNum:     { fontSize: 28, fontWeight: '700', color: COLORS.gold },
  anniWord:    { fontSize: 10, color: COLORS.muted },
  anniTitle:   { fontSize: 16, fontWeight: '600', color: COLORS.roseDark, textAlign: 'center' },
  anniSub:     { fontSize: 12, color: COLORS.muted, marginTop: 4 },
  divider:     { height: 1, backgroundColor: COLORS.border, width: '100%', marginVertical: 12 },
  marriedLbl:  { fontSize: 11, color: COLORS.subtle },
  marriedNum:  { fontSize: 22, fontWeight: '700', color: COLORS.rose, marginTop: 2 },

  questionCard: {
    borderRadius: RADIUS.lg, padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1, borderColor: '#F0D4A0',
    ...SHADOW.sm,
  },
  questionTxt: {
    fontSize: 15, color: COLORS.roseDark,
    lineHeight: 24, fontStyle: 'italic',
    fontWeight: '400',
  },

  connectRow: { flexDirection: 'row', gap: 10, marginBottom: SPACING.md },
  connectCard: {
    flex: 1, backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg, padding: SPACING.lg,
    alignItems: 'center', borderWidth: 1,
    borderColor: COLORS.border, ...SHADOW.sm,
  },
  connectIcon: { fontSize: 32, marginBottom: 6 },
  connectName: { fontSize: 13, fontWeight: '600', color: COLORS.ink },
  connectSub:  { fontSize: 11, color: COLORS.muted, marginTop: 2 },

  countdownCard: { alignItems: 'center' },
  countdownNum:  { fontSize: 52, fontWeight: '700', color: COLORS.rose, lineHeight: 56 },
  countdownLbl:  { fontSize: 14, color: COLORS.muted, marginTop: 4 },
  countdownSub:  { fontSize: 12, color: COLORS.subtle, marginTop: 2 },

  statsRow: { flexDirection: 'row', marginBottom: SPACING.lg },
});
