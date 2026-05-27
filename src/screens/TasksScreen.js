// src/screens/TasksScreen.js
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import { ACTIVITIES, COUPLE } from '../data';
import { usePartner } from '../hooks/usePartner';
import { useCouple } from '../context/CoupleContext';
import { useAuth } from '../context/AuthContext';
import {
  AppHeader, Card, SLabel, PrimaryBtn, AppInput, ActivityBtn, StatCard,
} from '../components/UI';

export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const nav    = useNavigation();
  const { user } = useAuth();
  const { myName, partnerName } = usePartner();
  const { tasks, toggleTask, addTask, deleteTask, sendMessage } = useCouple();
  const [newTask, setNewTask] = useState('');
  const [who,     setWho]     = useState('Both');
  // const partnerName = getPartnerName(user?.name);


  const done  = tasks.filter(t => t.done).length;
  const pct   = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const handleAdd = () => {
    if (!newTask.trim()) return;
    addTask(newTask.trim(), who);
    setNewTask('');
  };

  const handleLong = (id, text) => {
    Alert.alert('Remove task?', `"${text}"`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTask(id) },
    ]);
  };

  const handleActivity = (name) => {
    sendMessage(`Ready for ${name}? Let's go! 🎉`);
    nav.navigate('Chat');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.root}>
        <AppHeader
          name1={myName} name2={partnerName}
          subtitle="Shared to-do & household goals"
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: insets.bottom + 90, paddingHorizontal: SPACING.lg }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Progress */}
          <SLabel>This month's progress</SLabel>
          <Card>
            <View style={styles.progressRow}>
              <Text style={styles.progressPct}>{pct}%</Text>
              <Text style={styles.progressLbl}>{done} of {tasks.length} tasks done</Text>
            </View>
            <View style={styles.progressBarBg}>
              <LinearGradient
                colors={COLORS.roseGrad}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${pct}%` }]}
              />
            </View>
          </Card>

          {/* Stats */}
          <View style={styles.statsRow}>
            <StatCard value={`${done}/${tasks.length}`} label="Tasks done"   style={{ marginRight: 8 }} />
            <StatCard value={`${pct}%`}                 label="Completion"   />
          </View>

          {/* Task list */}
          <SLabel>Shared to-do list</SLabel>
          <Card style={{ paddingHorizontal: SPACING.md }}>
            {tasks.map((t, idx) => (
              <TouchableOpacity
                key={t.id}
                activeOpacity={0.7}
                onPress={() => toggleTask(t.id)}
                onLongPress={() => handleLong(t.id, t.text)}
                style={[styles.taskRow, idx < tasks.length - 1 && styles.taskBorder]}
              >
                <View style={[styles.check, t.done && styles.checkDone]}>
                  {t.done && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={[styles.taskTxt, t.done && styles.taskTxtDone]}>{t.text}</Text>
                <Text style={styles.taskWho}>{t.who}</Text>
              </TouchableOpacity>
            ))}

            {/* Add row */}
            <View style={styles.addRow}>
              <AppInput
                value={newTask}
                onChangeText={setNewTask}
                onSubmitEditing={handleAdd}
                returnKeyType="done"
                placeholder="Add a shared task..."
                style={{ flex: 1, marginRight: 8 }}
              />
              <PrimaryBtn title="Add" onPress={handleAdd} small />
            </View>

            {/* Who selector */}
            <View style={styles.whoRow}>
              <Text style={styles.whoLbl}>Assign to: </Text>
              {['Both', myName, partnerName].map(w => (
                <TouchableOpacity
                  key={w}
                  onPress={() => setWho(w)}
                  style={[styles.whoPill, who === w && styles.whoPillSel]}
                >
                  <Text style={[styles.whoPillTxt, who === w && styles.whoPillTxtSel]}>{w}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Activities */}
          <SLabel>Do together now</SLabel>
          <View style={styles.actGrid}>
            {ACTIVITIES.map(a => (
              <ActivityBtn
                key={a.id} icon={a.icon} name={a.name}
                desc={a.desc} color={a.color}
                onPress={() => handleActivity(a.name)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },

  progressRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  progressPct:    { fontSize: 22, fontWeight: '700', color: COLORS.rose },
  progressLbl:    { fontSize: 13, color: COLORS.muted },
  progressBarBg:  { height: 8, backgroundColor: COLORS.roseLight, borderRadius: 4, overflow: 'hidden' },
  progressBarFill:{ height: 8, borderRadius: 4 },

  statsRow: { flexDirection: 'row', marginBottom: SPACING.md },

  taskRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 11 },
  taskBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  check: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: COLORS.border,
    marginRight: 10, alignItems: 'center', justifyContent: 'center',
  },
  checkDone:    { backgroundColor: COLORS.rose, borderColor: COLORS.rose },
  checkMark:    { color: '#fff', fontSize: 12, fontWeight: '700' },
  taskTxt:      { flex: 1, fontSize: 14, color: COLORS.ink },
  taskTxtDone:  { color: COLORS.subtle, textDecorationLine: 'line-through' },
  taskWho:      { fontSize: 11, color: COLORS.subtle },

  addRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },

  whoRow:        { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  whoLbl:        { fontSize: 12, color: COLORS.muted, marginRight: 6 },
  whoPill:       { paddingVertical: 4, paddingHorizontal: 12, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border, marginRight: 6 },
  whoPillSel:    { backgroundColor: COLORS.rose, borderColor: COLORS.rose },
  whoPillTxt:    { fontSize: 12, color: COLORS.ink },
  whoPillTxtSel: { color: '#fff', fontWeight: '500' },

  actGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: SPACING.lg },
});
