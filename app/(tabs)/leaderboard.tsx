import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Avatar from '../../components/Avatar';
import { leaderboard } from '../../data/mockData';
import { LeaderboardEntry } from '../../types';

const PODIUM_COLORS = [Colors.gold, Colors.silver, Colors.bronze];

function PodiumCard({ entry, index }: { entry: LeaderboardEntry; index: number }) {
  const medalColor = PODIUM_COLORS[index];
  const isFirst = index === 0;

  return (
    <View style={[styles.podiumCard, isFirst && styles.podiumCardFirst]}>
      <View style={[styles.medalBadge, { backgroundColor: medalColor + '25' }]}>
        <Ionicons name="trophy" size={isFirst ? 22 : 18} color={medalColor} />
      </View>
      <Avatar
        uri={entry.profile.avatarUrl}
        username={entry.profile.username}
        size={isFirst ? 64 : 52}
      />
      <Text style={styles.podiumName} numberOfLines={1}>
        {entry.profile.username}
      </Text>
      <Text style={styles.podiumPoints}>{entry.profile.points.toLocaleString()} pts</Text>
      <View style={styles.podiumStreak}>
        <Ionicons name="flame" size={12} color={Colors.streakFlame} />
        <Text style={styles.podiumStreakText}>{entry.profile.streak.current}</Text>
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
          <Ionicons name="flame" size={12} color={Colors.streakFlame} />
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
            <Text style={styles.header}>Leaderboard</Text>
            <Text style={styles.subtitle}>Top photographers this month</Text>

            {/* Podium */}
            <View style={styles.podiumRow}>
              {/* 2nd place */}
              <PodiumCard entry={top3[1]} index={1} />
              {/* 1st place */}
              <PodiumCard entry={top3[0]} index={0} />
              {/* 3rd place */}
              <PodiumCard entry={top3[2]} index={2} />
            </View>

            {/* Divider */}
            <View style={styles.divider} />
          </>
        }
        ItemSeparatorComponent={() => <View style={styles.rowSep} />}
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

  // Podium
  podiumRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 24,
  },
  podiumCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: 6,
  },
  podiumCardFirst: {
    paddingVertical: 20,
    borderColor: Colors.gold + '40',
  },
  medalBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumName: {
    ...Typography.caption1,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginTop: 4,
  },
  podiumPoints: {
    ...Typography.footnote,
    color: Colors.accent,
    fontWeight: '700',
  },
  podiumStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  podiumStreakText: {
    ...Typography.caption2,
    color: Colors.textMuted,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.surfaceBorder,
    marginBottom: 8,
  },

  // Rows
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  rowHighlighted: {
    borderColor: Colors.accent + '60',
    backgroundColor: Colors.accent + '10',
  },
  rank: {
    ...Typography.headline,
    color: Colors.textMuted,
    width: 24,
    textAlign: 'center',
  },
  rankHighlighted: {
    color: Colors.accent,
  },
  rowInfo: {
    flex: 1,
    gap: 3,
  },
  rowName: {
    ...Typography.subhead,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  rowNameHighlighted: {
    color: Colors.accent,
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
    ...Typography.headline,
    color: Colors.textSecondary,
  },
  rowPointsHighlighted: {
    color: Colors.accent,
  },
  rowSep: {
    height: 8,
  },
});
