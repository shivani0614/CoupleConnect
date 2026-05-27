import React from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { PrimaryBtn, GhostBtn } from '../components/UI';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';

function FeatureCard({ title, details }) {
  return (
    <View style={styles.featureCard}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDetails}>{details}</Text>
    </View>
  );
}

export default function LandingScreen() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  return (
    <ScrollView contentContainerStyle={[styles.container, isWide && styles.containerWide]} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#C0394B', '#E8607A', '#C8975A']} style={[styles.hero, isWide && styles.heroWide]}>
        <View style={[styles.heroInner, isWide && styles.heroInnerWide]}>
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroTag}>CoupleConnect</Text>
            <Text style={styles.heroTitle}>A beautiful relationship experience for mobile and web.</Text>
            <Text style={styles.heroSubtitle}>Keep your notes, dates, moods and chat together in one elegant shared space.</Text>

            <View style={[styles.heroActions, isWide && styles.heroActionsWide]}>
              <PrimaryBtn title="Open the app" onPress={() => navigation.navigate('Login')} style={[styles.heroButton, isWide && styles.heroButtonWide]} />
              <GhostBtn title="Login" onPress={() => navigation.navigate('Login')} style={[styles.heroGhost, isWide && styles.heroGhostWide]} />
            </View>
          </View>

          <View style={styles.heroPreview}>
            <View style={styles.previewCard}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewLabel}>Love dashboard</Text>
                <View style={styles.previewBadge}>
                  <MaterialCommunityIcons name="heart-pulse" size={14} color="#fff" />
                  <Text style={styles.previewBadgeText}>Live</Text>
                </View>
              </View>
              <Text style={styles.previewTitle}>Happy couples stay connected</Text>
              <View style={styles.previewRow}>
                <View style={styles.previewDot} />
                <Text style={styles.previewRowText}>Shared calendar and date reminders</Text>
              </View>
              <View style={styles.previewRow}>
                <View style={styles.previewDot} />
                <Text style={styles.previewRowText}>Mood check-ins, messages and rituals</Text>
              </View>
              <View style={styles.previewRow}>
                <View style={styles.previewDot} />
                <Text style={styles.previewRowText}>Play games, send surprises, and plan moments</Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={[styles.section, isWide && styles.sectionGrid]}> 
        <View style={styles.sectionIntro}>
          <Text style={styles.sectionHeading}>Designed for both screens</Text>
          <Text style={styles.sectionText}>Whether you're on phone, tablet, or browser, CoupleConnect gives you a premium desktop experience with rich couple-first moments.</Text>
        </View>

        <View style={[styles.featureGrid, isWide && styles.featureGridWide]}>
          <FeatureCard
            title="Responsive design"
            details="A UI crafted for mobile gestures and desktop browsing so the experience feels native everywhere."
          />
          <FeatureCard
            title="Shared couple dashboard"
            details="Track anniversaries, mood check-ins, shared plans and meaningful moments in one place."
          />
          <FeatureCard
            title="Instant connection"
            details="Send quick hugs, kisses and conversation prompts with delightful animation and gradients."
          />
        </View>
      </View>

      <View style={[styles.section, isWide && styles.calloutRow]}> 
        <View style={styles.calloutCard}>
          <Text style={styles.calloutTitle}>Ready to see your relationship glow?</Text>
          <Text style={styles.calloutText}>Jump into the app and explore your new couple dashboard right away.</Text>
          <PrimaryBtn title="Continue to login" onPress={() => navigation.navigate('Login')} style={[styles.calloutButton, isWide && styles.calloutButtonWide]} />
        </View>
      </View>

      <View style={styles.footer}> 
        <Text style={styles.footerText}>Built with React Native & React Native Web · Works on iOS, Android, and Desktop browsers.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: COLORS.bg,
  },
  containerWide: {
    paddingHorizontal: 96,
  },
  hero: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl,
    marginBottom: SPACING.xxl,
    minHeight: 380,
    justifyContent: 'space-between',
    ...SHADOW.lg,
  },
  heroWide: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xxl,
  },
  heroInner: {
    gap: SPACING.xl,
  },
  heroInnerWide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroTextBlock: {
    flex: 1,
    maxWidth: 540,
  },
  heroPreview: {
    flex: 1,
  },
  heroTag: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 42,
    marginBottom: 16,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 16,
    lineHeight: 26,
    maxWidth: '100%',
    marginBottom: 24,
  },
  heroActions: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  heroActionsWide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroButton: {
    width: '100%',
    marginBottom: SPACING.sm,
  },
  heroButtonWide: {
    width: 220,
    marginBottom: 0,
  },
  heroGhost: {
    width: '100%',
    marginTop: SPACING.sm,
  },
  heroGhostWide: {
    width: 160,
    marginLeft: SPACING.sm,
    marginTop: 0,
  },
  previewCard: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  previewLabel: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: RADIUS.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  previewBadgeText: {
    color: '#fff',
    fontSize: 11,
    marginLeft: 4,
    fontWeight: '700',
  },
  previewTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.md,
    lineHeight: 26,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  previewDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: SPACING.sm,
  },
  previewRowText: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
  section: {
    marginBottom: SPACING.xxl,
  },
  sectionGrid: {
    flexDirection: 'row',
    gap: SPACING.xl,
  },
  sectionIntro: {
    flex: 1,
    maxWidth: 520,
  },
  featureGrid: {
    flexDirection: 'column',
    gap: SPACING.md,
  },
  featureGridWide: {
    flex: 1,
    marginLeft: SPACING.xl,
  },
  calloutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.xl,
  },
  sectionHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.ink,
    marginBottom: SPACING.sm,
  },
  sectionText: {
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 22,
    marginBottom: SPACING.lg,
    maxWidth: 720,
  },
  featureCard: {
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOW.sm,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 8,
  },
  featureDetails: {
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 20,
  },
  calloutCard: {
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.roseLight,
    padding: SPACING.lg,
    ...SHADOW.sm,
  },
  calloutTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.roseDark,
    marginBottom: 10,
  },
  calloutText: {
    fontSize: 14,
    color: COLORS.ink,
    lineHeight: 22,
    marginBottom: SPACING.lg,
    maxWidth: 620,
  },
  calloutButton: {
    width: '100%',
  },
  calloutButtonWide: {
    width: 220,
  },
  footer: {
    paddingVertical: SPACING.lg,
  },
  footerText: {
    color: COLORS.subtle,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
