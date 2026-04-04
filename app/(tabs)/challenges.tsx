import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import ChallengeCard from '../../components/ChallengeCard';
import challenges from '../../data/challenges';
import { Category, Difficulty } from '../../types';

const ChallengeSeparator = () => <View style={styles.separator} />;

const CATEGORIES: (Category | 'All')[] = ['All', 'Composition', 'Lighting', 'Technique', 'Subject'];
const DIFFICULTIES: (Difficulty | 'All')[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

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

  // Pick a featured challenge
  const featured = challenges[0]; // Rule of Thirds

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <Ionicons name="aperture" size={22} color={Colors.onBackground} />
            <Text style={styles.brandName}>APERTURE</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="search-outline" size={22} color={Colors.onBackground} />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.headerSection}>
          <Text style={styles.header}>CHALLENGES</Text>
          <Text style={styles.subtitle}>
            {filtered.length} challenge{filtered.length !== 1 ? 's' : ''} available
          </Text>
        </View>

        {/* Category Filter — chip style, no borders */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          style={styles.filterScroll}
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.filterChip,
                  active && styles.filterChipActive,
                ]}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {cat.toUpperCase()}
                </Text>
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
                  styles.filterChipSmall,
                  active && styles.filterChipSmallActive,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterTextSmall,
                    active && styles.filterTextSmallActive,
                  ]}
                >
                  {diff.toUpperCase()}
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
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            // Featured challenge hero
            <View style={styles.featuredCard}>
              <View style={styles.featuredImagePlaceholder}>
                <Ionicons name="aperture" size={48} color="rgba(255,255,255,0.3)" />
              </View>
              <View style={styles.featuredContent}>
                <Text style={styles.featuredLabel}>FEATURED</Text>
                <Text style={styles.featuredTitle}>The Rule of Thirds</Text>
                <Text style={styles.featuredDesc}>
                  Master the foundational composition technique that transforms ordinary
                  photos into compelling visual stories.
                </Text>
              </View>
            </View>
          }
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

  headerSection: {
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  header: {
    ...Typography.headlineLg,
    color: Colors.onBackground,
    letterSpacing: 1,
  },
  subtitle: {
    ...Typography.bodySm,
    color: Colors.textMuted,
    marginTop: 4,
  },

  // Filters — no borders, tonal shift
  filterScroll: {
    marginTop: 20,
    flexGrow: 0,
  },
  filterScrollSmall: {
    marginTop: 10,
    marginBottom: 4,
    flexGrow: 0,
  },
  filterRow: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: Colors.surfaceContainerLow,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    ...Typography.labelSm,
    color: Colors.textMuted,
  },
  filterTextActive: {
    color: Colors.onPrimary,
  },
  filterChipSmall: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: Colors.surfaceContainerLow,
  },
  filterChipSmallActive: {
    backgroundColor: Colors.secondaryContainer,
  },
  filterTextSmall: {
    ...Typography.labelSm,
    color: Colors.textMuted,
    fontSize: 10,
  },
  filterTextSmallActive: {
    color: Colors.onSurfaceVariant,
  },

  // Featured Card
  featuredCard: {
    backgroundColor: Colors.onBackground,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 24,
  },
  featuredImagePlaceholder: {
    height: 160,
    backgroundColor: '#3a3a3a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredContent: {
    padding: 20,
  },
  featuredLabel: {
    ...Typography.labelSm,
    color: Colors.primaryContainer,
    marginBottom: 8,
  },
  featuredTitle: {
    ...Typography.headlineSm,
    color: Colors.white,
    marginBottom: 8,
  },
  featuredDesc: {
    ...Typography.bodySm,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },

  // List
  listContent: {
    padding: 20,
    paddingTop: 16,
  },
  separator: {
    height: 16,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    ...Typography.bodyMd,
    color: Colors.textMuted,
  },
});
