import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import StreakCalendar from '../../components/StreakCalendar';
<<<<<<< HEAD
import QuoteCard from '../../components/QuoteCard';
=======
import InspirationCard from '../../components/InspirationCard';
>>>>>>> claude/inspiration-card-swipe-czACB
import { todayChallenge, currentUserStreak, quotes } from '../../data/mockData';
import inspirations from '../../data/inspirations';


// Placeholder gallery images (mock colors representing photos)
const GALLERY_STRIP = [
  { color: '#5a4a3a', label: 'Roads' },
  { color: '#3a4a5a', label: 'Rails' },
  { color: '#6a5a4a', label: 'Fences' },
  { color: '#4a5a3a', label: 'Paths' },
  { color: '#5a3a4a', label: 'Bridges' },
];

const YOUR_PICTURES = [
  { id: 1, color: '#4a3a2a', label: 'Morning Light', date: 'Apr 5', hasPhoto: true },
  { id: 2, color: '#2a3a4a', label: 'Street Scene', date: 'Apr 4', hasPhoto: true },
  { id: 3, color: '#3a4a2a', label: 'Shadows', date: 'Apr 3', hasPhoto: false },
  { id: 4, color: '#4a2a3a', label: 'Geometry', date: 'Apr 2', hasPhoto: true },
  { id: 5, color: '#5a4a2a', label: 'Golden Hour', date: 'Apr 1', hasPhoto: false },
  { id: 6, color: '#2a4a3a', label: 'Still Life', date: 'Mar 31', hasPhoto: true },
  { id: 7, color: '#3a2a4a', label: 'Texture', date: 'Mar 30', hasPhoto: true },
];

const CHALLENGE_GRID = [
  { color: '#4a4a4a', aspect: 1 },
  { color: '#5a6a5a', aspect: 1 },
  { color: '#7a6a5a', aspect: 1 },
  { color: '#3a4a5a', aspect: 1 },
];

type Picture = typeof YOUR_PICTURES[0];

export default function TodayScreen() {
  const [uploadedUri, setUploadedUri] = useState<string | null>(null);
  const [expandedPicture, setExpandedPicture] = useState<Picture | null>(null);

  const quote = useMemo(
    () => quotes[Math.floor(Math.random() * quotes.length)],
    [],
  );

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
      setUploadedUri(result.assets[0].uri);
      Alert.alert('Shot uploaded!', 'Nice work — your streak continues.');
    }
  };

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

        {/* Streak Hero */}
        <View style={styles.streakSection}>
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

        {/* Level Indicator */}
        <View style={styles.levelRow}>
          <Ionicons name="chevron-back" size={14} color={Colors.textMuted} />
          <Text style={styles.levelText}>LEVEL</Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
        </View>

        {/* Role Badge */}
        <View style={styles.roleBadge}>
          <Ionicons name="eye-outline" size={16} color={Colors.primary} />
          <Text style={styles.roleText}>Lead Observer</Text>
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
          {YOUR_PICTURES.map((pic) => (
            <TouchableOpacity
              key={pic.id}
              style={styles.yourPictureItem}
              onPress={() => pic.hasPhoto && setExpandedPicture(pic)}
              activeOpacity={pic.hasPhoto ? 0.8 : 1}
            >
              <View
                style={[
                  styles.yourPictureThumbnail,
                  pic.hasPhoto
                    ? { backgroundColor: pic.color }
                    : styles.yourPictureMissed,
                ]}
              >
                {!pic.hasPhoto && (
                  <Ionicons name="camera-outline" size={18} color={Colors.outlineVariant} />
                )}
              </View>
              <Text style={[styles.yourPictureDate, !pic.hasPhoto && styles.yourPictureDateMuted]}>
                {pic.date}
              </Text>
            </TouchableOpacity>
          ))}
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
              <View style={[styles.modalImage, { backgroundColor: expandedPicture?.color }]} />
              <View style={styles.modalMeta}>
                <Text style={styles.modalLabel}>{expandedPicture?.label}</Text>
                <Text style={styles.modalDate}>{expandedPicture?.date}</Text>
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

        {/* Today's Challenge Gallery — "Leading Lines" */}
        <View style={styles.challengeGallerySection}>
          <Text style={styles.sectionLabel}>{todayChallenge.challenge.title}</Text>
          <View style={styles.imageGrid}>
            {CHALLENGE_GRID.map((item, i) => (
              <View key={i} style={styles.imageGridItem}>
                <View style={[styles.imageGridPlaceholder, { backgroundColor: item.color }]} />
              </View>
            ))}
          </View>
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

  // Streak Hero
  streakSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
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

  // Level Indicator
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 20,
    marginTop: 12,
  },
  levelText: {
    ...Typography.labelSm,
    color: Colors.textMuted,
  },

  // Role Badge
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 20,
    marginTop: 16,
    gap: 8,
  },
  roleText: {
    ...Typography.labelMd,
    color: Colors.primary,
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

  // Challenge Gallery Section
  challengeGallerySection: {
    paddingHorizontal: 20,
    marginTop: 28,
  },
  sectionLabel: {
    ...Typography.headlineSm,
    color: Colors.onBackground,
    marginBottom: 16,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageGridItem: {
    width: '48.5%',
  },
  imageGridPlaceholder: {
    width: '100%',
    aspectRatio: 1.4,
    borderRadius: 2,
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
