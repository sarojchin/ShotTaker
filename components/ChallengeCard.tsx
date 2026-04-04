import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import CategoryPill from './CategoryPill';
import DifficultyBadge from './DifficultyBadge';
import { Challenge } from '../types';

interface Props {
  challenge: Challenge;
  showTips?: boolean;
}

export default function ChallengeCard({ challenge, showTips = false }: Props) {
  return (
    <View style={styles.card}>
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
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 6,
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
