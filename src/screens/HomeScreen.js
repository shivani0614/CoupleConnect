// src/screens/HomeScreen.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import { QUESTIONS, COUPLE } from '../data';
import { useCouple } from '../context/CoupleContext';
import { useAuth } from '../context/AuthContext';
import {
  Card,
  SLabel,
  MoodChip,
  StatCard,
  PrimaryBtn,
  GhostBtn,
} from '../components/UI';

const { width } = Dimensions.get('window');
const HERO_HEIGHT = 340;
const MOODS = ['In love', 'Happy', 'Missing you', 'Stressed', 'Excited', 'Need to talk'];

const GAMES = [
  { id: '1', icon: 'cards-heart-outline', title: 'Question roulette', subtitle: 'Spin a conversation starter' },
  { id: '2', icon: 'dice-multiple-outline', title: 'Love challenge', subtitle: 'Share a playful dare' },
  { id: '3', icon: 'cards-playing-heart-outline', title: 'Would you rather', subtitle: 'Pick a cozy choice' },
];

function daysUntil(date) {
  return Math.ceil((new Date(date) - new Date()) / 86400000);
}
function daysSince(date) {
  return Math.floor((new Date() - new Date(date)) / 86400000);
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const { user } = useAuth();
  const { mood, setMood, sendHug, sendKiss, kisses } = useCouple();
  const [qIdx, setQIdx] = useState(0);

  const scrollY = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: false,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: false,
        }),
      ]),
    ).start();

    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 700,
      delay: 240,
      useNativeDriver: false,
    }).start();
  }, [fadeIn, pulse]);

  const headerScale = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [1, 0.94],
    extrapolate: 'clamp',
  });
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [0, -26],
    extrapolate: 'clamp',
  });
  const ringScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });
  const heartTranslate = pulse.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -10, 0],
  });

  const currentName = user?.name || COUPLE.name1;
  const partnerName = user?.name === COUPLE.name1 ? COUPLE.name2 : COUPLE.name1;
  const anniDays = daysUntil(new Date(new Date(COUPLE.marriedSince).setFullYear(new Date().getFullYear())));
  const married = daysSince(COUPLE.marriedSince);
  const visitDays = daysUntil(COUPLE.nextVisit);
  const years = new Date().getFullYear() - COUPLE.marriedSince.getFullYear();

  return (
    <View style={styles.root}>
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.heroWrap,
            {
              transform: [
                { scale: headerScale },
                { translateY: headerTranslate },
              ],
            },
          ]}
        >
          <LinearGradient colors={COLORS.headerGrad} style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <View>
                <Text style={styles.heroLabel}>Couple Connect</Text>
                <Text style={styles.heroTitle}>Hi {currentName}, celebrate every moment with {partnerName}</Text>
              </View>
              <View style={styles.heroPill}>
                <Text style={styles.heroPillText}>{COUPLE.distanceKm} km apart</Text>
              </View>
            </View>

            <Text style={styles.heroSubtitle}>A premium dashboard for you and {partnerName} to share plans, moods, and meaningful rituals.</Text>

            <View style={styles.heroStatsRow}>
              <View style={styles.heroStatCard}>
                <Text style={styles.heroStatNumber}>{COUPLE.streakDays}</Text>
                <Text style={styles.heroStatLabel}>Current streak</Text>
              </View>
              <View style={[styles.heroStatCard, styles.heroStatAccent]}>
                <Text style={[styles.heroStatNumber, styles.heroStatNumberAccent]}>{years}</Text>
                <Text style={styles.heroStatLabel}>Years together</Text>
              </View>
            </View>

            <View style={styles.heroActions}>
              <PrimaryBtn title="Send a sweet note" onPress={() => nav.navigate('Chat')} style={styles.heroAction} />
              <GhostBtn title="Plan a date" onPress={() => nav.navigate('Dates')} style={styles.heroGhost} />
            </View>

            <Animated.View style={[styles.heroGlow, { transform: [{ scale: ringScale }] }]} />
            <Animated.View style={[styles.heartBubble, { transform: [{ translateY: heartTranslate }] }]}>
              <MaterialCommunityIcons name="heart-pulse" size={28} color="#fff" />
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mood check</Text>
            <Text style={styles.sectionMeta}>{mood || 'Tap to select your mood'}</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moodScroll}
          >
            {MOODS.map((item) => (
              <MoodChip
                key={item}
                label={item}
                selected={mood === item}
                onPress={() => setMood(item)}
                style={styles.moodChip}
              />
            ))}
          </ScrollView>
        </View>

        <Animated.View style={[styles.section, { opacity: fadeIn }]}> 
          <Text style={styles.sectionTitle}>Tomorrow's spark</Text>
          <Card style={styles.featureCard}>
            <Text style={styles.featureLabel}>Tonight's conversation</Text>
            <Text style={styles.featureText}>"{QUESTIONS[qIdx]}"</Text>
            <GhostBtn
              title="Show another idea"
              onPress={() => setQIdx((qIdx + 1) % QUESTIONS.length)}
              style={styles.featureButton}
            />
          </Card>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeIn, transform: [{ translateY: fadeIn.interpolate({ inputRange: [0, 1], outputRange: [22, 0] }) }] }]}> 
          <Text style={styles.sectionTitle}>Quick connect</Text>
          <View style={styles.connectRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.connectCard, styles.connectRose]}
              onPress={() => { sendHug(); nav.navigate('Chat'); }}
            >
              <View style={styles.connectIconWrap}>
                <MaterialCommunityIcons name="hand-heart" size={24} color={COLORS.roseDark} />
              </View>
              <Text style={styles.connectTitle}>Send a hug</Text>
              <Text style={styles.connectNote}>Instant warm gesture</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.connectCard, styles.connectGold, styles.connectCardRight]}
              onPress={() => { sendKiss(); nav.navigate('Chat'); }}
            >
              <View style={styles.connectIconWrap}>
                <MaterialCommunityIcons name="heart-plus-outline" size={24} color={COLORS.goldDark} />
              </View>
              <Text style={styles.connectTitle}>Send a kiss</Text>
              <Text style={styles.connectNote}>{kisses} sent today</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeIn, transform: [{ translateY: fadeIn.interpolate({ inputRange: [0, 1], outputRange: [22, 0] }) }] }]}> 
          <Text style={styles.sectionTitle}>Couple games</Text>
          <Text style={styles.sectionMeta}>Play a quick game together to connect in a new way.</Text>
          <View style={styles.gamesRow}>
            {GAMES.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                style={[styles.gameCard, idx !== GAMES.length - 1 && styles.gameCardMargin]}
                onPress={() => nav.navigate('Games')}
              >
                <View style={styles.gameIconWrap}>
                  <MaterialCommunityIcons name={item.icon} size={22} color={COLORS.roseDark} />
                </View>
                <Text style={styles.gameTitle}>{item.title}</Text>
                <Text style={styles.gameSubtitle}>{item.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming ritual</Text>
          <Card style={styles.upcomingCard}>
            <View style={styles.upcomingRow}>
              <Text style={styles.upcomingLabel}>Next meetup</Text>
              <Text style={styles.upcomingValue}>{visitDays} days</Text>
            </View>
            <Text style={styles.upcomingText}>A weekend escape with a curated itinerary just for you.</Text>
            <View style={styles.upcomingBadge}> 
              <Text style={styles.upcomingBadgeText}>June 1 · Flight</Text>
            </View>
          </Card>
        </View>

        <View style={[styles.section, styles.statsSection]}>
          <Text style={styles.sectionTitle}>Relationship stats</Text>
          <View style={styles.statsRow}>
            <StatCard value={`${married.toLocaleString()}`} label="Days married" style={styles.statCardMargin} />
            <StatCard value={`${COUPLE.streakDays}`} label="Day streak" />
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flex: 1,
  },
  heroWrap: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.xl,
    overflow: 'visible',
  },
  heroCard: {
    height: HERO_HEIGHT,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    paddingTop: SPACING.xl + 8,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
    maxWidth: width * 0.55,
  },
  heroPill: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: RADIUS.full,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  heroPillText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    lineHeight: 22,
    marginTop: SPACING.sm,
    maxWidth: width * 0.8,
  },
  heroStatsRow: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
  },
  heroStatCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  heroStatAccent: {
    backgroundColor: 'rgba(255,255,255,0.24)',
    marginLeft: SPACING.sm,
  },
  heroStatNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  heroStatNumberAccent: {
    color: COLORS.gold,
  },
  heroStatLabel: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  heroAction: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  heroGhost: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  heroGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.18)',
    top: -48,
    right: -48,
  },
  heartBubble: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(255,255,255,0.24)',
    right: 24,
    top: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    fontSize: 28,
  },

  section: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.ink,
  },
  sectionMeta: {
    fontSize: 12,
    color: COLORS.muted,
  },
  moodScroll: {
    paddingVertical: SPACING.sm,
  },
  moodChip: {
    marginRight: SPACING.sm,
  },
  featureCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 0,
    backgroundColor: COLORS.surface,
    ...SHADOW.md,
  },
  featureLabel: {
    fontSize: 12,
    color: COLORS.goldDark,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    color: COLORS.ink,
    lineHeight: 24,
    marginBottom: SPACING.md,
  },
  featureButton: {
    alignSelf: 'flex-start',
  },
  connectRow: {
    flexDirection: 'row',
  },
  connectCard: {
    flex: 1,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    justifyContent: 'center',
    ...SHADOW.sm,
  },
  connectCardRight: {
    marginLeft: SPACING.sm,
  },
  connectRose: {
    backgroundColor: COLORS.roseLight,
  },
  connectGold: {
    backgroundColor: COLORS.goldLight,
  },
  connectIconWrap: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  connectTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.ink,
  },
  connectNote: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },
  gamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  gameCardMargin: {
    marginRight: SPACING.sm,
  },
  gameCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  gameIconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: '#FFF0F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  gameTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.ink,
  },
  gameSubtitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 6,
    lineHeight: 16,
  },
  upcomingCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 0,
    backgroundColor: COLORS.surface,
    ...SHADOW.sm,
  },
  upcomingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  upcomingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.roseDark,
  },
  upcomingValue: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.goldDark,
  },
  upcomingText: {
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  upcomingBadge: {
    alignSelf: 'flex-start',
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.gold,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  upcomingBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  statsSection: {
    marginBottom: SPACING.xxl,
  },
  statsRow: {
    flexDirection: 'row',
  },
  statCardMargin: {
    marginRight: SPACING.sm,
  },
});
