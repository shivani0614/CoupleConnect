import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, Alert, Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import { useCouple } from '../context/CoupleContext';
import { COLORS, SPACING, RADIUS } from '../theme';
import { COUPLE } from '../data';
import { usePartner } from '../hooks/usePartner';
import { AppHeader, Card, SLabel, PrimaryBtn, GhostBtn } from '../components/UI';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const { profile, updateProfile } = useProfile();
  const { user, logout, deleteProfile } = useAuth();
  const { notes, addNote } = useCouple();
  const { myName, partnerName, myCity, partnerCity } = usePartner();

  const [editModal, setEditModal] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const [viewerImage, setViewerImage] = useState(null);

  const [storyModal, setStoryModal] = useState(false);
  const [story, setStory] = useState([
    { id: '1', year: '2017', icon: '💫', event: 'First date — Central Park' },
    { id: '2', year: '2018', icon: '💍', event: 'Got married' },
    { id: '3', year: '2020', icon: '🏠', event: 'First home together' },
  ]);
  const [editingStory, setEditingStory] = useState(null);

  // ✅ FIXED ANNIVERSARY COUNTDOWN (RESTORED)
  const getDaysToAnniversary = () => {
    if (!profile.anniversaryDate) return null;

    const today = new Date();
    const ann = new Date(profile.anniversaryDate);

    let next = new Date(today.getFullYear(), ann.getMonth(), ann.getDate());
    if (next < today) next.setFullYear(today.getFullYear() + 1);

    const diff = Math.ceil((next - today) / (1000 * 60 * 60 * 24));

    return diff === 0
      ? "🎉 Anniversary today!"
      : `${diff} days to anniversary`;
  };

  const formatDate = (iso) => {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString();
  };

  // ✅ FIXED PROFILE EDITING
  const openEdit = (field, value) => {
    setEditModal(field);
    setTempValue(value?.toString() || '');
  };

  const saveEdit = () => {
    if (!editModal) return;

    updateProfile({
      [editModal]: tempValue.trim(),
    });

    setEditModal(null);
    setTempValue('');
  };

  // ✅ FIXED IMAGE PICKER
  const pickImage = async (field) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      updateProfile({
        [field]: result.assets[0].uri,
      });
    }
  };

  return (
    <View style={styles.root}>

      {/* HEADER (UNCHANGED LAYOUT) */}
      <LinearGradient colors={['#0d0a14', '#1A0A1E']} style={styles.header}>
        <View style={styles.coupleRow}>

          <View style={styles.coupleSide}>
            <TouchableOpacity
              onLongPress={() => pickImage('yourAvatar')}
              onPress={() => profile.yourAvatar && setViewerImage(profile.yourAvatar)}
            >
              <Image
                source={{ uri: profile.yourAvatar }}
                style={styles.avatar}
              />
            </TouchableOpacity>

            <Text style={styles.name}>{myName}</Text>
            <Text style={styles.city}>{myCity}</Text>
          </View>

          {/* HEART CENTER */}
          <View style={styles.heartCenter}>
            <LinearGradient colors={['#C0394B', '#E8617A']} style={styles.heart}>
              <Ionicons name="heart" size={20} color="#fff" />
            </LinearGradient>

            {/* ✅ RESTORED ANNIVERSARY DAYS */}
            <Text style={styles.days}>
              {getDaysToAnniversary()}
            </Text>
          </View>

          <View style={styles.coupleSide}>
            <TouchableOpacity
              onLongPress={() => pickImage('partnerAvatar')}
              onPress={() => profile.partnerAvatar && setViewerImage(profile.partnerAvatar)}
            >
              <Image
                source={{ uri: profile.partnerAvatar }}
                style={styles.avatar}
              />
            </TouchableOpacity>

            <Text style={styles.name}>{partnerName}</Text>
            <Text style={styles.city}>{partnerCity}</Text>
          </View>

        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

        {/* ❤️ LOVE CALENDAR */}
        <TouchableOpacity
          onPress={() => openEdit('anniversaryDate', profile.anniversaryDate)}
          style={styles.loveCard}
        >
          <Text style={styles.loveTitle}>❤️ Love Calendar</Text>
          <Text style={styles.loveDate}>
            {formatDate(profile.anniversaryDate) || 'Set your date'}
          </Text>
          <Text style={styles.loveSub}>Tap to edit</Text>
        </TouchableOpacity>

        {/* PROFILE FIELDS */}
        <Card>
          {[
            { label: 'Your Name', field: 'yourName', value: profile.yourName },
            { label: 'Partner Name', field: 'partnerName', value: profile.partnerName },
          ].map(i => (
            <TouchableOpacity
              key={i.field}
              onPress={() => openEdit(i.field, i.value)}
              style={styles.row}
            >
              <Text>{i.label}</Text>
              <Text>{i.value || 'Tap'}</Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* OUR STORY */}
        <SLabel>Our Story</SLabel>

        {story.map(item => (
          <TouchableOpacity
            key={item.id}
            onLongPress={() => {
              setEditingStory(item);
              setTempValue(item.event);
              setStoryModal(true);
            }}
            style={styles.storyRow}
          >
            <Text style={styles.year}>{item.year}</Text>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.event}>{item.event}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={() => {
            setEditingStory(null);
            setTempValue('');
            setStoryModal(true);
          }}
          style={styles.addBtn}
        >
          <Text style={{ color: '#C0394B' }}>+ Add memory</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* EDIT MODAL */}
      <Modal visible={!!editModal} transparent>
        <View style={styles.modal}>
          <View style={styles.modalCard}>
            <TextInput
              value={tempValue}
              onChangeText={setTempValue}
              style={styles.input}
            />

            <PrimaryBtn title="Save" onPress={saveEdit} />
            <GhostBtn title="Cancel" onPress={() => setEditModal(null)} />
          </View>
        </View>
      </Modal>

      {/* STORY MODAL */}
      <Modal visible={storyModal} transparent>
        <View style={styles.modal}>
          <View style={styles.modalCard}>
            <TextInput
              value={tempValue}
              onChangeText={setTempValue}
              style={styles.input}
            />

            <PrimaryBtn
              title="Save"
              onPress={() => {
                if (editingStory) {
                  setStory(prev =>
                    prev.map(s =>
                      s.id === editingStory.id
                        ? { ...s, event: tempValue }
                        : s
                    )
                  );
                } else {
                  setStory(prev => [
                    ...prev,
                    {
                      id: Date.now().toString(),
                      year: new Date().getFullYear().toString(),
                      icon: '💖',
                      event: tempValue,
                    },
                  ]);
                }

                setStoryModal(false);
                setTempValue('');
                setEditingStory(null);
              }}
            />
          </View>
        </View>
      </Modal>

      {/* IMAGE VIEWER */}
      <Modal visible={!!viewerImage} transparent>
        <TouchableOpacity
          style={styles.viewer}
          onPress={() => setViewerImage(null)}
        >
          <Image source={{ uri: viewerImage }} style={styles.fullImg} />
        </TouchableOpacity>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },

  header: { padding: 20 },

  coupleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  coupleSide: { alignItems: 'center' },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36
  },

  name: {
    color: '#fff',
    fontWeight: '700',
    marginTop: 6
  },

  city: {
    color: '#aaa',
    fontSize: 10
  },

  heartCenter: { alignItems: 'center' },

  heart: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },

  days: {
    color: '#ccc',
    fontSize: 10,
    marginTop: 4
  },

  loveCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFF0F2'
  },

  loveTitle: { fontWeight: '700', color: '#C0394B' },
  loveDate: { fontSize: 18, marginTop: 6 },
  loveSub: { fontSize: 12, color: '#888' },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },

  storyRow: {
    flexDirection: 'row',
    padding: 10,
    gap: 10
  },

  year: { width: 50, color: '#C0394B', fontWeight: '700' },
  icon: { fontSize: 16 },
  event: { flex: 1 },

  addBtn: {
    margin: 16,
    padding: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#C0394B',
    alignItems: 'center'
  },

  modal: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20
  },

  modalCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },

  viewer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  fullImg: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain'
  }
});