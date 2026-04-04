import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

interface Quote {
  text: string;
  author: string;
}

interface Props {
  quote: Quote;
}

// Pre-computed grain dots — deterministic, no Math.random() on render
const GRAIN = Array.from({ length: 200 }, (_, i) => ({
  left: `${(((i * 127 + 37) % 97) / 97) * 100}%` as `${number}%`,
  top: `${(((i * 83 + 61) % 97) / 97) * 100}%` as `${number}%`,
  opacity: 0.04 + ((i * 11) % 4) * 0.018,
  size: 1 + ((i * 3) % 2),
}));

export default function QuoteCard({ quote }: Props) {
  const [saved, setSaved] = useState(false);

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#1a1714', '#22201c', '#1e1c17']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Film grain overlay */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {GRAIN.map((dot, i) => (
            <View
              key={i}
              style={[
                styles.grainDot,
                {
                  left: dot.left,
                  top: dot.top,
                  opacity: dot.opacity,
                  width: dot.size,
                  height: dot.size,
                },
              ]}
            />
          ))}
        </View>

        {/* Save / favourite button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => setSaved(s => !s)}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={saved ? 'heart' : 'heart-outline'}
            size={20}
            color={saved ? Colors.primaryContainer : 'rgba(255,255,255,0.4)'}
          />
        </TouchableOpacity>

        {/* Opening quotation mark */}
        <Text style={styles.openingMark}>"</Text>

        {/* Quote body */}
        <Text style={styles.quoteText}>{quote.text}</Text>

        {/* Accent rule */}
        <View style={styles.divider} />

        {/* Attribution */}
        <Text style={styles.author}>— {quote.author}</Text>

        {/* Saved badge */}
        {saved && (
          <View style={styles.savedBadge}>
            <Ionicons
              name="checkmark"
              size={10}
              color={Colors.primaryContainer}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.savedText}>SAVED TO FAVOURITES</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginTop: 32,
    borderRadius: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  card: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  grainDot: {
    position: 'absolute',
    backgroundColor: '#c8bdb0',
    borderRadius: 1,
  },
  saveButton: {
    position: 'absolute',
    top: 18,
    right: 18,
  },
  openingMark: {
    fontSize: 64,
    fontWeight: '700',
    color: Colors.primaryContainer,
    opacity: 0.35,
    lineHeight: 52,
    marginBottom: 8,
  },
  quoteText: {
    ...Typography.bodyLg,
    color: 'rgba(255,255,255,0.88)',
    fontStyle: 'italic',
    lineHeight: 26,
    letterSpacing: 0.15,
  },
  divider: {
    width: 28,
    height: 1,
    backgroundColor: Colors.primaryContainer,
    opacity: 0.55,
    marginVertical: 18,
  },
  author: {
    ...Typography.labelSm,
    color: Colors.primaryContainer,
    opacity: 0.8,
  },
  savedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(212,140,69,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(212,140,69,0.28)',
  },
  savedText: {
    ...Typography.labelSm,
    color: Colors.primaryContainer,
    fontSize: 10,
    letterSpacing: 1.4,
  },
});
