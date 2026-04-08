import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
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


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const MODAL_CONTENT_WIDTH = Dimensions.get('window').width;


// Placeholder gallery images (mock colors representing photos)
const GALLERY_STRIP = [
  { color: '#5a4a3a', label: 'Roads' },
  { color: '#3a4a5a', label: 'Rails' },
  { color: '#6a5a4a', label: 'Fences' },
  { color: '#4a5a3a', label: 'Paths' },
  { color: '#5a3a4a', label: 'Bridges' },
];

function formatDetailDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
                  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  return `${months[month - 1]} ${String(day).padStart(2, '0')}, ${year}`;
}

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
<<<<<<< HEAD
  const [detailPhotos, setDetailPhotos] = useState<LocalPhoto[] | null>(null);
  const [detailPhotoIdx, setDetailPhotoIdx] = useState(0);
  const lastUploadedPhoto = useRef<LocalPhoto | null>(null);

  const detailPhoto = detailPhotos ? detailPhotos[detailPhotoIdx] : null;
  const closeDetail = () => { setDetailPhotos(null); setDetailPhotoIdx(0); };
=======
  const [expandedSlot, setExpandedSlot] = useState<DaySlot | null>(null);
  const [initialPage, setInitialPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (expandedSlot && initialPage > 0) {
      const t = setTimeout(() => {
        scrollRef.current?.scrollTo({ x: MODAL_CONTENT_WIDTH * initialPage, animated: false });
      }, 0);
      return () => clearTimeout(t);
    }
  }, [expandedSlot]);

  const dismiss = useCallback(() => setExpandedSlot(null), []);
>>>>>>> claude/swipe-photo-detail-animation-lE7Pw

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
            lastUploadedPhoto.current = photo;
            setPhotos((prev) =>
              [...prev, photo].sort((a, b) => b.dateKey.localeCompare(a.dateKey))
            );
          }}
          onReviewShot={() => {
<<<<<<< HEAD
            if (lastUploadedPhoto.current) {
              setDetailPhotos([lastUploadedPhoto.current]);
              setDetailPhotoIdx(0);
            }
=======
            const todayKey = localDateKey(new Date());
            const slot = daySlots.find(s => s.dateKey === todayKey);
            if (!slot || slot.photos.length === 0) return;
            setInitialPage(slot.photos.length - 1);
            setExpandedSlot(slot);
>>>>>>> claude/swipe-photo-detail-animation-lE7Pw
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
<<<<<<< HEAD
                  setDetailPhotos(slot.photos);
                  setDetailPhotoIdx(0);
=======
                  setInitialPage(0);
                  setExpandedSlot(slot);
>>>>>>> claude/swipe-photo-detail-animation-lE7Pw
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

        {/* Photo Detail Modal */}
        <Modal
          visible={detailPhotos !== null}
          transparent
<<<<<<< HEAD
          animationType="slide"
          onRequestClose={closeDetail}
        >
          <View style={styles.detailOverlay}>
            <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={closeDetail} activeOpacity={1} />
            <View style={styles.detailCard}>
              {/* Header */}
              <View style={styles.detailHeader}>
                <TouchableOpacity style={styles.detailHeaderBtn} onPress={closeDetail} activeOpacity={0.7}>
                  <Ionicons name="close" size={20} color={Colors.onBackground} />
                </TouchableOpacity>
                <Text style={styles.detailHeaderTitle}>PHOTO_DETAIL</Text>
              </View>

              {/* Image area */}
              <View style={styles.detailImageContainer}>
                {detailPhotos && detailPhotos.length === 1 ? (
                  <Image
                    source={{ uri: detailPhotos[0].localPath }}
                    style={styles.detailImage}
                    resizeMode="cover"
                  />
                ) : detailPhotos && detailPhotos.length > 1 ? (
                  <FlatList
                    data={detailPhotos}
                    keyExtractor={(item) => item.localPath}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    getItemLayout={(_, index) => ({
                      length: SCREEN_WIDTH - 32,
                      offset: (SCREEN_WIDTH - 32) * index,
                      index,
                    })}
                    onMomentumScrollEnd={(e) => {
                      setDetailPhotoIdx(Math.round(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 32)));
                    }}
                    renderItem={({ item }) => (
                      <Image
                        source={{ uri: item.localPath }}
                        style={[styles.detailImage, { width: SCREEN_WIDTH - 32 }]}
                        resizeMode="cover"
                      />
                    )}
                  />
                ) : null}
              </View>

              {/* Pagination dots */}
              {detailPhotos && detailPhotos.length > 1 && (
                <View style={styles.pageDots}>
                  {detailPhotos.map((_, i) => (
                    <View key={i} style={[styles.pageDot, i === detailPhotoIdx && styles.pageDotActive]} />
                  ))}
                </View>
              )}

              {/* Metadata */}
              <ScrollView
                style={styles.detailScroll}
                contentContainerStyle={styles.detailBody}
                showsVerticalScrollIndicator={false}
              >
                {detailPhoto?.dateKey && (
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
                    <Text style={styles.detailDateText}>{formatDetailDate(detailPhoto.dateKey)}</Text>
                  </View>
                )}
                {detailPhoto?.location ? (
                  <View style={[styles.detailRow, { marginTop: 5 }]}>
                    <Ionicons name="location-outline" size={13} color={Colors.tertiary} />
                    <Text style={styles.detailLocationText}>{detailPhoto.location.toUpperCase()}</Text>
                  </View>
                ) : null}
                {detailPhoto?.title ? (
                  <Text style={styles.detailTitle}>{detailPhoto.title}</Text>
                ) : null}
                {(detailPhoto?.caption || detailPhoto?.notes) ? (
                  <View style={styles.detailDivider} />
                ) : null}
                {detailPhoto?.caption ? (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailMetaLabel}>CAPTION</Text>
                    <Text style={styles.detailMetaValue}>{detailPhoto.caption}</Text>
                  </View>
                ) : null}
                {detailPhoto?.notes ? (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailMetaLabel}>NOTES</Text>
                    <Text style={styles.detailMetaValue}>{detailPhoto.notes}</Text>
                  </View>
                ) : null}
              </ScrollView>
            </View>
