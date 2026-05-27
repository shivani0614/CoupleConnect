// src/screens/GamesScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import { QUESTIONS } from '../data';
import { AppHeader, Card, PrimaryBtn, GhostBtn, SLabel } from '../components/UI';

const QUESTION_PROMPTS = [
  'What was your first impression of me?',
  'Name one small thing I do that makes your day better.',
  'If we had a free weekend, where would you want to go?',
  'What song best describes how you feel about us?',
  'What is one memory of us you want to relive?',
];

const CHALLENGES = [
  'Plan a surprise message for your partner today.',
  'Share a childhood story you haven’t told yet.',
  'Send a voice note with one thing you adore about them.',
  'Pick a photo that reminds you of us and why.',
];

const RATHER_OPTIONS = [
  { left: 'Build a blanket fort', right: 'Cook dinner together' },
  { left: 'Watch our favorite movie', right: 'Write a surprise note' },
  { left: 'Take a sunrise walk', right: 'Stay in for a candlelit night' },
  { left: 'Dance to our song', right: 'Play cards and laugh' },
];

const GAME_TYPES = [
  {
    id: 'roulette',
    icon: 'cards-heart-outline',
    title: 'Question roulette',
    subtitle: 'Take turns answering a playful prompt.',
  },
  {
    id: 'challenge',
    icon: 'dice-multiple-outline',
    title: 'Love challenge',
    subtitle: 'Share a small surprise or sweet dare.',
  },
  {
    id: 'rather',
    icon: 'cards-playing-heart-outline',
    title: 'Would you rather',
    subtitle: 'Choose between two cozy moments.',
  },
];

function sample(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export default function GamesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeGame, setActiveGame] = useState('roulette');
  const [question, setQuestion] = useState(sample(QUESTION_PROMPTS));
  const [challenge, setChallenge] = useState(sample(CHALLENGES));
  const [ratherChoice, setRatherChoice] = useState(sample(RATHER_OPTIONS));

  const renderGameContent = () => {
    if (activeGame === 'challenge') {
      return (
        <Card style={styles.gameDetailCard}>
          <Text style={styles.gameDetailLabel}>Your challenge</Text>
          <Text style={styles.gameDetailText}>{challenge}</Text>
          <PrimaryBtn
            title="Another challenge"
            onPress={() => setChallenge(sample(CHALLENGES))}
            style={styles.gameAction}
          />
        </Card>
      );
    }

    if (activeGame === 'rather') {
      return (
        <Card style={styles.gameDetailCard}>
          <Text style={styles.gameDetailLabel}>Would you rather</Text>
          <View style={styles.ratherRow}>
            <View style={[styles.ratherOption, styles.ratherOptionMargin]}>
              <Text style={styles.ratherText}>{ratherChoice.left}</Text>
            </View>
            <Text style={styles.ratherDivider}>or</Text>
            <View style={styles.ratherOption}>
              <Text style={styles.ratherText}>{ratherChoice.right}</Text>
            </View>
          </View>
          <PrimaryBtn
            title="Pick a new question"
            onPress={() => setRatherChoice(sample(RATHER_OPTIONS))}
            style={styles.gameAction}
          />
        </Card>
      );
    }

    return (
      <Card style={styles.gameDetailCard}>
        <Text style={styles.gameDetailLabel}>Question roulette</Text>
        <Text style={styles.gameDetailText}>{question}</Text>
        <PrimaryBtn
          title="New question"
          onPress={() => setQuestion(sample(QUESTION_PROMPTS))}
          style={styles.gameAction}
        />
      </Card>
    );
  };

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom + 16 }]}> 
      <AppHeader
        iconName="controller-classic"
        name1="Couple"
        name2="Games"
        subtitle="Play together, laugh together"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>Fun games for two</Text>
          <Text style={styles.introText}>
            Pick a game to spark connection, share laughs, and enjoy a playful moment with your partner.
          </Text>
        </View>

        <View style={styles.gameTypeRow}>
          {GAME_TYPES.map((item, idx) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              onPress={() => setActiveGame(item.id)}
              style={[
                styles.gameTypeCard,
                idx !== GAME_TYPES.length - 1 && styles.gameTypeCardMargin,
                activeGame === item.id && styles.gameTypeCardActive,
              ]}
            >
              <View style={styles.gameTypeIcon}>
                <MaterialCommunityIcons name={item.icon} size={20} color={COLORS.roseDark} />
              </View>
              <Text style={styles.gameTypeTitle}>{item.title}</Text>
              <Text style={styles.gameTypeSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderGameContent()}

        <View style={styles.footerCard}>
          <SLabel style={styles.footerLabel}>Play tip</SLabel>
          <Text style={styles.footerText}>Take turns choosing the next question so both of you get a moment to lead the conversation.</Text>
          <GhostBtn title="Go back home" onPress={() => navigation.navigate('Home')} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
  },
  introCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: SPACING.xs,
  },
  introText: {
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 20,
  },
  gameTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  gameTypeCardMargin: {
    marginRight: SPACING.sm,
  },
  gameTypeCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  gameTypeCardActive: {
    borderColor: COLORS.rose,
    backgroundColor: COLORS.roseLight,
  },
  gameTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: '#FFF0F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  gameTypeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.ink,
  },
  gameTypeSubtitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 4,
    lineHeight: 16,
  },
  gameDetailCard: {
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    ...SHADOW.sm,
  },
  gameDetailLabel: {
    fontSize: 12,
    color: COLORS.subtle,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  gameDetailText: {
    fontSize: 16,
    color: COLORS.ink,
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  gameAction: {
    alignSelf: 'flex-start',
  },
  ratherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratherOptionMargin: {
    marginRight: SPACING.sm,
  },
  ratherOption: {
    flex: 1,
    backgroundColor: '#F7F2EF',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
  },
  ratherText: {
    fontSize: 13,
    color: COLORS.ink,
    fontWeight: '600',
  },
  ratherDivider: {
    color: COLORS.muted,
    fontSize: 12,
    marginHorizontal: SPACING.xs,
  },
  footerCard: {
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  footerLabel: {
    marginBottom: SPACING.xs,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.muted,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
});
