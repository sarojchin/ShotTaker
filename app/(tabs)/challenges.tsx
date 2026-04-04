import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import ChallengeCard from '../../components/ChallengeCard';
import challenges from '../../data/challenges';
import { Category, Difficulty } from '../../types';

const ChallengeSeparator = () => <View style={styles.separator} />;

const CATEGORIES: (Category | 'All')[] = ['All', 'Composition', 'Lighting', 'Technique', 'Subject'];
const DIFFICULTIES: (Difficulty | 'All')[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const categoryColors: Record<string, string> = {
  All: Colors.accent,
  Composition: Colors.composition,
  Lighting: Colors.lighting,
  Technique: Colors.technique,
  Subject: Colors.subject,
};

export default function ChallengesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');

  const filtered = useMemo(() => {
    return challenges.filter((c) => {
      const catMatch = selectedCategory === 'All' || c.category === selectedCategory;
      const diffMatch = selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;
      return catMatch && diffMatch;
    });
  }, [selectedCategory, selectedDifficulty]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.header}>Challenges</Text>
          <Text style={styles.subtitle}>
            {filtered.length} challenge{filtered.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          style={styles.filterScroll}
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            const color = categoryColors[cat];
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.filterChip,
                  active && { backgroundColor: color + '25', borderColor: color },
                ]}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterText, active && { color }]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Difficulty Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          style={styles.filterScrollSmall}
        >
          {DIFFICULTIES.map((diff) => {
            const active = selectedDifficulty === diff;
            return (
              <TouchableOpacity
                key={diff}
                onPress={() => setSelectedDifficulty(diff)}
                style={[
                  styles.filterChip,
                  styles.filterChipSmall,
                  active && { backgroundColor: Colors.accent + '25', borderColor: Colors.accent },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterText,
                    styles.filterTextSmall,
                    active && { color: Colors.accent },
                  ]}
                >
                  {diff}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Challenge List */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChallengeCard challenge={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={ChallengeSeparator}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No challenges match your filters.</Text>
            </View>
          }
        />
      </View>
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
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    ...Typography.largeTitle,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.callout,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  // Filters
  filterScroll: {
    marginTop: 20,
    flexGrow: 0,
  },
  filterScrollSmall: {
    marginTop: 10,
    marginBottom: 8,
    flexGrow: 0,
  },
  filterRow: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  filterChipSmall: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  filterText: {
    ...Typography.subhead,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  filterTextSmall: {
    ...Typography.footnote,
    fontWeight: '600',
  },

  // List
  listContent: {
    padding: 20,
  },
  separator: {
    height: 14,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textMuted,
  },
});
