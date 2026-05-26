// src/screens/ChatScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import { COUPLE } from '../data';
import { useCouple } from '../context/CoupleContext';
import { AppHeader, AppInput } from '../components/UI';

const QUICK_EMOJIS = ['💍', '❤️', '🥺', '😍', '🌙', '🌸', '🤗', '✨', '😘', '💕'];

export default function ChatScreen() {
  const insets   = useSafeAreaInsets();
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={styles.root}>
        <AppHeader
          name1={COUPLE.name1} name2={COUPLE.name2}
          subtitle="Chat with your partner"
          pills={[{ icon: '🟢', text: 'Online now' }]}
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
          {/* Quick emojis */}
          <ScrollView
            horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.emojiRow}
            style={{ marginBottom: 8 }}
          >
            {QUICK_EMOJIS.map(e => (
              <TouchableOpacity key={e} style={styles.emojiBtn} onPress={() => sendMessage(e)}>
                <Text style={{ fontSize: 22 }}>{e}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Input row */}
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
  emojiRow: { paddingHorizontal: 2, gap: 6 },
  emojiBtn: {
    width: 40, height: 40,
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sendBtn:  { width: 44, height: 44, borderRadius: 22, overflow: 'hidden' },
  sendGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
