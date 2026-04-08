import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import StreakCalendar from '../../components/StreakCalendar';
import ShotUploadCard from '../../components/ShotUploadCard';

import QuoteCard from '../../components/QuoteCard';

import InspirationCard from '../../components/InspirationCard';
import DailyTipCard from '../../components/DailyTipCard';

import { LocalPhoto } from '../../types';
import { getPhotos, savePhoto } from '../../services/photoStorage';
import { currentUserStreak, quotes } from '../../data/mockData';
import inspirations from '../../data/inspirations';
import dailyTips from '../../data/dailyTips';

// modalOverlay has padding: 24 on each side → content fills the remaining width
const MODAL_CONTENT_WIDTH = Dimensions.get('window').width - 48;

// Placeholder gallery images (mock colors representing photos)
const GALLERY_STRIP = [
  { color: '#5a4a3a', label: 'Roads' },
  { color: '#3a4a5a', label: 'Rails' },
  { color: '#6a5a4a', label: 'Fences' },
  { color: '#4a5a3a', label: 'Paths' },
  { color: '#5a3a4a', label: 'Bridges' },
];

interface DaySlot {
  dateKey: string;
  dateLabel: string;
  photos: LocalPhoto[];
}

function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function buildDaySlots(photos: LocalPhoto[]): DaySlot[] {
  const photoMap = new Map<string, LocalPhoto[]>();
  photos.forEach((p) => {
    const arr = photoMap.get(p.dateKey) ?? [];
    arr.push(p);
    photoMap.set(p.dateKey, arr);
  });

  const slots: DaySlot[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateKey = localDateKey(d);
    const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    slots.push({
      dateKey,
      dateLabel,
      photos: photoMap.get(dateKey) ?? [],
    });
  }
  return slots;
}

