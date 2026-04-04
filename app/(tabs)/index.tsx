import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import { todayChallenge, currentUserStreak, quotes } from '../../data/mockData';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function TodayScreen() {
  const [uploadedUri, setUploadedUri] = useState<string | null>(null);

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
          <Text style={styles.streakOnFire}>On Fire</Text>
          <Text style={styles.streakDescription}>
            You're maintaining a {currentUserStreak.current}-day streak.{'\n'}
            Keep shooting to build your craft.
          </Text>
          <View style={styles.streakMeta}>
            <Text style={styles.streakMetaLabel}>LONGEST: {currentUserStreak.longest} DAYS</Text>
          </View>
        </View>

        {/* Role Badge */}
        <View style={styles.roleBadge}>
          <Ionicons name="eye-outline" size={16} color={Colors.primary} />
          <Text style={styles.roleText}>Lead Observer</Text>
        </View>

        {/* Week Strip */}
        <View style={styles.weekContainer}>
          <View style={styles.weekRow}>
            {DAYS.map((day, i) => {
              const done = currentUserStreak.thisWeek[i];
              const isToday = i === new Date().getDay() - 1;
              return (
                <View key={i} style={styles.dayCol}>
                  <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                    {day}
                  </Text>
                  <View
                    style={[
                      styles.dayCircle,
                      done && styles.dayCircleDone,
                      isToday && !done && styles.dayCircleToday,
                    ]}
                  >
                    {done ? (
                      <Ionicons name="checkmark" size={14} color={Colors.white} />
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

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

        {/* Daily Challenge - "Leading Lines" style card */}
        <View style={styles.challengeSection}>
          <Text style={styles.sectionLabel}>TODAY'S CHALLENGE</Text>
          <View style={styles.challengeCard}>
            <View style={styles.challengeHeader}>
              <Text style={styles.challengeCategory}>
                {todayChallenge.challenge.category.toUpperCase()}
              </Text>
              <View style={styles.challengeDiffBadge}>
                <Text style={styles.challengeDiffText}>
                  {todayChallenge.challenge.difficulty.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.challengeTitle}>{todayChallenge.challenge.title}</Text>
            <Text style={styles.challengeDesc}>{todayChallenge.challenge.description}</Text>
            {todayChallenge.challenge.tips.length > 0 && (
              <View style={styles.tipsSection}>
                <Text style={styles.tipsLabel}>QUICK TIPS</Text>
                {todayChallenge.challenge.tips.map((tip, i) => (
                  <View key={i} style={styles.tipRow}>
                    <View style={styles.tipDot} />
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Recent Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionLabel}>RECENT INSIGHTS</Text>
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

        {/* Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>"{quote.text}"</Text>
          <Text style={styles.quoteAuthor}>— {quote.author}</Text>
        </View>
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

  // Week Strip
  weekContainer: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 16,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol: {
    alignItems: 'center',
    gap: 8,
  },
  dayLabel: {
    ...Typography.labelSm,
    color: Colors.textMuted,
    fontSize: 11,
  },
  dayLabelToday: {
    color: Colors.primary,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleDone: {
    backgroundColor: Colors.primary,
  },
  dayCircleToday: {
    backgroundColor: Colors.primaryContainer + '30',
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

  // Daily Challenge
  challengeSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionLabel: {
    ...Typography.labelMd,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  challengeCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 6,
    padding: 24,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  challengeCategory: {
    ...Typography.labelSm,
    color: Colors.textMuted,
  },
  challengeDiffBadge: {
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  challengeDiffText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
  },
  challengeTitle: {
    ...Typography.headlineSm,
    color: Colors.onBackground,
    marginBottom: 10,
  },
  challengeDesc: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
  },
  tipsSection: {
    marginTop: 20,
    paddingTop: 20,
    backgroundColor: Colors.surfaceContainerLow,
    marginHorizontal: -24,
    marginBottom: -24,
    padding: 24,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  tipsLabel: {
    ...Typography.labelSm,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingRight: 8,
  },
  tipDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primaryContainer,
    marginRight: 10,
    marginTop: 8,
  },
  tipText: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    flex: 1,
    lineHeight: 20,
  },

  // Recent Insights
  insightsSection: {
    paddingLeft: 20,
    marginTop: 32,
  },
  insightsRow: {
    gap: 12,
    paddingRight: 20,
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

  // Quote
  quoteContainer: {
    marginTop: 32,
    marginHorizontal: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 6,
  },
  quoteText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  quoteAuthor: {
    ...Typography.labelSm,
    color: Colors.textMuted,
    marginTop: 10,
  },
});
