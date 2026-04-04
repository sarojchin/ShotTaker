import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

interface Quote {
  text: string;
  author: string;
}

interface Props {
  quotes: Quote[];
  initialIndex?: number;
}

// Pre-computed grain dots — deterministic, no Math.random() on render
const GRAIN = Array.from({ length: 200 }, (_, i) => ({
  left: `${(((i * 127 + 37) % 97) / 97) * 100}%` as `${number}%`,
  top: `${(((i * 83 + 61) % 97) / 97) * 100}%` as `${number}%`,
  opacity: 0.04 + ((i * 11) % 4) * 0.018,
  size: 1 + ((i * 3) % 2),
}));

const SWIPE_THRESHOLD = 50;

export default function QuoteCard({ quotes, initialIndex = 0 }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const translateX = useRef(new Animated.Value(0)).current;

  const quote = quotes[index];

  const advance = () => {
    Animated.sequence([
      Animated.timing(translateX, {
        toValue: -30,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
    setIndex(i => (i + 1) % quotes.length);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8,
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -SWIPE_THRESHOLD) {
          advance();
        }
      },
    }),
  ).current;

  return (
    <View style={styles.wrapper} {...panResponder.panHandlers}>
      <Animated.View style={{ transform: [{ translateX }] }}>
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

          {/* Quote counter */}
          <Text style={styles.counter}>
            {index + 1} / {quotes.length}
          </Text>

          {/* Opening quotation mark */}
          <Text style={styles.openingMark}>"</Text>

          {/* Quote body */}
          <Text style={styles.quoteText}>{quote.text}</Text>

          {/* Accent rule */}
          <View style={styles.divider} />

          {/* Attribution */}
          <Text style={styles.author}>— {quote.author}</Text>
        </LinearGradient>
      </Animated.View>

      {/* Next arrow — right edge */}
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={advance}
        hitSlop={{ top: 16, bottom: 16, left: 12, right: 12 }}
        activeOpacity={0.6}
      >
        <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.55)" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginTop: 32,
    borderRadius: 6,
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
    paddingRight: 48,
    borderRadius: 6,
    overflow: 'hidden',
  },
  grainDot: {
    position: 'absolute',
    backgroundColor: '#c8bdb0',
    borderRadius: 1,
  },
  counter: {
    ...Typography.labelSm,
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    marginBottom: 12,
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
  arrowButton: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
  },
});