export default function TodayScreen() {
  const [photos, setPhotos] = useState<LocalPhoto[]>([]);
  const [expandedSlot, setExpandedSlot] = useState<DaySlot | null>(null);
  const [initialPage, setInitialPage] = useState(0);

  const dismiss = useCallback(() => setExpandedSlot(null), []);

  const loadPhotos = useCallback(() => {
    setPhotos(getPhotos());
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const daySlots = useMemo(() => buildDaySlots(photos), [photos]);

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
        <ShotUploadCard
          onUploadComplete={(uri, title, location, caption, notes) => {
            const photo = savePhoto(uri, localDateKey(new Date()), { title, location, caption, notes });
            setPhotos((prev) =>
              [...prev, photo].sort((a, b) => b.dateKey.localeCompare(a.dateKey))
            );
          }}
          onReviewShot={() => {
            const todayKey = localDateKey(new Date());
            const slot = daySlots.find(s => s.dateKey === todayKey);
            if (!slot || slot.photos.length === 0) return;
            setInitialPage(slot.photos.length - 1);
            setExpandedSlot(slot);
          }}
        />

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
          {daySlots.map((slot) => (
            <TouchableOpacity
              key={slot.dateKey}
              style={styles.yourPictureItem}
              onPress={() => {
                if (slot.photos.length > 0) {
                  setInitialPage(0);
                  setExpandedSlot(slot);
                }
              }}
              activeOpacity={slot.photos.length > 0 ? 0.8 : 1}
            >
              {slot.photos.length > 0 ? (
                <View style={styles.stackContainer}>
                  {slot.photos.length >= 3 && (
                    <View style={[styles.yourPictureThumbnail, styles.stackLayerBack2]} />
                  )}
                  {slot.photos.length >= 2 && (
                    <View style={[styles.yourPictureThumbnail, styles.stackLayerBack1]} />
                  )}
                  <Image
                    source={{ uri: slot.photos[0].localPath }}
                    style={styles.yourPictureThumbnail}
                  />
                  {slot.photos.length > 1 && (
                    <View style={styles.stackBadge}>
                      <Text style={styles.stackBadgeText}>{slot.photos.length}</Text>
                    </View>
                  )}
                </View>
              ) : (
                <View style={[styles.yourPictureThumbnail, styles.yourPictureMissed]}>
                  <Ionicons name="camera-outline" size={18} color={Colors.outlineVariant} />
                </View>
              )}
              <Text style={[styles.yourPictureDate, slot.photos.length === 0 && styles.yourPictureDateMuted]}>
                {slot.dateLabel}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Expanded Picture Modal */}
        <Modal
          visible={expandedSlot !== null}
          transparent
          animationType="fade"
          onRequestClose={dismiss}
        >
          <View style={styles.modalOverlay}>
            {/* Background dismiss layer */}
            <TouchableWithoutFeedback onPress={dismiss}>
              <View style={StyleSheet.absoluteFillObject} />
            </TouchableWithoutFeedback>

            {expandedSlot && expandedSlot.photos.length > 1 ? (
              <FlatList
                key={expandedSlot.dateKey}
                data={expandedSlot.photos}
                horizontal
                pagingEnabled
                initialScrollIndex={initialPage}
                getItemLayout={(_, index) => ({
                  length: MODAL_CONTENT_WIDTH,
                  offset: MODAL_CONTENT_WIDTH * index,
                  index,
                })}
                keyExtractor={(item) => item.localPath}
                showsHorizontalScrollIndicator={false}
                style={{ width: MODAL_CONTENT_WIDTH }}
                renderItem={({ item, index: itemIdx }) => (
                  <View style={[styles.modalContent, { width: MODAL_CONTENT_WIDTH }]}>
                    <Image
                      source={{ uri: item.localPath }}
                      style={styles.modalImage}
                      resizeMode="cover"
                    />
                    <View style={styles.pageDots}>
                      {expandedSlot.photos.map((_, i) => (
                        <View
                          key={i}
                          style={[styles.pageDot, i === itemIdx && styles.pageDotActive]}
                        />
                      ))}
                    </View>
                    <View style={styles.modalMeta}>
                      {item.title ? <Text style={styles.modalLabel}>{item.title}</Text> : null}
                      <Text style={styles.modalDate}>{expandedSlot.dateLabel}</Text>
                    </View>
                    <TouchableOpacity style={styles.modalClose} onPress={dismiss}>
                      <Ionicons name="close" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                )}
              />
            ) : expandedSlot ? (
              <View style={styles.modalContent}>
                <Image
                  source={{ uri: expandedSlot.photos[0].localPath }}
                  style={styles.modalImage}
                  resizeMode="cover"
                />
                <View style={styles.modalMeta}>
                  {expandedSlot.photos[0].title ? <Text style={styles.modalLabel}>{expandedSlot.photos[0].title}</Text> : null}
                  <Text style={styles.modalDate}>{expandedSlot.dateLabel}</Text>
                </View>
                <TouchableOpacity style={styles.modalClose} onPress={dismiss}>
                  <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
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
  stackContainer: {
    width: 72,
    height: 72,
    position: 'relative',
  },
  stackLayerBack2: {
    position: 'absolute',
    top: -4,
    left: 4,
    transform: [{ rotate: '3deg' }],
    backgroundColor: Colors.surfaceContainerHigh,
  },
  stackLayerBack1: {
    position: 'absolute',
    top: -2,
    left: 2,
    transform: [{ rotate: '1.5deg' }],
    backgroundColor: Colors.surfaceContainerHigh,
  },
  stackBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackBadgeText: {
    ...Typography.labelSm,
    color: Colors.onPrimary,
    fontSize: 10,
    fontWeight: '700',
  },
  yourPictureDate: {
    ...Typography.labelSm,
    color: Colors.textMuted,
    marginTop: 5,
  },
  yourPictureDateMuted: {
    color: Colors.outlineVariant,
  },

  // Page dots
  pageDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  pageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  pageDotActive: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 16,
  },

  // Expanded Picture Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 6,
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    aspectRatio: 1,
  },
  modalMeta: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  modalLabel: {
    ...Typography.titleSm,
    color: '#fff',
  },
  modalDate: {
    ...Typography.labelSm,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  modalClose: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
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