=======
          animationType="fade"
          onRequestClose={dismiss}
        >
          <View style={styles.modalOverlay}>
            {/* Background dismiss layer */}
            <TouchableWithoutFeedback onPress={dismiss}>
              <View style={StyleSheet.absoluteFillObject} />
            </TouchableWithoutFeedback>

            {expandedSlot && expandedSlot.photos.length > 1 ? (
              <View style={{ width: MODAL_CONTENT_WIDTH, height: MODAL_CONTENT_WIDTH }}>
                <ScrollView
                  ref={scrollRef}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  style={{ flex: 1 }}
                >
                  {expandedSlot.photos.map((photo, itemIdx) => (
                    <View key={photo.localPath} style={[styles.modalContent, { width: MODAL_CONTENT_WIDTH, height: MODAL_CONTENT_WIDTH }]}>
                      <Image
                        source={{ uri: photo.localPath }}
                        style={styles.modalImage}
                        resizeMode="cover"
                      />
                      <View style={styles.modalMeta}>
                        <View style={styles.pageDots}>
                          {expandedSlot.photos.map((_, i) => (
                            <View
                              key={i}
                              style={[styles.pageDot, i === itemIdx && styles.pageDotActive]}
                            />
                          ))}
                        </View>
                        {photo.title ? <Text style={styles.modalLabel}>{photo.title}</Text> : null}
                        <Text style={styles.modalDate}>{expandedSlot.dateLabel}</Text>
                      </View>
                      <TouchableOpacity style={styles.modalClose} onPress={dismiss}>
                        <Ionicons name="close" size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
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
>>>>>>> claude/swipe-photo-detail-animation-lE7Pw
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

  // Page dots (inline inside meta overlay)
  pageDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 8,
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

  // Photo Detail Modal
  detailOverlay: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: 'rgba(28,27,27,0.85)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  detailCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
=======
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 6,
>>>>>>> claude/swipe-photo-detail-animation-lE7Pw
    overflow: 'hidden',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.surfaceElevated,
  },
  detailHeaderBtn: {
    width: 44,
    height: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  detailHeaderTitle: {
    flex: 1,
    textAlign: 'center',
    ...Typography.labelSm,
    color: Colors.primary,
    letterSpacing: 1.5,
    fontSize: 11,
  },
  detailImageContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.outlineVariant,
  },
  detailImage: {
    width: '100%',
    aspectRatio: 1,
  },
<<<<<<< HEAD
  detailScroll: {
    maxHeight: Math.round(SCREEN_HEIGHT * 0.3),
  },
  detailBody: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailDateText: {
    ...Typography.labelSm,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    fontSize: 11,
  },
  detailLocationText: {
    ...Typography.labelSm,
    color: Colors.tertiary,
    letterSpacing: 0.5,
    fontSize: 11,
  },
  detailTitle: {
    ...Typography.headlineLg,
    color: Colors.onBackground,
    fontSize: 26,
    lineHeight: 32,
    marginTop: 14,
  },
  detailDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.outlineVariant,
    marginVertical: 20,
=======
  modalMeta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalLabel: {
    ...Typography.titleSm,
    color: '#fff',
>>>>>>> claude/swipe-photo-detail-animation-lE7Pw
  },
  detailSection: {
    marginBottom: 16,
  },
  detailMetaLabel: {
    ...Typography.labelSm,
<<<<<<< HEAD
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
    fontSize: 10,
  },
  detailMetaValue: {
    ...Typography.bodyMd,
    color: Colors.onBackground,
=======
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
>>>>>>> claude/swipe-photo-detail-animation-lE7Pw
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
