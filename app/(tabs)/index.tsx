import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import StreakCalendar from '../../components/StreakCalendar';

import QuoteCard from '../../components/QuoteCard';

import InspirationCard from '../../components/InspirationCard';
import DailyTipCard from '../../components/DailyTipCard';

import { currentUserStreak, quotes } from '../../data/mockData';
import inspirations from '../../data/inspirations';
import dailyTips from '../../data/dailyTips';
import { savePhoto, getPhotos } from '../../services/photoStorage';
import { LocalPhoto } from '../../types';

// Placeholder colors + labels mapped by day-index (0 = today, 1 = yesterday, …)
const PLACEHOLDER_SLOTS = [
  { color: '#4a3a2a', label: 'Morning Light' },
  { color: '#2a3a4a', label: 'Street Scene' },
  { color: '#3a4a2a', label: 'Shadows' },
  { color: '#4a2a3a', label: 'Geometry' },
  { color: '#5a4a2a', label: 'Golden Hour' },
  { color: '#2a4a3a', label: 'Still Life' },
  { color: '#3a2a4a', label: 'Texture' },
];

// Placeholder gallery images (mock colors representing photos)
const GALLERY_STRIP = [
  { color: '#5a4a3a', label: 'Roads' },
  { color: '#3a4a5a', label: 'Rails' },
  { color: '#6a5a4a', label: 'Fences' },
  { color: '#4a5a3a', label: 'Paths' },
  { color: '#5a3a4a', label: 'Bridges' },
];

/** Format a Date as 'Apr 5' style label */
function formatDisplayDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Format a Date as 'YYYY-MM-DD' key */
function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Build the last 7 day slots starting from today */
function buildDaySlots() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    return {
      dateKey: toDateKey(d),
      displayDate: formatDisplayDate(d),
      ...PLACEHOLDER_SLOTS[i],
    };
  });
}

type DaySlot = ReturnType<typeof buildDaySlots>[0];

interface ExpandedPicture {
  slot: DaySlot;
  localPath?: string;
}

