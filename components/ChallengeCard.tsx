import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import CategoryPill from './CategoryPill';
import DifficultyBadge from './DifficultyBadge';
import { Challenge } from '../types';

// Map categories to placeholder colors for image area
const categoryImageColors: Record<string, string> = {
  Composition: '#5e6a7a',
  Lighting: '#7a6a4a',
  Technique: '#4a6a5a',
  Subject: '#6a5a7a',
};

interface Props {
  challenge: Challenge;
  showTips?: boolean;
}

function ChallengeCard({ challenge, showTips = false }: Props) {
  const imageColor = categoryImageColors[challenge.category] || '#5a5a5a';

  return (
    <View style={styles.card}>
      {/* Image placeholder */}
      <View style={[styles.imagePlaceholder, { backgroundColor: imageColor }]}>
        <Ionicons name="image-outline" size={28} color="rgba(255,255,255,0.25)" />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.badges}>
          <CategoryPill category={challenge.category} />
          <DifficultyBadge difficulty={challenge.difficulty} />
        </View>
        <Text style={styles.title}>{challenge.title}</Text>
        <Text style={styles.description}>{challenge.description}</Text>
        {showTips && challenge.tips.length > 0 && (
          <View style={styles.tipsSection}>
            <Text style={styles.tipsHeader}>TIPS</Text>
            {challenge.tips.map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <View style={styles.tipDot} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

export default React.memo(ChallengeCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 6,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    padding: 20,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  title: {
    ...Typography.titleLg,
    color: Colors.onBackground,
    marginBottom: 8,
  },
  description: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
  },
  tipsSection: {
    marginTop: 16,
    paddingTop: 16,
    backgroundColor: Colors.surfaceContainerLow,
    marginHorizontal: -20,
    marginBottom: -20,
    padding: 20,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  tipsHeader: {
    ...Typography.labelMd,
    color: Colors.textMuted,
    marginBottom: 10,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
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
});
