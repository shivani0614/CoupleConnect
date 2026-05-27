import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../context/ProfileContext';
import { useNavigation } from '@react-navigation/native';
import ProfileHeader from '../components/ProfileHeader';

function MiniAvatar({ uri, name, color }) {
  const initials = name ? name.slice(0, 2).toUpperCase() : '??';
  return (
    <View style={[styles.miniAvatar, { borderColor: color }]}>
      {uri ? (
        <Image source={{ uri }} style={styles.miniAvatarImg} />
      ) : (
        <LinearGradient colors={[color, color + 'AA']} style={styles.miniAvatarFallback}>
          <Text style={styles.miniAvatarInitials}>{initials}</Text>
        </LinearGradient>
      )}
    </View>
  );
}

export default function ProfileHeader() {
  const { profile } = useProfile();
  const navigation = useNavigation();

  const yourName = profile.yourName || 'You';
  const partnerName = profile.partnerName || 'Partner';

  return (
    <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('Profile')} activeOpacity={0.8}>
      {/* Stacked avatars */}
      <ProfileHeader />
      <View style={styles.avatarStack}>
        <MiniAvatar uri={profile.yourAvatar} name={yourName} color="#C0394B" />
        <View style={styles.avatarOverlap}>
          <MiniAvatar uri={profile.partnerAvatar} name={partnerName} color="#7B5EA7" />
        </View>
      </View>

      {/* Names */}
      <View style={styles.namesWrap}>
        <Text style={styles.namesText} numberOfLines={1}>
          {yourName} <Text style={styles.amp}>&</Text> {partnerName}
        </Text>
        {profile.anniversaryDate && (
          <Text style={styles.anniversarySub} numberOfLines={1}>
            {daysToAnniversary(profile.anniversaryDate)}
          </Text>
        )}
      </View>

      {/* Edit icon */}
      <Ionicons name="pencil" size={14} color="rgba(255,255,255,0.4)" />
    </TouchableOpacity>
  );
}

function daysToAnniversary(iso) {
  if (!iso) return null;
  const today = new Date();
  const ann = new Date(iso);
  const next = new Date(today.getFullYear(), ann.getMonth(), ann.getDate());
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  const diff = Math.ceil((next - today) / (1000 * 60 * 60 * 24));
  return diff === 0 ? '🎉 Anniversary today!' : `💑 Anniversary in ${diff} days`;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  avatarStack: { flexDirection: 'row', alignItems: 'center' },
  avatarOverlap: { marginLeft: -10 },
  miniAvatar: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, overflow: 'hidden' },
  miniAvatarImg: { width: '100%', height: '100%' },
  miniAvatarFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  miniAvatarInitials: { color: '#fff', fontSize: 10, fontWeight: '800' },
  namesWrap: { flex: 1 },
  namesText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  amp: { color: 'rgba(255,255,255,0.4)', fontWeight: '400' },
  anniversarySub: { color: 'rgba(255,255,255,0.45)', fontSize: 10, marginTop: 1 },
});
