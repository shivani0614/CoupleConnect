// src/components/UI.js
import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, SHADOW, FONTS } from '../theme';

// ── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ── Section Label ─────────────────────────────────────────────────────────────
export function SLabel({ children, style }) {
  return <Text style={[styles.sLabel, style]}>{children}</Text>;
}

// ── Primary Button ────────────────────────────────────────────────────────────
export function PrimaryBtn({ title, onPress, style, small }) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.primaryBtn, small && styles.smallBtn, style]}>
      <LinearGradient colors={COLORS.roseGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnGrad}>
        <Text style={styles.primaryBtnTxt}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ── Ghost Button ──────────────────────────────────────────────────────────────
export function GhostBtn({ title, onPress, style }) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={[styles.ghostBtn, style]}>
      <Text style={styles.ghostBtnTxt}>{title}</Text>
    </TouchableOpacity>
  );
}

// ── Pill ──────────────────────────────────────────────────────────────────────
export function Pill({ children, icon, style }) {
  return (
    <View style={[styles.pill, style]}>
      {icon ? <Text style={{ fontSize: 11 }}>{icon}</Text> : null}
      <Text style={styles.pillTxt}>{children}</Text>
    </View>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
export function StatCard({ value, label, style }) {
  return (
    <View style={[styles.statCard, style]}>
      <Text style={styles.statNum}>{value}</Text>
      <Text style={styles.statLbl}>{label}</Text>
    </View>
  );
}

// ── Text Input ────────────────────────────────────────────────────────────────
export function AppInput({ style, ...props }) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={COLORS.subtle}
      {...props}
    />
  );
}

// ── Mood Chip ─────────────────────────────────────────────────────────────────
export function MoodChip({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[styles.moodChip, selected && styles.moodChipSel]}
    >
      <Text style={[styles.moodChipTxt, selected && styles.moodChipTxtSel]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── Activity Button ───────────────────────────────────────────────────────────
export function ActivityBtn({ icon, name, desc, color, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.actBtn, { backgroundColor: color || COLORS.surface }]}>
      <Text style={styles.actIcon}>{icon}</Text>
      <Text style={styles.actName}>{name}</Text>
      <Text style={styles.actDesc}>{desc}</Text>
    </TouchableOpacity>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
export function AppHeader({ name1, name2, subtitle, pills, rightLabel, rightValue }) {
  return (
    <LinearGradient colors={COLORS.headerGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerNames}>💍 {name1} &amp; {name2}</Text>
          <Text style={styles.headerSub}>{subtitle}</Text>
        </View>
        {rightLabel ? (
          <View style={styles.headerRight}>
            <Text style={styles.headerRightLbl}>{rightLabel}</Text>
            <Text style={styles.headerRightVal}>{rightValue}</Text>
          </View>
        ) : null}
      </View>
      {pills?.length ? (
        <View style={styles.pillRow}>
          {pills.map((p, i) => (
            <Pill key={i} icon={p.icon}>{p.text}</Pill>
          ))}
        </View>
      ) : null}
    </LinearGradient>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  sLabel: {
    fontSize: 10,
    color: COLORS.subtle,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  primaryBtn: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  smallBtn: {
    alignSelf: 'flex-start',
  },
  btnGrad: {
    paddingVertical: 11,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnTxt: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  ghostBtn: {
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.rose,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  ghostBtnTxt: {
    color: COLORS.rose,
    fontSize: 13,
    fontWeight: '500',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.full,
    paddingVertical: 4,
    paddingHorizontal: 11,
  },
  pillTxt: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '400',
  },
  statCard: {
    backgroundColor: COLORS.roseLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.rose,
  },
  statLbl: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 2,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 14,
    backgroundColor: COLORS.bg,
    color: COLORS.ink,
  },
  moodChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  moodChipSel: {
    backgroundColor: COLORS.rose,
    borderColor: COLORS.rose,
  },
  moodChipTxt: {
    fontSize: 13,
    color: COLORS.ink,
  },
  moodChipTxtSel: {
    color: '#fff',
    fontWeight: '500',
  },
  actBtn: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  actIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  actName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.ink,
    textAlign: 'center',
  },
  actDesc: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
    textAlign: 'center',
  },
  header: {
    paddingTop: 56,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  headerNames: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.78)',
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerRightLbl: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 1,
  },
  headerRightVal: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  pillRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
});
