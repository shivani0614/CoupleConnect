// src/screens/ChatScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import { COUPLE, getPartnerName } from '../data';
import { useCouple } from '../context/CoupleContext';
import { useAuth } from '../context/AuthContext';
import { AppHeader, AppInput } from '../components/UI';

const QUICK_RESPONSES = [
  { icon: 'hand-heart', label: 'Warm hug', text: 'Sending love your way.' },
  { icon: 'heart', label: 'Miss you', text: 'Can’t wait to see you.' },
  { icon: 'star', label: 'You shine', text: 'You brighten my day.' },
  { icon: 'gift', label: 'Surprise', text: 'I have a little plan for us.' },
  { icon: 'calendar-heart', label: 'Date night', text: 'Let’s plan something special.' },
];

export default function ChatScreen() {
  const insets   = useSafeAreaInsets();
  const { user } = useAuth();
  const { messages, sendMessage } = useCouple();
  const [input, setInput] = useState('');
  const listRef  = useRef(null);

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages.length]);

  const handleSend = () => {
    const txt = input.trim();
    if (!txt) return;
    sendMessage(txt);
    setInput('');
  };

  const renderMsg = ({ item }) => (
    <View style={[styles.msgRow, item.me ? styles.msgRowMe : styles.msgRowThem]}>
      <View style={[styles.bubble, item.me ? styles.bubbleMe : styles.bubbleThem]}>
        {item.me
          ? <LinearGradient colors={COLORS.roseGrad} style={styles.bubbleGrad}>
              <Text style={styles.bubbleTxtMe}>{item.text}</Text>
            </LinearGradient>
          : <Text style={styles.bubbleTxtThem}>{item.text}</Text>
        }
      </View>
      <Text style={[styles.ts, item.me ? styles.tsMe : styles.tsThem]}>{item.ts}</Text>
    </View>
  );

  const partnerName = getPartnerName(user?.name);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={styles.root}>
        <AppHeader
          name1={user?.name || COUPLE.name1}
          name2={partnerName}
          subtitle="Chat with your partner"
          pills={[{ icon: 'circle', text: 'Online now' }]}
        />

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={m => m.id}
          renderItem={renderMsg}
          contentContainerStyle={{ paddingVertical: SPACING.lg, paddingHorizontal: SPACING.lg }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={[styles.inputArea, { paddingBottom: insets.bottom + 8 }]}>
          <ScrollView
            horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickRow}
            style={{ marginBottom: 12 }}
          >
            {QUICK_RESPONSES.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.quickBtn}
                onPress={() => sendMessage(item.text)}
              >
                <MaterialCommunityIcons name={item.icon} size={18} color={COLORS.roseDark} />
                <Text style={styles.quickLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.inputRow}>
            <AppInput
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              placeholder="Say something sweet..."
              style={{ flex: 1 }}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSend}
              style={styles.sendBtn}
            >
              <LinearGradient colors={COLORS.roseGrad} style={styles.sendGrad}>
                <Text style={{ color: '#fff', fontSize: 18 }}>➤</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  msgRow:     { marginBottom: 8 },
  msgRowMe:   { alignItems: 'flex-end' },
  msgRowThem: { alignItems: 'flex-start' },

  bubble: {
    maxWidth: '75%',
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOW.sm,
  },
  bubbleMe: {
    borderBottomRightRadius: RADIUS.sm,
  },
  bubbleThem: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderBottomLeftRadius: RADIUS.sm,
  },
  bubbleGrad: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  bubbleTxtMe: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTxtThem: {
    color: COLORS.ink,
    fontSize: 14,
    lineHeight: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  ts:     { fontSize: 10, color: COLORS.subtle, marginTop: 3 },
  tsMe:   { textAlign: 'right', marginRight: 4 },
  tsThem: { marginLeft: 4 },

  inputArea: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
    ...SHADOW.md,
  },
  quickRow: { paddingHorizontal: 2, gap: 8 },
  quickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 8,
  },
  quickLabel: {
    fontSize: 12,
    color: COLORS.roseDark,
    fontWeight: '600',
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sendBtn:  { width: 44, height: 44, borderRadius: 22, overflow: 'hidden' },
  sendGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
