import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
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

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = SCREEN_W - 40; // marginHorizontal: 20 each side
const SWIPE_THRESHOLD = 60;

// Pre-computed grain dots — deterministic, no Math.random() on render
const GRAIN = Array.from({ length: 200 }, (_, i) => ({
  left: `${(((i * 127 + 37) % 97) / 97) * 100}%` as `${number}%`,
  top: `${(((i * 83 + 61) % 97) / 97) * 100}%` as `${number}%`,
  opacity: 0.04 + ((i * 11) % 4) * 0.018,
  size: 1 + ((i * 3) % 2),
}));

export default function QuoteCard({ quotes, initialIndex = 0 }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const dragX = useRef(new Animated.Value(0)).current;

  const rotate = dragX.interpolate({
    inputRange: [-CARD_W, 0, CARD_W],
    outputRange: ['-6deg', '0deg', '6deg'],
    extrapolate: 'clamp',
  });

  const cardOpacity = dragX.interpolate({
    inputRange: [-CARD_W, -CARD_W / 2, 0, CARD_W / 2, CARD_W],
    outputRange: [0.4, 0.75, 1, 0.75, 0.4],
    extrapolate: 'clamp',
  });

  const goNext = () => {
    Animated.timing(dragX, {
      toValue: -CARD_W * 1.3,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setIndex(i => (i + 1) % quotes.length);
      dragX.setValue(CARD_W * 1.3);
      Animated.spring(dragX, {
        toValue: 0,
        tension: 70,
        friction: 11,
        useNativeDriver: true,
      }).start();
    });
  };

  const goPrev = () => {
    Animated.timing(dragX, {
      toValue: CARD_W * 1.3,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setIndex(i => (i - 1 + quotes.length) % quotes.length);
      dragX.setValue(-CARD_W * 1.3);
      Animated.spring(dragX, {
        toValue: 0,
        tension: 70,
        friction: 11,
        useNativeDriver: true,
      }).start();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8,
      onPanResponderMove: (_, { dx }) => {
        dragX.setValue(dx);
      },
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -SWIPE_THRESHOLD) {
          goNext();
        } else if (dx > SWIPE_THRESHOLD) {
          goPrev();
        } else {
          Animated.spring(dragX, {
            toValue: 0,
            tension: 80,
            friction: 12,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const quote = quotes[index];

  return (
    <View style={styles.wrapper} {...panResponder.panHandlers}>
      {/* Swipe hint arrows — static, behind the card */}
      <View style={styles.arrowLeft} pointerEvents="none">
        <Ionicons name="chevron-back" size={16} color="rgba(255,255,255,0.2)" />
      </View>
      <View style={styles.arrowRight} pointerEvents="none">
        <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.2)" />
      </View>

      <Animated.View
        style={[
          styles.cardContainer,
          {
            opacity: cardOpacity,
            transform: [{ translateX: dragX }, { rotate }],
          },
        ]}
      >
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginTop: 32,
    height: 220,
    // overflow visible so the card can tilt outside bounds
  },
  arrowLeft: {
    position: 'absolute',
    left: -18,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  arrowRight: {
    position: 'absolute',
    right: -18,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  cardContainer: {
    position: 'absolute',
    width: CARD_W,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    borderRadius: 6,
  },
  card: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 24,
    borderRadius: 6,
    overflow: 'hidden',
  },
  grainDot: {
    position: 'absolute',
    backgroundColor: '#c8bdb0',
    borderRadius: 1,
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
});
