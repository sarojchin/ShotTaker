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

function ChallengeCard({ challenge, showTips = false }: Props) {
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
          <Text style={styles.tipsHeader}>Tips</Text>
          {challenge.tips.map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default React.memo(ChallengeCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  title: {
    ...Typography.title3,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  tipsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
  },
  tipsHeader: {
    ...Typography.headline,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  tipRow: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingRight: 16,
  },
  tipBullet: {
    ...Typography.body,
    color: Colors.accent,
    marginRight: 8,
    lineHeight: 24,
  },
  tipText: {
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 24,
  },
});
