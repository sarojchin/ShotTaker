import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import ChallengeCard from '../../components/ChallengeCard';
import { todayChallenge, currentUserStreak, quotes } from '../../data/mockData';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function TodayScreen() {
  const [uploadedUri, setUploadedUri] = useState<string | null>(null);

  const quote = useMemo(
    () => quotes[Math.floor(Math.random() * quotes.length)],
    [],
  );

  const dateString = useMemo(
    () => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    [],
  );

  const todayIndex = useMemo(() => new Date().getDay() - 1, []);

  const handleUpload = async () => {
    const ImagePicker = await import('expo-image-picker');
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
        {/* Header */}
        <Text style={styles.header}>Today</Text>
        <Text style={styles.subtitle}>{dateString}</Text>

        {/* Streak Banner */}
        <LinearGradient
          colors={['#FF6B35', '#FF9500']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.streakBanner}
        >
          <View style={styles.streakLeft}>
            <Ionicons name="flame" size={36} color={Colors.white} />
            <View>
              <Text style={styles.streakCount}>{currentUserStreak.current} Day Streak</Text>
              <Text style={styles.streakSub}>
                Longest: {currentUserStreak.longest} days
              </Text>
            </View>
          </View>
          <Text style={styles.streakEmoji}>🔥</Text>
        </LinearGradient>

        {/* Week Strip */}
        <View style={styles.weekContainer}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.weekRow}>
            {DAYS.map((day, i) => {
              const done = currentUserStreak.thisWeek[i];
              const isToday = i === todayIndex;
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
                      <Ionicons name="checkmark" size={16} color={Colors.white} />
                    ) : (
                      <View style={styles.dayDot} />
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Daily Challenge */}
        <Text style={styles.sectionTitle}>Daily Challenge</Text>
        <ChallengeCard challenge={todayChallenge.challenge} showTips />

        {/* Upload CTA */}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleUpload}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#FF6B35', '#CC5529']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.uploadGradient}
          >
            <Ionicons name="camera" size={24} color={Colors.white} />
            <Text style={styles.uploadText}>
              {uploadedUri ? 'Shot Uploaded ✓' : 'Upload Your Shot'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quote */}
        <View style={styles.quoteContainer}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={18}
            color={Colors.textMuted}
          />
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
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    ...Typography.largeTitle,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.callout,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 24,
  },

  // Streak
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  streakCount: {
    ...Typography.title3,
    color: Colors.white,
  },
  streakSub: {
    ...Typography.footnote,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  streakEmoji: {
    fontSize: 32,
  },

  // Week
  weekContainer: {
    marginBottom: 28,
  },
  sectionTitle: {
    ...Typography.headline,
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  dayCol: {
    alignItems: 'center',
    gap: 8,
  },
  dayLabel: {
    ...Typography.caption1,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  dayLabelToday: {
    color: Colors.accent,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleDone: {
    backgroundColor: Colors.accent,
  },
  dayCircleToday: {
    borderWidth: 2,
    borderColor: Colors.accent,
    backgroundColor: 'transparent',
  },
  dayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textMuted,
  },

  // Upload
  uploadButton: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  uploadGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  uploadText: {
    ...Typography.headline,
    color: Colors.white,
    fontSize: 18,
  },

  // Quote
  quoteContainer: {
    marginTop: 32,
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  quoteText: {
    ...Typography.subhead,
    color: Colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  quoteAuthor: {
    ...Typography.caption1,
    color: Colors.textMuted,
  },
});
