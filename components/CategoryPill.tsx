import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { Category } from '../types';

const categoryColors: Record<Category, string> = {
  Composition: Colors.composition,
  Lighting: Colors.lighting,
  Technique: Colors.technique,
  Subject: Colors.subject,
};

interface Props {
  category: Category;
}

export default function CategoryPill({ category }: Props) {
  const color = categoryColors[category];
  return (
    <View style={[styles.pill, { backgroundColor: color + '15' }]}>
      <Text style={[styles.text, { color }]}>{category.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  text: {
    ...Typography.labelSm,
    fontSize: 10,
  },
});
