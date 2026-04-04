import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Avatar from '../../components/Avatar';
import { leaderboard } from '../../data/mockData';
import { LeaderboardEntry } from '../../types';

<<<<<<< HEAD
=======
const RowSeparator = () => <View style={styles.rowSep} />;

const PODIUM_COLORS = [Colors.gold, Colors.silver, Colors.bronze];

>>>>>>> 3598a4f3452aa4ae3b4d8a8c0906897067fc3a24
function PodiumCard({ entry, index }: { entry: LeaderboardEntry; index: number }) {
  const isFirst = index === 0;
  const podiumColors = [Colors.gold, Colors.silver, Colors.bronze];
  const medalColor = podiumColors[index];

  return (
    <View style={[styles.podiumCard, isFirst && styles.podiumCardFirst]}>
      <View style={[styles.medalBadge, { backgroundColor: medalColor + '20' }]}>
        <Text style={[styles.medalNumber, { color: medalColor }]}>{index + 1}</Text>
      </View>
      <Avatar
        uri={entry.profile.avatarUrl}
        username={entry.profile.username}
        size={isFirst ? 64 : 52}
      />
      <Text style={styles.podiumName} numberOfLines={1}>
        {entry.profile.username}
      </Text>
      <Text style={styles.podiumPoints}>{entry.profile.points.toLocaleString()}</Text>
      <Text style={styles.podiumPointsLabel}>POINTS</Text>
      <View style={styles.podiumStreak}>
        <View style={styles.streakDot} />
        <Text style={styles.podiumStreakText}>{entry.profile.streak.current}d streak</Text>
      </View>
    </View>
  );
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  return (
    <View
      style={[
        styles.row,
        entry.isCurrentUser && styles.rowHighlighted,
      ]}
    >
      <Text style={[styles.rank, entry.isCurrentUser && styles.rankHighlighted]}>
        {entry.rank}
      </Text>
      <Avatar uri={entry.profile.avatarUrl} username={entry.profile.username} size={40} />
      <View style={styles.rowInfo}>
        <Text style={[styles.rowName, entry.isCurrentUser && styles.rowNameHighlighted]}>
          {entry.profile.username}
          {entry.isCurrentUser ? ' (You)' : ''}
        </Text>
        <View style={styles.rowStats}>
          <View style={styles.streakDot} />
          <Text style={styles.rowStatText}>{entry.profile.streak.current}d streak</Text>
          <Text style={styles.rowStatDot}>·</Text>
          <Text style={styles.rowStatText}>{entry.profile.completions} shots</Text>
        </View>
      </View>
      <Text style={[styles.rowPoints, entry.isCurrentUser && styles.rowPointsHighlighted]}>
        {entry.profile.points.toLocaleString()}
      </Text>
    </View>
  );
}

export default function LeaderboardScreen() {
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={rest}
        keyExtractor={(item) => item.profile.id}
        renderItem={({ item }) => <LeaderboardRow entry={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Header Bar */}
            <View style={styles.headerBar}>
              <View style={styles.headerLeft}>
                <Ionicons name="aperture" size={22} color={Colors.onBackground} />
                <Text style={styles.brandName}>APERTURE</Text>
              </View>
            </View>

            <Text style={styles.header}>Leaderboard</Text>
            <Text style={styles.subtitle}>Top photographers this month</Text>

            {/* Podium */}
            <View style={styles.podiumRow}>
              <PodiumCard entry={top3[1]} index={1} />
              <PodiumCard entry={top3[0]} index={0} />
              <PodiumCard entry={top3[2]} index={2} />
            </View>

            {/* Section label */}
            <Text style={styles.sectionLabel}>ALL PHOTOGRAPHERS</Text>
          </>
        }
        ItemSeparatorComponent={RowSeparator}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Header Bar
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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

  header: {
    ...Typography.headlineLg,
    color: Colors.onBackground,
  },
  subtitle: {
    ...Typography.bodySm,
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: 24,
  },

  sectionLabel: {
    ...Typography.labelMd,
    color: Colors.textMuted,
    marginBottom: 12,
  },

  // Podium
  podiumRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 10,
    marginBottom: 28,
  },
  podiumCard: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 6,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  podiumCardFirst: {
    paddingVertical: 20,
    backgroundColor: Colors.surfaceContainerLow,
  },
  medalBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalNumber: {
    ...Typography.labelMd,
    fontWeight: '700',
  },
  podiumName: {
    ...Typography.labelSm,
    color: Colors.onBackground,
    marginTop: 4,
  },
  podiumPoints: {
    ...Typography.titleMd,
    color: Colors.primary,
  },
  podiumPointsLabel: {
    ...Typography.labelSm,
    color: Colors.textMuted,
    fontSize: 9,
  },
  podiumStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primaryContainer,
  },
  podiumStreakText: {
    ...Typography.caption2,
    color: Colors.textMuted,
  },

  // Rows — no borders, tonal shift
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 6,
    padding: 14,
    gap: 12,
  },
  rowHighlighted: {
    backgroundColor: Colors.secondaryContainer,
  },
  rank: {
    ...Typography.titleMd,
    color: Colors.textMuted,
    width: 24,
    textAlign: 'center',
  },
  rankHighlighted: {
    color: Colors.primary,
  },
  rowInfo: {
    flex: 1,
    gap: 3,
  },
  rowName: {
    ...Typography.titleSm,
    color: Colors.onBackground,
  },
  rowNameHighlighted: {
    color: Colors.primary,
  },
  rowStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowStatText: {
    ...Typography.caption1,
    color: Colors.textMuted,
  },
  rowStatDot: {
    ...Typography.caption1,
    color: Colors.textMuted,
  },
  rowPoints: {
    ...Typography.titleMd,
    color: Colors.onSurfaceVariant,
  },
  rowPointsHighlighted: {
    color: Colors.primary,
  },
  rowSep: {
    height: 8,
  },
});
