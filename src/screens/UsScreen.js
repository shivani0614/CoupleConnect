// src/screens/UsScreen.js
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Modal, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import { COUPLE, getPartnerName } from '../data';
import { useAuth } from '../context/AuthContext';
import { useCouple } from '../context/CoupleContext';
import { AppHeader, Card, SLabel, PrimaryBtn, GhostBtn, StatCard } from '../components/UI';

const NOTE_COLORS = COLORS.noteColors;

function NoteCard({ note, onLongPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onLongPress={onLongPress}
      style={[styles.noteCard, { backgroundColor: NOTE_COLORS[note.colorIdx] }]}
    >
      <Text style={styles.noteFrom}>{note.from} wrote:</Text>
      <Text style={styles.noteTxt}>{note.text}</Text>
    </TouchableOpacity>
  );
}

export default function UsScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, deleteProfile } = useAuth();
  const { notes, addNote } = useCouple();
  const partnerName = getPartnerName(user?.name);
  const myName = user?.name || COUPLE.name1;
  const myCity = user?.name === COUPLE.name2 ? COUPLE.city2 : COUPLE.city1;
  const partnerCity = user?.name === COUPLE.name2 ? COUPLE.city1 : COUPLE.city2;

  const [modalVisible, setModalVisible] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const handlePost = () => {
    if (!noteText.trim()) return;
    addNote(noteText.trim(), user.name);
    setNoteText('');
    setModalVisible(false);
  };

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) {
      Alert.alert('Feedback', 'Please enter your message.');
      return;
    }
    setFeedbackText('');
    setFeedbackVisible(false);
    Alert.alert('Thanks!', 'Your feedback has been received.');
  };

  const handleLongNote = () => {
    Alert.alert('Love Note', 'Long press options coming soon!');
  };

  const married  = Math.floor((new Date() - new Date(COUPLE.marriedSince)) / 86400000);
  const visitDays = Math.ceil((new Date(COUPLE.nextVisit) - new Date()) / 86400000);

  return (
    <View style={styles.root}>
      <AppHeader
        name1={user?.name || COUPLE.name1} name2={partnerName}
        subtitle="Your love story, milestones & distance"
        rightLabel="Apart"
        rightValue={`${COUPLE.distanceKm.toLocaleString()} km`}
      />

      <View style={styles.logoutRow}>
        <Text style={styles.logoutLabel}>Logged in as {user?.name || user?.email}</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Card style={styles.profileCard}>
        <Text style={styles.profileCardTitle}>Profile</Text>
        <Text style={styles.profileName}>{user?.name}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
        <View style={styles.profileActions}>
          <GhostBtn title="Send feedback" onPress={() => setFeedbackVisible(true)} style={styles.profileActionBtn} />
          {!user?.isAdmin ? (
            <GhostBtn
              title="Delete account"
              onPress={() => {
                Alert.alert(
                  'Delete profile',
                  'This will remove your account permanently. Continue?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: deleteProfile },
                  ],
                );
              }}
              style={styles.profileActionBtn}
            />
          ) : null}
        </View>
        {user?.isAdmin ? (
          <Text style={styles.adminHint}>Admin accounts cannot be deleted from this screen.</Text>
        ) : null}
      </Card>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90, paddingHorizontal: SPACING.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Love notes */}
        <SLabel>Love notes</SLabel>
        <View style={styles.noteGrid}>
          {notes.map(n => (
            <NoteCard key={n.id} note={n} onLongPress={handleLongNote} />
          ))}
        </View>
        <TouchableOpacity style={styles.addNoteBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addNoteTxt}>✏️  Write a love note</Text>
        </TouchableOpacity>

        <Card style={styles.feedbackCard}>
          <Text style={styles.feedbackTitle}>Feedback</Text>
          <Text style={styles.feedbackDescription}>Share your experience with CoupleConnect so we can make it better.</Text>
          <PrimaryBtn title="Leave feedback" onPress={() => setFeedbackVisible(true)} />
        </Card>

        {/* Distance */}
        <SLabel>Distance between us</SLabel>
        <Card>
          <View style={styles.distRow}>
            <View style={styles.distCity}>
              <Text style={styles.distPin}>📍</Text>
              <Text style={styles.distCityName}>{myCity}</Text>
              <Text style={styles.distCitySub}>{myName} · EST</Text>
            </View>
            <View style={styles.distMid}>
              <Text style={styles.distArrow}>↔</Text>
              <Text style={styles.distKm}>{COUPLE.distanceKm.toLocaleString()} km</Text>
            </View>
            <View style={styles.distCity}>
              <Text style={styles.distPin}>📍</Text>
              <Text style={styles.distCityName}>{partnerCity}</Text>
              <Text style={styles.distCitySub}>{partnerName} · EST</Text>
            </View>
          </View>

          <LinearGradient colors={['#FBEAEC', '#FDF4EB']} style={styles.distStats}>
            {[
              [`${COUPLE.distanceMi} mi`, 'Miles'],
              [`~${COUPLE.flightHours}h`, 'Flight time'],
              [`${visitDays} days`, 'Until visit'],
              [COUPLE.timeDiff, 'Time diff'],
            ].map(([v, l]) => (
              <View key={l} style={styles.distStat}>
                <Text style={styles.distStatVal}>{v}</Text>
                <Text style={styles.distStatLbl}>{l}</Text>
              </View>
            ))}
          </LinearGradient>
        </Card>

        {/* Streak */}
        <SLabel>Connection streak</SLabel>
        <Card>
          <View style={styles.streakHeader}>
            <Text style={styles.streakNum}>🔥 {COUPLE.streakDays} days</Text>
            <Text style={styles.streakSub}>Connected every day</Text>
          </View>
          <View style={styles.streakBar}>
            {Array.from({ length: 7 }, (_, i) => (
              <LinearGradient
                key={i}
                colors={i === 6 ? COLORS.roseGrad : COLORS.goldGrad}
                style={styles.streakDay}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              />
            ))}
          </View>
          <Text style={styles.streakLbl}>Last 7 days</Text>
        </Card>

        {/* Milestones */}
        <SLabel>Our milestones</SLabel>
        <View style={styles.statsGrid}>
          <StatCard value={married.toLocaleString()} label="Days married"  style={styles.statItem} />
          <StatCard value={COUPLE.streakDays}        label="Day streak"    style={styles.statItem} />
          <StatCard value="148"                       label="Notes shared"  style={styles.statItem} />
          <StatCard value="6"                         label="Anniversaries" style={styles.statItem} />
        </View>

        {/* Timeline */}
        <SLabel>Our story</SLabel>
        {[
          { year: '2017', icon: '💫', event: 'First date — Central Park, NYC' },
          { year: '2018', icon: '💍', event: 'Got married — June 3rd' },
          { year: '2020', icon: '🏠', event: 'Our first home together' },
          { year: '2022', icon: '✈️', event: 'First big trip — Lisbon, Portugal' },
          { year: '2024', icon: '💑', event: 'Still falling in love every day' },
        ].map((e, i) => (
          <View key={i} style={styles.timelineRow}>
            <View style={styles.timelineLeft}>
              <Text style={styles.timelineYear}>{e.year}</Text>
              {i < 4 && <View style={styles.timelineLine} />}
            </View>
            <View style={styles.timelineCard}>
              <Text style={styles.timelineIcon}>{e.icon}</Text>
              <Text style={styles.timelineEvent}>{e.event}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add note modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Write a love note 💕</Text>
            <TextInput
              style={styles.modalInput}
              multiline
              numberOfLines={4}
              placeholder="Write something sweet..."
              placeholderTextColor={COLORS.subtle}
              value={noteText}
              onChangeText={setNoteText}
              autoFocus
            />
            <View style={styles.modalBtns}>
              <GhostBtn title="Cancel" onPress={() => { setModalVisible(false); setNoteText(''); }} />
              <PrimaryBtn title="Post note" onPress={handlePost} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={feedbackVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Send feedback</Text>
            <TextInput
              style={styles.modalInput}
              multiline
              numberOfLines={4}
              placeholder="Tell us what you love or what should improve..."
              placeholderTextColor={COLORS.subtle}
              value={feedbackText}
              onChangeText={setFeedbackText}
              autoFocus
            />
            <View style={styles.modalBtns}>
              <GhostBtn title="Cancel" onPress={() => { setFeedbackVisible(false); setFeedbackText(''); }} />
              <PrimaryBtn title="Submit" onPress={handleSubmitFeedback} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },

  noteGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
  noteCard: {
    width: '47%',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    ...SHADOW.sm,
  },
  noteFrom: { fontSize: 10, fontWeight: '600', opacity: 0.6, marginBottom: 4, color: '#2a1a22' },
  noteTxt:  { fontSize: 12, lineHeight: 18, color: '#2a1a22' },

  logoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logoutLabel: {
    color: COLORS.ink,
    fontSize: 13,
    fontWeight: '600',
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  logoutBtnText: {
    color: COLORS.rose,
    fontWeight: '700',
    fontSize: 12,
  },

  addNoteBtn: {
    borderWidth: 1, borderStyle: 'dashed', borderColor: COLORS.borderMid,
    borderRadius: RADIUS.lg, padding: SPACING.md,
    alignItems: 'center', marginBottom: SPACING.md,
  },
  addNoteTxt: { fontSize: 13, color: COLORS.rose, fontWeight: '500' },
  profileCard: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    ...SHADOW.sm,
  },
  profileCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: SPACING.sm,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.ink,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 12,
    color: COLORS.subtle,
    marginBottom: SPACING.lg,
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  profileActionBtn: {
    width: 160,
  },
  adminHint: {
    marginTop: SPACING.sm,
    fontSize: 11,
    color: COLORS.muted,
  },
  feedbackCard: {
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOW.sm,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: SPACING.sm,
  },
  feedbackDescription: {
    fontSize: 13,
    color: COLORS.muted,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },

  distRow:      { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  distCity:     { flex: 1, alignItems: 'center' },
  distPin:      { fontSize: 22, marginBottom: 4 },
  distCityName: { fontSize: 13, fontWeight: '600', color: COLORS.ink, textAlign: 'center' },
  distCitySub:  { fontSize: 10, color: COLORS.subtle, marginTop: 2 },
  distMid:      { alignItems: 'center', paddingHorizontal: 8 },
  distArrow:    { fontSize: 22, color: COLORS.rose },
  distKm:       { fontSize: 11, color: COLORS.subtle, marginTop: 2 },

  distStats: {
    flexDirection: 'row', flexWrap: 'wrap',
    borderRadius: RADIUS.md, padding: SPACING.sm,
  },
  distStat:    { width: '50%', alignItems: 'center', padding: SPACING.sm },
  distStatVal: { fontSize: 15, fontWeight: '700', color: COLORS.rose },
  distStatLbl: { fontSize: 10, color: COLORS.muted, marginTop: 2 },

  streakHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  streakNum:    { fontSize: 20, fontWeight: '700', color: COLORS.rose },
  streakSub:    { fontSize: 12, color: COLORS.muted },
  streakBar:    { flexDirection: 'row', gap: 5 },
  streakDay:    { flex: 1, height: 8, borderRadius: 4 },
  streakLbl:    { fontSize: 10, color: COLORS.subtle, marginTop: 6, textAlign: 'right' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: SPACING.lg },
  statItem:  { width: '47%' },

  timelineRow:   { flexDirection: 'row', gap: 12, marginBottom: 4 },
  timelineLeft:  { alignItems: 'center', width: 46 },
  timelineYear:  { fontSize: 12, fontWeight: '700', color: COLORS.rose },
  timelineLine:  { width: 2, flex: 1, backgroundColor: COLORS.border, marginTop: 4, minHeight: 28 },
  timelineCard: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    gap: 10, backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
    marginBottom: SPACING.sm, ...SHADOW.sm,
  },
  timelineIcon:  { fontSize: 20 },
  timelineEvent: { fontSize: 13, color: COLORS.ink, flex: 1 },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(26,16,24,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl,
    ...SHADOW.lg,
  },
  modalTitle: {
    fontSize: 18, fontWeight: '700', color: COLORS.roseDark,
    marginBottom: SPACING.lg, textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.lg, padding: SPACING.md,
    fontSize: 14, color: COLORS.ink,
    backgroundColor: COLORS.bg,
    minHeight: 100, textAlignVertical: 'top',
    marginBottom: SPACING.lg,
  },
  modalBtns: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end' },
});
