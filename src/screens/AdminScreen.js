import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import { useAuth } from '../context/AuthContext';
import { AppHeader, Card, PrimaryBtn, GhostBtn, SLabel } from '../components/UI';

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const { user, users, deleteUser } = useAuth();

  const handleDelete = (id, name, isAdmin) => {
    if (id === user.id) {
      Alert.alert('Delete account', 'You cannot delete your own admin account.');
      return;
    }
    if (isAdmin) {
      Alert.alert('Delete account', 'Admin accounts cannot be deleted.');
      return;
    }
    Alert.alert(
      'Delete user profile',
      `Delete ${name} from the system?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          const success = await deleteUser(id);
          if (!success) {
            Alert.alert('Unable to delete', 'This profile cannot be deleted.');
          }
        } },
      ],
    );
  };

  return (
    <View style={styles.root}>
      <AppHeader
        name1={user?.name || 'Admin'}
        name2="Admin"
        subtitle="Manage all stored user profiles"
        rightLabel="Mode"
        rightValue="Admin"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90, paddingHorizontal: SPACING.lg }}
        showsVerticalScrollIndicator={false}
      >
        <SLabel>All users</SLabel>
        {users.map((account) => (
          <Card key={account.id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View>
                <Text style={styles.userName}>{account.name}</Text>
                <Text style={styles.userEmail}>{account.email}</Text>
              </View>
              {account.isAdmin ? (
                <View style={styles.adminBadge}>
                  <Text style={styles.adminBadgeText}>Admin</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.userMetaRow}>
              <Text style={styles.userMeta}>ID: {account.id}</Text>
              <Text style={styles.userMeta}>{account.isAdmin ? 'Full access' : 'User'}</Text>
            </View>

            <View style={styles.buttonsRow}>
              <GhostBtn
                title="View"
                onPress={() => Alert.alert('Profile details', `${account.name}\n${account.email}\n${account.isAdmin ? 'Admin user' : 'Regular user'}`)}
                style={styles.actionBtn}
              />
              <PrimaryBtn
                title="Delete"
                onPress={() => handleDelete(account.id, account.name, account.isAdmin)}
                style={styles.deleteBtn}
              />
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  userCard: {
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.ink,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 4,
  },
  adminBadge: {
    backgroundColor: COLORS.roseLight,
    borderRadius: RADIUS.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  adminBadgeText: {
    color: COLORS.roseDark,
    fontSize: 11,
    fontWeight: '700',
  },
  userMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  userMeta: {
    fontSize: 12,
    color: COLORS.subtle,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  actionBtn: {
    flex: 1,
  },
  deleteBtn: {
    flex: 1,
  },
});