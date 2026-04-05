import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

interface Quote {
  text: string;
  author: string;
  role: string;
}

interface Props {
  quotes: Quote[];
  initialIndex?: number;
}

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = SCREEN_W - 40;
const SWIPE_THRESHOLD = 60;

const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';

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
    outputRange: [0.4, 0.8, 1, 0.8, 0.4],
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
      {/* Swipe hint arrows */}
      <View style={styles.arrowLeft} pointerEvents="none">
        <Ionicons name="chevron-back" size={16} color={Colors.outlineVariant} />
      </View>
      <View style={styles.arrowRight} pointerEvents="none">
        <Ionicons name="chevron-forward" size={16} color={Colors.outlineVariant} />
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
        <View style={styles.card}>
          {/* Decorative large closing quote — top right */}
          <Text style={styles.decorativeQuote}>"</Text>

          {/* Label */}
          <Text style={styles.label}>QUOTES</Text>

          {/* Quote text */}
          <Text style={styles.quoteText}>"{quote.text}"</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Author */}
          <Text style={styles.author}>{quote.author.toUpperCase()}</Text>
          {quote.role ? (
            <Text style={styles.role}>{quote.role.toUpperCase()}</Text>
          ) : null}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginTop: 32,
    overflow: 'visible',
  },
  arrowLeft: {
    position: 'absolute',
    left: -20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  arrowRight: {
    position: 'absolute',
    right: -20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  cardContainer: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  decorativeQuote: {
    position: 'absolute',
    top: 14,
    right: 20,
    fontSize: 72,
    fontFamily: SERIF,
    fontWeight: '700',
    color: Colors.outlineVariant,
    lineHeight: 72,
    opacity: 0.6,
  },
  label: {
    ...Typography.labelSm,
    color: Colors.primaryContainer,
    marginBottom: 16,
    letterSpacing: 1.5,
  },
  quoteText: {
    fontFamily: SERIF,
    fontStyle: 'italic',
    fontSize: 22,
    lineHeight: 32,
    color: Colors.onBackground,
    letterSpacing: 0.1,
    paddingRight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.outlineVariant,
    marginVertical: 20,
    opacity: 0.6,
  },
  author: {
    ...Typography.labelMd,
    color: Colors.onBackground,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  role: {
    ...Typography.labelSm,
    color: Colors.textMuted,
    letterSpacing: 1.1,
    fontSize: 10,
  },
});