export default function TodayScreen() {
  const [uploadedUri, setUploadedUri] = useState<string | null>(null);
  const [savedPhotos, setSavedPhotos] = useState<LocalPhoto[]>([]);
  const [expandedPicture, setExpandedPicture] = useState<ExpandedPicture | null>(null);

  const daySlots = useMemo(() => buildDaySlots(), []);
  const todayDateKey = daySlots[0].dateKey;

  // Load persisted photos on mount
  useEffect(() => {
    getPhotos().then(setSavedPhotos);
  }, []);

  // Keep uploadedUri in sync with stored photos for today
  useEffect(() => {
    const todayPhoto = savedPhotos.find((p) => p.dateKey === todayDateKey);
    if (todayPhoto) setUploadedUri(todayPhoto.localPath);
  }, [savedPhotos, todayDateKey]);

  const quote = useMemo(
    () => quotes[Math.floor(Math.random() * quotes.length)],
    [],
  );

  // Pick tip deterministically by calendar day so it rotates daily
  const todayTip = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
    );
    return dailyTips[dayOfYear % dailyTips.length];
  }, []);

  const handleUpload = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo access to upload your shot.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const photo = await savePhoto(result.assets[0].uri, todayDateKey, daySlots[0].label);
      const updated = await getPhotos();
      setSavedPhotos(updated);
      setUploadedUri(photo.localPath);
      Alert.alert('Shot uploaded!', 'Nice work — your streak continues.');
    }
  };

  function getSlotPhoto(dateKey: string): LocalPhoto | undefined {
    return savedPhotos.find((p) => p.dateKey === dateKey);
  }

  function handleSlotPress(slot: DaySlot) {
    const real = getSlotPhoto(slot.dateKey);
    if (real) {
      setExpandedPicture({ slot, localPath: real.localPath });
    } else {
      // Placeholder slots that "have a photo" can still be tapped to preview the mock
      setExpandedPicture({ slot });
    }
  }

  // Determine which placeholder slots should show as "has photo" (mock data for past days)
  // Index 0 is today — only show as having a photo if really uploaded
  const MOCK_HAS_PHOTO = [false, true, false, true, false, true, true];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <Ionicons name="aperture" size={22} color={Colors.onBackground} />
            <Text style={styles.brandName}>APERTURE</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="camera-outline" size={24} color={Colors.onBackground} />
          </TouchableOpacity>
        </View>

        {/* Streak Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.streakDays}>{currentUserStreak.current} Days</Text>
          <Text style={styles.streakOnFire}>
            {currentUserStreak.current > 0 ? 'On Fire' : 'Ready to Start'}
          </Text>
          <Text style={styles.streakDescription}>
            {currentUserStreak.current > 0
              ? `You're maintaining a ${currentUserStreak.current}-day streak.\nKeep shooting to build your craft.`
              : "Begin your daily habit today.\nCapture one shot to start your streak."}
          </Text>
          <View style={styles.streakMeta}>
            <Text style={styles.streakMetaLabel}>LONGEST: {currentUserStreak.longest} DAYS</Text>
          </View>
        </View>

        {/* Streak Calendar */}
        <StreakCalendar streakDays={[]} />

        {/* Upload CTA */}
        <TouchableOpacity
          style={styles.uploadCard}
          onPress={handleUpload}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryContainer]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.uploadGradient}
          >
            <Ionicons name="camera" size={32} color={Colors.onPrimary} style={{ marginBottom: 12 }} />
            <Text style={styles.uploadTitle}>
              {uploadedUri ? 'SHOT UPLOADED' : 'UPLOAD YOUR DAILY SHOT'}
            </Text>
            <Text style={styles.uploadSubtitle}>
              {uploadedUri
                ? 'Great work — your streak continues.'
                : 'Perfect your craft, one shot at a time.\nCapture and upload before midnight.'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Inspiration Card */}
        <View style={styles.inspirationSection}>
          <Text style={styles.inspirationHeading}>Today's Inspiration</Text>
          <InspirationCard photo={inspirations[0]} />
        </View>

        {/* Your Pictures */}
        <View style={styles.yourPicturesSection}>
          <Text style={styles.yourPicturesHeading}>Your Pictures</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.yourPicturesRow}
          style={styles.yourPicturesScroll}
        >
          {daySlots.map((slot, i) => {
            const realPhoto = getSlotPhoto(slot.dateKey);
            const mockHasPhoto = i > 0 && MOCK_HAS_PHOTO[i];
            const tappable = Boolean(realPhoto) || mockHasPhoto;

            return (
              <TouchableOpacity
                key={slot.dateKey}
                style={styles.yourPictureItem}
                onPress={() => tappable && handleSlotPress(slot)}
                activeOpacity={tappable ? 0.8 : 1}
              >
                {realPhoto ? (
                  <Image
                    source={{ uri: realPhoto.localPath }}
                    style={styles.yourPictureThumbnail}
                  />
                ) : mockHasPhoto ? (
                  <View style={[styles.yourPictureThumbnail, { backgroundColor: slot.color }]} />
                ) : (
                  <View style={[styles.yourPictureThumbnail, styles.yourPictureMissed]}>
                    <Ionicons name="camera-outline" size={18} color={Colors.outlineVariant} />
                  </View>
                )}
                <Text style={[styles.yourPictureDate, !tappable && !realPhoto && styles.yourPictureDateMuted]}>
                  {slot.displayDate}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Expanded Picture Modal */}
        <Modal
          visible={expandedPicture !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setExpandedPicture(null)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setExpandedPicture(null)}>
            <Pressable style={styles.modalContent} onPress={() => {}}>
              {expandedPicture?.localPath ? (
                <Image
                  source={{ uri: expandedPicture.localPath }}
                  style={styles.modalImage}
                />
              ) : (
                <View style={[styles.modalImage, { backgroundColor: expandedPicture?.slot.color }]} />
              )}
              <View style={styles.modalMeta}>
                <Text style={styles.modalLabel}>{expandedPicture?.slot.label}</Text>
                <Text style={styles.modalDate}>{expandedPicture?.slot.displayDate}</Text>
              </View>
              <TouchableOpacity style={styles.modalClose} onPress={() => setExpandedPicture(null)}>
                <Ionicons name="close" size={20} color={Colors.onBackground} />
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Gallery Strip — horizontal thumbnail row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.galleryStripRow}
          style={styles.galleryStripScroll}
        >
          {GALLERY_STRIP.map((item, i) => (
            <View key={i} style={styles.galleryStripItem}>
              <View style={[styles.galleryStripImage, { backgroundColor: item.color }]} />
            </View>
          ))}
        </ScrollView>

        {/* Daily Tip Card */}
        <View style={styles.dailyTipSection}>
          <DailyTipCard tip={todayTip} />
        </View>

        {/* Recent Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionLabel}>Recent Insights</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.insightsRow}
          >
            {[
              { color: '#4a4a4a', label: 'Shadows' },
              { color: '#6a7a5a', label: 'Nature' },
              { color: '#8a7a6a', label: 'Urban' },
            ].map((item, i) => (
              <View key={i} style={styles.insightCard}>
                <View style={[styles.insightImage, { backgroundColor: item.color }]} />
                <Text style={styles.insightLabel}>{item.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Quote Card */}
        <QuoteCard quote={quote} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 40,
  },

  // Header Bar
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    ...Typography.labelLg,
    color: Colors.onBackground,
    fontSize: 15,
    letterSpacing: 2,
  },

  // Streak Hero Card
  heroCard: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    shadowColor: Colors.onBackground,
    shadowOpacity: 0.04,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  streakDays: {
    ...Typography.headlineLg,
    color: Colors.onBackground,
    fontSize: 36,
    lineHeight: 42,
  },
  streakOnFire: {
    ...Typography.headlineLg,
    color: Colors.primaryContainer,
    fontSize: 36,
    lineHeight: 42,
    fontStyle: 'italic',
  },
  streakDescription: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    marginTop: 12,
    lineHeight: 21,
  },
  streakMeta: {
    marginTop: 12,
  },
  streakMetaLabel: {
    ...Typography.labelSm,
    color: Colors.textMuted,
  },

  // Upload CTA
  uploadCard: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 6,
    overflow: 'hidden',
  },
  uploadGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  uploadTitle: {
    ...Typography.labelLg,
    color: Colors.onPrimary,
    fontSize: 16,
    letterSpacing: 2.5,
    textAlign: 'center',
  },
  uploadSubtitle: {
    ...Typography.bodySm,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },

  // Inspiration
  inspirationSection: {
    paddingHorizontal: 20,
    marginTop: 28,
  },
  inspirationHeading: {
    ...Typography.titleMd,
    color: Colors.onBackground,
    marginBottom: 14,
  },

  // Your Pictures
  yourPicturesSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  yourPicturesHeading: {
    ...Typography.titleMd,
    color: Colors.onBackground,
    marginBottom: 14,
  },
  yourPicturesScroll: {
    marginTop: 0,
  },
  yourPicturesRow: {
    paddingHorizontal: 20,
    gap: 8,
  },
  yourPictureItem: {
    width: 72,
  },
  yourPictureThumbnail: {
    width: 72,
    height: 72,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yourPictureMissed: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  yourPictureDate: {
    ...Typography.labelSm,
    color: Colors.textMuted,
    marginTop: 5,
  },
  yourPictureDateMuted: {
    color: Colors.outlineVariant,
  },

  // Expanded Picture Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(28,27,27,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 6,
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    aspectRatio: 1,
  },
  modalMeta: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  modalLabel: {
    ...Typography.titleSm,
    color: Colors.onBackground,
  },
  modalDate: {
    ...Typography.labelSm,
    color: Colors.textMuted,
    marginTop: 4,
  },
  modalClose: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(252,249,248,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Gallery Strip
  galleryStripScroll: {
    marginTop: 24,
  },
  galleryStripRow: {
    paddingHorizontal: 20,
    gap: 8,
  },
  galleryStripItem: {
    width: 72,
    height: 54,
  },
  galleryStripImage: {
    width: 72,
    height: 54,
    borderRadius: 2,
  },

  // Daily Tip Section
  dailyTipSection: {
    paddingHorizontal: 20,
    marginTop: 28,
  },

  sectionLabel: {
    ...Typography.headlineSm,
    color: Colors.onBackground,
    marginBottom: 16,
  },

  // Recent Insights
  insightsSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  insightsRow: {
    gap: 12,
    marginTop: 0,
  },
  insightCard: {
    width: 120,
  },
  insightImage: {
    width: 120,
    height: 90,
    borderRadius: 2,
    marginBottom: 8,
  },
  insightLabel: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
  },

});
