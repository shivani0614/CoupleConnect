import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, Alert, Image, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import { useCouple } from '../context/CoupleContext';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import { COUPLE, getPartnerName } from '../data';
import { AppHeader, Card, SLabel, PrimaryBtn, GhostBtn, StatCard } from '../components/UI';

const NOTE_COLORS = COLORS.noteColors;

const CURRENCIES = [
  { code: 'USD', symbol: '$',   label: 'US Dollar' },
  { code: 'EUR', symbol: '€',   label: 'Euro' },
  { code: 'GBP', symbol: '£',   label: 'British Pound' },
  { code: 'INR', symbol: '₹',   label: 'Indian Rupee' },
  { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$',  label: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥',   label: 'Japanese Yen' },
];

function Avatar({ uri, name, size = 72, color = '#C0394B', onPress }) {
  const initials = name ? name.slice(0, 2).toUpperCase() : '??';
  return (
    <TouchableOpacity onPress={onPress} style={{ position: 'relative' }}>
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <LinearGradient
          colors={[color, color + 'AA']}
          style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#fff', fontSize: size * 0.32, fontWeight: '800' }}>{initials}</Text>
        </LinearGradient>
      )}
      <View style={{
        position: 'absolute', bottom: 0, right: 0,
        width: 22, height: 22, borderRadius: 11,
        backgroundColor: '#C0394B', borderWidth: 2, borderColor: '#0d0a14',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Ionicons name="camera" size={10} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

function NoteCard({ note, onLongPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onLongPress={onLongPress}
      style={[s.noteCard, { backgroundColor: NOTE_COLORS[note.colorIdx] }]}
    >
      <Text style={s.noteFrom}>{note.from} wrote:</Text>
      <Text style={s.noteTxt}>{note.text}</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile, updateProfile } = useProfile();
  const { user, logout, deleteProfile } = useAuth();
  const { notes, addNote } = useCouple();

  const partnerName = getPartnerName(user?.name);
  const myName = user?.name || COUPLE.name1;
  const myCity = user?.name === COUPLE.name2 ? COUPLE.city2 : COUPLE.city1;
  const partnerCity = user?.name === COUPLE.name2 ? COUPLE.city1 : COUPLE.city2;

  const [editModal, setEditModal]         = useState(null);
  const [tempValue, setTempValue]         = useState('');
  const [currencyModal, setCurrencyModal] = useState(false);
  const [noteModal, setNoteModal]         = useState(false);
  const [noteText, setNoteText]           = useState('');
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText]   = useState('');

  const currencySymbol = CURRENCIES.find(c => c.code === profile.currency)?.symbol || '$';
  const currencyLabel  = CURRENCIES.find(c => c.code === profile.currency)?.label  || 'US Dollar';

  const married   = Math.floor((new Date() - new Date(COUPLE.marriedSince)) / 86400000);
  const visitDays = Math.ceil((new Date(COUPLE.nextVisit) - new Date()) / 86400000);

  const getDaysToAnniversary = () => {
    if (!profile.anniversaryDate) return null;
    const today = new Date();
    const ann   = new Date(profile.anniversaryDate);
    const next  = new Date(today.getFullYear(), ann.getMonth(), ann.getDate());
    if (next < today) next.setFullYear(today.getFullYear() + 1);
    const diff = Math.ceil((next - today) / (1000 * 60 * 60 * 24));
    return diff === 0 ? '🎉 Anniversary today!' : `${diff} days to anniversary`;
  };

  const openEdit = (field, val = '') => { setTempValue(val?.toString() || ''); setEditModal(field); };

  const saveEdit = () => {
    if (editModal) { updateProfile({ [editModal]: tempValue.trim() }); setEditModal(null); }
  };

  const pickImage = async (field) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Allow access to photo library.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.7,
    });
    if (!result.canceled) updateProfile({ [field]: result.assets[0].uri });
  };

  const handlePostNote = () => {
    if (!noteText.trim()) return;
    addNote(noteText.trim(), user.name);
    setNoteText(''); setNoteModal(false);
  };

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) { Alert.alert('Feedback', 'Please enter your message.'); return; }
    setFeedbackText(''); setFeedbackModal(false);
    Alert.alert('Thanks!', 'Your feedback has been received.');
  };

  const editLabels = {
    yourName: 'Your Name', partnerName: "Partner's Name",
    savingsGoal: 'Savings Goal', anniversaryDate: 'Anniversary (YYYY-MM-DD)',
  };

  const formatAnniversary = (iso) => {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <View style={s.root}>
      {/* ── Dark luxury profile header ── */}
      <LinearGradient colors={['#0d0a14', '#1A0A1E', '#2C1030']} style={[s.header, { paddingTop: insets.top + 12 }]}>
        {/* Couple avatars */}
        <View style={s.coupleRow}>
          <View style={s.coupleSide}>
            <Avatar uri={profile.yourAvatar} name={profile.yourName || myName} size={72} color="#C0394B" onPress={() => pickImage('yourAvatar')} />
            <Text style={s.coupleName} numberOfLines={1}>{profile.yourName || myName}</Text>
            <Text style={s.coupleCity}>{myCity}</Text>
          </View>
          <View style={s.heartCenter}>
            <LinearGradient colors={['#C0394B', '#E8617A']} style={s.heartCircle}>
              <Ionicons name="heart" size={20} color="#fff" />
            </LinearGradient>
            {profile.anniversaryDate && (
              <Text style={s.daysAway}>{getDaysToAnniversary()}</Text>
            )}
          </View>
          <View style={s.coupleSide}>
            <Avatar uri={profile.partnerAvatar} name={profile.partnerName || partnerName} size={72} color="#7B5EA7" onPress={() => pickImage('partnerAvatar')} />
            <Text style={s.coupleName} numberOfLines={1}>{profile.partnerName || partnerName}</Text>
            <Text style={s.coupleCity}>{partnerCity}</Text>
          </View>
        </View>

        {/* Goal pill */}
        {profile.savingsGoal ? (
          <View style={s.goalPill}>
            <Ionicons name="flag" size={12} color="#E8617A" />
            <Text style={s.goalPillText}>
              Savings goal: {currencySymbol}{parseFloat(profile.savingsGoal).toLocaleString()}
            </Text>
          </View>
        ) : null}

        {/* Logged in / logout row */}
        <View style={s.logoutRow}>
          <Text style={s.logoutLabel} numberOfLines={1}>Logged in as {user?.name || user?.email}</Text>
          <TouchableOpacity onPress={logout} style={s.logoutBtn}>
            <Ionicons name="log-out-outline" size={14} color={COLORS.rose} />
            <Text style={s.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile details ── */}
        <View style={s.sectionPad}>
          <SLabel>Your profile</SLabel>
          <Card>
            {[
              { label: 'Your Name',       value: profile.yourName,        field: 'yourName',       icon: 'person',      accent: '#C0394B' },
              { label: "Partner's Name",  value: profile.partnerName,     field: 'partnerName',    icon: 'person',      accent: '#7B5EA7' },
              { label: 'Anniversary',     value: formatAnniversary(profile.anniversaryDate), field: 'anniversaryDate', icon: 'gift-outline', accent: '#E8617A' },
              { label: 'Savings Goal',    value: profile.savingsGoal ? `${currencySymbol}${parseFloat(profile.savingsGoal).toLocaleString()}` : null, field: 'savingsGoal', icon: 'flag-outline', accent: '#2E7D6B' },
            ].map(({ label, value, field, icon, accent }) => (
              <TouchableOpacity key={field} style={s.fieldRow} onPress={() => openEdit(field, value)}>
                <View style={s.fieldLeft}>
                  <Ionicons name={icon} size={16} color={accent} style={{ marginRight: 10 }} />
                  <Text style={s.fieldLabel}>{label}</Text>
                </View>
                <View style={s.fieldRight}>
                  <Text style={[s.fieldVal, !value && s.fieldPlaceholder]} numberOfLines={1}>
                    {value || 'Tap to set'}
                  </Text>
                  <Ionicons name="chevron-forward" size={13} color="#C4B0B5" />
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={s.fieldRow} onPress={() => setCurrencyModal(true)}>
              <View style={s.fieldLeft}>
                <Ionicons name="cash-outline" size={16} color="#C0394B" style={{ marginRight: 10 }} />
                <Text style={s.fieldLabel}>Currency</Text>
              </View>
              <View style={s.fieldRight}>
                <Text style={s.fieldVal}>{currencySymbol} {currencyLabel}</Text>
                <Ionicons name="chevron-forward" size={13} color="#C4B0B5" />
              </View>
            </TouchableOpacity>
          </Card>
        </View>

        {/* ── Account actions ── */}
        <View style={s.sectionPad}>
          <SLabel>Account</SLabel>
          <Card>
            <Text style={s.accountEmail}>{user?.email}</Text>
            <View style={s.accountActions}>
              <GhostBtn title="Send feedback" onPress={() => setFeedbackModal(true)} style={s.actionBtn} />
              {!user?.isAdmin && (
                <GhostBtn
                  title="Delete account"
                  onPress={() => Alert.alert(
                    'Delete profile',
                    'This will remove your account permanently. Continue?',
                    [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: deleteProfile }]
                  )}
                  style={s.actionBtn}
                />
              )}
            </View>
            {user?.isAdmin && <Text style={s.adminHint}>Admin accounts cannot be deleted from this screen.</Text>}
          </Card>
        </View>

        {/* ── Love notes ── */}
        <View style={s.sectionPad}>
          <SLabel>Love notes</SLabel>
          <View style={s.noteGrid}>
            {notes.map(n => <NoteCard key={n.id} note={n} onLongPress={() => Alert.alert('Love Note', 'Long press options coming soon!')} />)}
          </View>
          <TouchableOpacity style={s.addNoteBtn} onPress={() => setNoteModal(true)}>
            <Text style={s.addNoteTxt}>✏️  Write a love note</Text>
          </TouchableOpacity>
        </View>

        {/* ── Distance ── */}
        <View style={s.sectionPad}>
          <SLabel>Distance between us</SLabel>
          <Card>
            <View style={s.distRow}>
              <View style={s.distCity}>
                <Text style={s.distPin}>📍</Text>
                <Text style={s.distCityName}>{myCity}</Text>
                <Text style={s.distCitySub}>{myName}</Text>
              </View>
              <View style={s.distMid}>
                <Text style={s.distArrow}>↔</Text>
                <Text style={s.distKm}>{COUPLE.distanceKm.toLocaleString()} km</Text>
              </View>
              <View style={s.distCity}>
                <Text style={s.distPin}>📍</Text>
                <Text style={s.distCityName}>{partnerCity}</Text>
                <Text style={s.distCitySub}>{partnerName}</Text>
              </View>
            </View>
            <LinearGradient colors={['#FBEAEC', '#FDF4EB']} style={s.distStats}>
              {[
                [`${COUPLE.distanceMi} mi`, 'Miles'],
                [`~${COUPLE.flightHours}h`, 'Flight time'],
                [`${visitDays} days`, 'Until visit'],
                [COUPLE.timeDiff, 'Time diff'],
              ].map(([v, l]) => (
                <View key={l} style={s.distStat}>
                  <Text style={s.distStatVal}>{v}</Text>
                  <Text style={s.distStatLbl}>{l}</Text>
                </View>
              ))}
            </LinearGradient>
          </Card>
        </View>

        {/* ── Streak ── */}
        <View style={s.sectionPad}>
          <SLabel>Connection streak</SLabel>
          <Card>
            <View style={s.streakHeader}>
              <Text style={s.streakNum}>🔥 {COUPLE.streakDays} days</Text>
              <Text style={s.streakSub}>Connected every day</Text>
            </View>
            <View style={s.streakBar}>
              {Array.from({ length: 7 }, (_, i) => (
                <LinearGradient
                  key={i}
                  colors={i === 6 ? COLORS.roseGrad : COLORS.goldGrad}
                  style={s.streakDay}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                />
              ))}
            </View>
            <Text style={s.streakLbl}>Last 7 days</Text>
          </Card>
        </View>

        {/* ── Milestones ── */}
        <View style={s.sectionPad}>
          <SLabel>Our milestones</SLabel>
          <View style={s.statsGrid}>
            <StatCard value={married.toLocaleString()} label="Days married"  style={s.statItem} />
            <StatCard value={COUPLE.streakDays}        label="Day streak"    style={s.statItem} />
            <StatCard value="148"                       label="Notes shared"  style={s.statItem} />
            <StatCard value="6"                         label="Anniversaries" style={s.statItem} />
          </View>
        </View>

        {/* ── Timeline ── */}
        <View style={s.sectionPad}>
          <SLabel>Our story</SLabel>
          {[
            { year: '2017', icon: '💫', event: 'First date — Central Park, NYC' },
            { year: '2018', icon: '💍', event: 'Got married — June 3rd' },
            { year: '2020', icon: '🏠', event: 'Our first home together' },
            { year: '2022', icon: '✈️', event: 'First big trip — Lisbon, Portugal' },
            { year: '2024', icon: '💑', event: 'Still falling in love every day' },
          ].map((e, i, arr) => (
            <View key={i} style={s.timelineRow}>
              <View style={s.timelineLeft}>
                <Text style={s.timelineYear}>{e.year}</Text>
                {i < arr.length - 1 && <View style={s.timelineLine} />}
              </View>
              <View style={s.timelineCard}>
                <Text style={s.timelineIcon}>{e.icon}</Text>
                <Text style={s.timelineEvent}>{e.event}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Feedback card ── */}
        <View style={s.sectionPad}>
          <Card>
            <Text style={s.feedbackTitle}>Feedback</Text>
            <Text style={s.feedbackDesc}>Share your experience so we can make CoupleConnect better.</Text>
            <PrimaryBtn title="Leave feedback" onPress={() => setFeedbackModal(true)} />
          </Card>
        </View>
      </ScrollView>

      {/* ── Edit field modal ── */}
      <Modal visible={!!editModal} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.modalOverlay}>
          <View style={s.modalCard}>
            <View style={s.handle} />
            <Text style={s.modalTitle}>{editLabels[editModal] || 'Edit'}</Text>
            {editModal === 'savingsGoal' ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Text style={s.currSign}>{currencySymbol}</Text>
                <TextInput
                  style={[s.modalInput, { flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }]}
                  value={tempValue} onChangeText={setTempValue}
                  placeholder="10000" placeholderTextColor={COLORS.subtle}
                  keyboardType="decimal-pad" autoFocus
                />
              </View>
            ) : (
              <TextInput
                style={s.modalInput}
                value={tempValue} onChangeText={setTempValue}
                placeholder={editModal === 'anniversaryDate' ? 'e.g. 2022-06-15' : `Enter ${editLabels[editModal]}`}
                placeholderTextColor={COLORS.subtle}
                autoCapitalize={editModal === 'anniversaryDate' ? 'none' : 'words'}
                keyboardType={editModal === 'anniversaryDate' ? 'numbers-and-punctuation' : 'default'}
                autoFocus
              />
            )}
            <View style={s.modalBtns}>
              <GhostBtn title="Cancel" onPress={() => setEditModal(null)} />
              <PrimaryBtn title="Save" onPress={saveEdit} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Currency modal ── */}
      <Modal visible={currencyModal} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={[s.modalCard, { maxHeight: '75%' }]}>
            <View style={s.handle} />
            <Text style={s.modalTitle}>Select Currency</Text>
            <ScrollView>
              {CURRENCIES.map(c => (
                <TouchableOpacity
                  key={c.code}
                  style={[s.currencyRow, profile.currency === c.code && s.currencyRowActive]}
                  onPress={() => { updateProfile({ currency: c.code }); setCurrencyModal(false); }}
                >
                  <Text style={s.currencySym}>{c.symbol}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.currencyName}>{c.label}</Text>
                    <Text style={s.currencyCode}>{c.code}</Text>
                  </View>
                  {profile.currency === c.code && <Ionicons name="checkmark-circle" size={20} color={COLORS.rose} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <GhostBtn title="Cancel" onPress={() => setCurrencyModal(false)} />
          </View>
        </View>
      </Modal>

      {/* ── Love note modal ── */}
      <Modal visible={noteModal} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <View style={s.handle} />
            <Text style={s.modalTitle}>Write a love note 💕</Text>
            <TextInput
              style={s.modalInput} multiline numberOfLines={4}
              placeholder="Write something sweet..." placeholderTextColor={COLORS.subtle}
              value={noteText} onChangeText={setNoteText} autoFocus
            />
            <View style={s.modalBtns}>
              <GhostBtn title="Cancel" onPress={() => { setNoteModal(false); setNoteText(''); }} />
              <PrimaryBtn title="Post note" onPress={handlePostNote} />
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Feedback modal ── */}
      <Modal visible={feedbackModal} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <View style={s.handle} />
            <Text style={s.modalTitle}>Send feedback</Text>
            <TextInput
              style={s.modalInput} multiline numberOfLines={4}
              placeholder="Tell us what you love or what should improve..."
              placeholderTextColor={COLORS.subtle}
              value={feedbackText} onChangeText={setFeedbackText} autoFocus
            />
            <View style={s.modalBtns}>
              <GhostBtn title="Cancel" onPress={() => { setFeedbackModal(false); setFeedbackText(''); }} />
              <PrimaryBtn title="Submit" onPress={handleSubmitFeedback} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  sectionPad: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },

  header: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg },
  coupleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 },
  coupleSide: { alignItems: 'center', flex: 1 },
  coupleName: { color: '#fff', fontWeight: '700', fontSize: 13, marginTop: 8, textAlign: 'center' },
  coupleCity: { color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 2, textAlign: 'center' },
  heartCenter: { alignItems: 'center', justifyContent: 'center', paddingTop: 16 },
  heartCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  daysAway: { color: 'rgba(255,255,255,0.45)', fontSize: 10, marginTop: 6, textAlign: 'center', maxWidth: 80 },
  goalPill: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 12 },
  goalPillText: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600' },
  logoutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  logoutLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 12, flex: 1, marginRight: 8 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: 'rgba(192,57,75,0.4)', borderRadius: 20, paddingVertical: 5, paddingHorizontal: 12 },
  logoutBtnText: { color: COLORS.rose, fontWeight: '700', fontSize: 12 },

  fieldRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  fieldLeft: { flexDirection: 'row', alignItems: 'center' },
  fieldLabel: { fontSize: 14, color: COLORS.ink, fontWeight: '500' },
  fieldRight: { flexDirection: 'row', alignItems: 'center', gap: 5, maxWidth: '55%' },
  fieldVal: { fontSize: 13, color: COLORS.subtle, textAlign: 'right' },
  fieldPlaceholder: { color: COLORS.muted, fontStyle: 'italic' },

  accountEmail: { fontSize: 13, color: COLORS.subtle, marginBottom: SPACING.md },
  accountActions: { flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' },
  actionBtn: { width: 160 },
  adminHint: { marginTop: SPACING.sm, fontSize: 11, color: COLORS.muted },

  noteGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
  noteCard: { width: '47%', borderRadius: RADIUS.md, padding: SPACING.md, ...SHADOW.sm },
  noteFrom: { fontSize: 10, fontWeight: '600', opacity: 0.6, marginBottom: 4, color: '#2a1a22' },
  noteTxt:  { fontSize: 12, lineHeight: 18, color: '#2a1a22' },
  addNoteBtn: { borderWidth: 1, borderStyle: 'dashed', borderColor: COLORS.borderMid, borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', marginBottom: SPACING.md },
  addNoteTxt: { fontSize: 13, color: COLORS.rose, fontWeight: '500' },

  distRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  distCity: { flex: 1, alignItems: 'center' },
  distPin: { fontSize: 22, marginBottom: 4 },
  distCityName: { fontSize: 13, fontWeight: '600', color: COLORS.ink, textAlign: 'center' },
  distCitySub: { fontSize: 10, color: COLORS.subtle, marginTop: 2 },
  distMid: { alignItems: 'center', paddingHorizontal: 8 },
  distArrow: { fontSize: 22, color: COLORS.rose },
  distKm: { fontSize: 11, color: COLORS.subtle, marginTop: 2 },
  distStats: { flexDirection: 'row', flexWrap: 'wrap', borderRadius: RADIUS.md, padding: SPACING.sm },
  distStat: { width: '50%', alignItems: 'center', padding: SPACING.sm },
  distStatVal: { fontSize: 15, fontWeight: '700', color: COLORS.rose },
  distStatLbl: { fontSize: 10, color: COLORS.muted, marginTop: 2 },

  streakHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  streakNum: { fontSize: 20, fontWeight: '700', color: COLORS.rose },
  streakSub: { fontSize: 12, color: COLORS.muted },
  streakBar: { flexDirection: 'row', gap: 5 },
  streakDay: { flex: 1, height: 8, borderRadius: 4 },
  streakLbl: { fontSize: 10, color: COLORS.subtle, marginTop: 6, textAlign: 'right' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: SPACING.lg },
  statItem: { width: '47%' },

  timelineRow: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  timelineLeft: { alignItems: 'center', width: 46 },
  timelineYear: { fontSize: 12, fontWeight: '700', color: COLORS.rose },
  timelineLine: { width: 2, flex: 1, backgroundColor: COLORS.border, marginTop: 4, minHeight: 28 },
  timelineCard: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.sm, ...SHADOW.sm },
  timelineIcon: { fontSize: 20 },
  timelineEvent: { fontSize: 13, color: COLORS.ink, flex: 1 },

  feedbackTitle: { fontSize: 16, fontWeight: '700', color: COLORS.ink, marginBottom: SPACING.sm },
  feedbackDesc: { fontSize: 13, color: COLORS.muted, lineHeight: 20, marginBottom: SPACING.md },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(26,16,24,0.55)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: COLORS.surface, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.xl, paddingBottom: SPACING.xxl, ...SHADOW.lg },
  handle: { width: 36, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.roseDark, marginBottom: SPACING.lg, textAlign: 'center' },
  modalInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.lg, padding: SPACING.md, fontSize: 14, color: COLORS.ink, backgroundColor: COLORS.bg, minHeight: 48, marginBottom: SPACING.lg },
  modalBtns: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end' },
  currSign: { fontSize: 18, fontWeight: '700', color: COLORS.subtle, backgroundColor: COLORS.border, borderWidth: 1, borderColor: COLORS.border, borderTopLeftRadius: RADIUS.lg, borderBottomLeftRadius: RADIUS.lg, paddingHorizontal: 12, paddingVertical: 13 },

  currencyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: COLORS.border, borderRadius: 10 },
  currencyRowActive: { backgroundColor: '#FFF0F2' },
  currencySym: { fontSize: 20, fontWeight: '700', color: COLORS.ink, width: 34, textAlign: 'center' },
  currencyName: { fontSize: 14, fontWeight: '600', color: COLORS.ink },
  currencyCode: { fontSize: 11, color: COLORS.subtle, marginTop: 1 },
});
