import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { Difficulty } from '../types';

const difficultyColors: Record<Difficulty, string> = {
  Beginner: Colors.beginner,
  Intermediate: Colors.intermediate,
  Advanced: Colors.advanced,
};

interface Props {
  difficulty: Difficulty;
}

export default function DifficultyBadge({ difficulty }: Props) {
  const color = difficultyColors[difficulty];
  return (
    <View style={[styles.badge, { backgroundColor: color + '20', borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{difficulty}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    ...Typography.caption1,
    fontWeight: '600',
  },
});
