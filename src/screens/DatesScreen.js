// src/screens/DatesScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import { SPECIAL_DATES, DATE_IDEAS, GIFT_OPTIONS, COUPLE } from '../data';
import { useCouple } from '../context/CoupleContext';
import { AppHeader, SLabel, GhostBtn, ActivityBtn } from '../components/UI';
import { Linking } from 'react-native';

function daysUntil(date) {
  return Math.ceil((new Date(date) - new Date()) / 86400000);
}

export default function DatesScreen() {
  const insets = useSafeAreaInsets();
  const nav    = useNavigation();
  const { sendMessage } = useCouple();

  const visitDays = daysUntil(COUPLE.nextVisit);

  const handlePlan = (name) => {
    sendMessage(`Let's plan our ${name}! 💑`);
    nav.navigate('Chat');
  };

  const handleIdea = (name) => {
    sendMessage(`How about ${name} tonight? 🌸`);
    nav.navigate('Chat');
  };

  const openOffer = async (url) => {
    try {
      await Linking.openURL(url);
    } catch {
      sendMessage('I tried to open that gift link, but something went wrong.');
    }
  };

  return (
    <View style={styles.root}>
      <AppHeader
        name1={COUPLE.name1} name2={COUPLE.name2}
        subtitle="Special dates & date night ideas"
        rightLabel="Visit in"
        rightValue={`${visitDays} days`}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90, paddingHorizontal: SPACING.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Big countdown */}
        <SLabel>Counting down</SLabel>
        <LinearGradient colors={COLORS.roseGrad} style={styles.countdownCard}>
          <Text style={styles.countdownNum}>{visitDays}</Text>
          <Text style={styles.countdownLbl}>days until next visit ✈️</Text>
          <Text style={styles.countdownSub}>June 1st · Weekend getaway</Text>
        </LinearGradient>

        {/* Special dates */}
        <SLabel>Special dates</SLabel>
        {SPECIAL_DATES.map(d => (
          <View key={d.id} style={styles.dateCard}>
            <LinearGradient colors={['#FDF4EB', '#FFF8F4']} style={styles.dateTop}>
              <Text style={styles.dateIcon}>{d.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.dateName}>{d.name}</Text>
                <Text style={styles.dateWhen}>{d.when}</Text>
              </View>
            </LinearGradient>
            <View style={styles.dateBottom}>
              <Text style={styles.dateNote}>{d.note}</Text>
              <GhostBtn title="Plan it" onPress={() => handlePlan(d.name)} />
            </View>
          </View>
        ))}

        {/* Date night ideas */}
        <SLabel>Date night ideas</SLabel>
        <View style={styles.ideasGrid}>
          {DATE_IDEAS.map(a => (
            <ActivityBtn
              key={a.id} icon={a.icon} name={a.name}
              desc={a.desc} color={COLORS.surface}
              onPress={() => handleIdea(a.name)}
            />
          ))}
        </View>

        {/* Anniversary gift guide */}
        <SLabel>Anniversary gift guide</SLabel>
        {[
          { yr: '5th',  trad: 'Wood',   mod: 'Silverware' },
          { yr: '6th',  trad: 'Candy',  mod: 'Iron'       },
          { yr: '10th', trad: 'Tin',    mod: 'Diamond'    },
          { yr: '25th', trad: 'Silver', mod: 'Silver'     },
        ].map(g => (
          <View key={g.yr} style={styles.giftRow}>
            <Text style={styles.giftYr}>{g.yr}</Text>
            <View style={styles.giftMid}>
              <Text style={styles.giftTrad}>Traditional: {g.trad}</Text>
              <Text style={styles.giftMod}>Modern: {g.mod}</Text>
            </View>
          </View>
        ))}

        {/* Gift shop picks */}
        <SLabel>Gift shop picks</SLabel>
        {GIFT_OPTIONS.map((gift) => (
          <View key={gift.id} style={styles.giftCard}>
            <View style={styles.giftHeader}>
              <Text style={styles.giftTitle}>{gift.title}</Text>
              <View style={styles.tagRow}>
                <Text style={styles.siteTag}>{gift.site}</Text>
                <Text style={styles.discountTag}>{gift.discount}</Text>
                {gift.personalized ? <Text style={styles.personalTag}>Personalized</Text> : null}
              </View>
            </View>
            <Text style={styles.giftDesc}>{gift.desc}</Text>
            <GhostBtn title="View offer" onPress={() => openOffer(gift.url)} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },

  countdownCard: {
    borderRadius: RADIUS.xl, padding: SPACING.xl,
    alignItems: 'center', marginBottom: SPACING.md,
    ...SHADOW.md,
  },
  countdownNum: { fontSize: 64, fontWeight: '800', color: '#fff', lineHeight: 68 },
  countdownLbl: { fontSize: 15, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  countdownSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },

  dateCard: {
    borderRadius: RADIUS.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: COLORS.border,
    marginBottom: 10, ...SHADOW.sm,
  },
  dateTop: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: 12 },
  dateIcon: { fontSize: 32 },
  dateName: { fontSize: 15, fontWeight: '600', color: COLORS.roseDark },
  dateWhen: { fontSize: 12, color: COLORS.gold, marginTop: 2 },
  dateBottom: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  dateNote: { fontSize: 12, color: COLORS.muted, flex: 1, marginRight: 8 },

  ideasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: SPACING.lg },

  giftRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: SPACING.md, backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md, marginBottom: 8,
    borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm,
  },
  giftYr:   { fontSize: 14, fontWeight: '700', color: COLORS.rose, width: 44 },
  giftMid:  { flex: 1 },
  giftTrad: { fontSize: 12, color: COLORS.ink },
  giftMod:  { fontSize: 12, color: COLORS.muted, marginTop: 2 },

  giftCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW.sm,
  },
  giftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  giftTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.roseDark,
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: SPACING.sm,
  },
  siteTag: {
    fontSize: 10,
    color: COLORS.goldDark,
    backgroundColor: '#FFF7EA',
    borderRadius: RADIUS.full,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  discountTag: {
    fontSize: 10,
    color: COLORS.roseDark,
    backgroundColor: '#FDECEF',
    borderRadius: RADIUS.full,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  personalTag: {
    fontSize: 10,
    color: COLORS.ink,
    backgroundColor: '#EAF6F0',
    borderRadius: RADIUS.full,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  giftDesc: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: SPACING.sm,
    lineHeight: 18,
  },
});
