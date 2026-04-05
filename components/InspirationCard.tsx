import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { InspirationPhoto } from '../data/inspirations';

interface Props {
  photo: InspirationPhoto;
}

const SWIPE_THRESHOLD = 60;
const CARD_ASPECT = 1.25; // height = width * aspect

export default function InspirationCard({ photo }: Props) {
  const [cardWidth, setCardWidth] = useState(0);
  const [showingInsight, setShowingInsight] = useState(false);

  const isInsightRef = useRef(false);
  const cardWidthRef = useRef(0);
  const translateX = useRef(new Animated.Value(0)).current;

  // Progress 0 → 1 as card slides from front to back
  const insightProgress = translateX.interpolate({
    inputRange: [-400, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const frontOpacity = insightProgress.interpolate
    ? insightProgress.interpolate({
        inputRange: [0, 0.3],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      })
    : insightProgress;

  const backOpacity = translateX.interpolate({
    inputRange: [-400, -100, 0],
    outputRange: [1, 0.4, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 6 && Math.abs(gs.dx) > Math.abs(gs.dy),
      onPanResponderGrant: () => {
        translateX.stopAnimation();
      },
      onPanResponderMove: (_, gs) => {
        const base = isInsightRef.current ? -cardWidthRef.current : 0;
        const raw = base + gs.dx;
        const clamped = Math.max(-cardWidthRef.current, Math.min(0, raw));
        translateX.setValue(clamped);
      },
      onPanResponderRelease: (_, gs) => {
        const wasInsight = isInsightRef.current;
        const w = cardWidthRef.current;
        let snapTo: number;

        if (!wasInsight && gs.dx < -SWIPE_THRESHOLD) {
          snapTo = -w;
          isInsightRef.current = true;
          setShowingInsight(true);
        } else if (wasInsight && gs.dx > SWIPE_THRESHOLD) {
          snapTo = 0;
          isInsightRef.current = false;
          setShowingInsight(false);
        } else {
          snapTo = wasInsight ? -w : 0;
        }

        Animated.spring(translateX, {
          toValue: snapTo,
          useNativeDriver: true,
          friction: 9,
          tension: 130,
        }).start();
      },
    })
  ).current;

  const handleLayout = (e: { nativeEvent: { layout: { width: number } } }) => {
    const w = e.nativeEvent.layout.width;
    cardWidthRef.current = w;
    setCardWidth(w);
  };

  const cardHeight = cardWidth > 0 ? cardWidth * CARD_ASPECT : 0;

  return (
    <View
      style={styles.wrapper}
      onLayout={handleLayout}
      {...panResponder.panHandlers}
    >
      {cardWidth > 0 && (
        <View style={[styles.cardClip, { height: cardHeight }]}>
          {/* Sliding panel row */}
          <Animated.View
            style={[
              styles.panelRow,
              { width: cardWidth * 2, height: cardHeight },
              { transform: [{ translateX }] },
            ]}
          >
            {/* ── FRONT PANEL ── */}
            <View style={[styles.panel, { width: cardWidth, height: cardHeight }]}>
              {/* Background image placeholder */}
              <View
                style={[
                  styles.imageFill,
                  { backgroundColor: photo.backgroundColor },
                ]}
              />

              {/* Bottom gradient overlay */}
              <LinearGradient
                colors={photo.gradientColors}
                locations={[0, 0.45, 1]}
                style={styles.gradient}
              />

              {/* Foreground content */}
              <View style={styles.frontContent}>
                <Text style={styles.inspirationLabel}>INSPIRATION</Text>

                <Text style={styles.photoTitle}>{photo.title}</Text>

                <View style={styles.metaRow}>
                  <Text style={styles.photographerText}>
                    {photo.photographer.toUpperCase()}
                  </Text>
                  <View style={styles.metaDot} />
                  <Text style={styles.photographerText}>{photo.year}</Text>
                </View>

                {/* Swipe hint + page indicator */}
                <View style={styles.frontBottom}>
                  <View style={styles.pageIndicator}>
                    <View style={[styles.dash, styles.dashActive]} />
                    <View style={[styles.dash, styles.dashInactive]} />
                  </View>
                  <View style={styles.swipeHint}>
                    <Text style={styles.swipeHintText}>SWIPE{'\n'}FOR{'\n'}INSIGHT</Text>
                    <Ionicons name="arrow-forward" size={16} color="rgba(255,255,255,0.6)" style={{ marginLeft: 6 }} />
                  </View>
                </View>
              </View>
            </View>

            {/* ── BACK PANEL (Insight) ── */}
            <View style={[styles.panel, styles.insightPanel, { width: cardWidth, height: cardHeight }]}>
              {/* Fixed header row */}
              <View style={styles.insightTopRow}>
                <Ionicons name="arrow-back" size={14} color="rgba(255,255,255,0.35)" />
                <Text style={styles.insightBackLabel}>PHOTO</Text>
                <View style={{ flex: 1 }} />
                <Text style={styles.insightHeading}>INSIGHT</Text>
              </View>

              {/* Scrollable content */}
              <ScrollView
                style={styles.insightScroll}
                contentContainerStyle={styles.insightScrollContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
              >
                {/* Photographer + year recap */}
                <Text style={styles.insightPhotographer}>
                  {photo.photographer.toUpperCase()} · {photo.year}
                </Text>
                <Text style={styles.insightTitle}>{photo.title}</Text>

                {/* Divider */}
                <View style={styles.insightDivider} />

                {/* History */}
                <Text style={styles.insightSectionLabel}>HISTORY</Text>
                <Text style={styles.insightBody}>{photo.history}</Text>

                {/* Technique */}
                <View style={styles.insightSpacer} />
                <Text style={styles.insightSectionLabel}>TECHNIQUE</Text>
                <Text style={styles.insightBody}>{photo.technique}</Text>

                {/* Bottom breathing room */}
                <View style={{ height: 8 }} />
              </ScrollView>

              {/* Fixed page indicator pinned to bottom */}
              <View style={styles.insightPageIndicator}>
                <View style={[styles.dash, styles.dashInactive]} />
                <View style={[styles.dash, styles.dashActive]} />
              </View>
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  cardClip: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  panelRow: {
    flexDirection: 'row',
  },
  panel: {
    overflow: 'hidden',
  },

  // ── Front ──
  imageFill: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  frontContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  inspirationLabel: {
    ...Typography.labelSm,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 10,
    letterSpacing: 2,
  },
  photoTitle: {
    fontSize: 32,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#ffffff',
    letterSpacing: -0.5,
    lineHeight: 38,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  photographerText: {
    ...Typography.labelSm,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 1.5,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primaryContainer,
    marginHorizontal: 8,
  },
  frontBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  pageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dash: {
    height: 2,
    borderRadius: 1,
  },
  dashActive: {
    width: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  dashInactive: {
    width: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swipeHintText: {
    ...Typography.labelSm,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 9,
    letterSpacing: 1.2,
    lineHeight: 13,
    textAlign: 'right',
  },

  // ── Back / Insight ──
  insightPanel: {
    backgroundColor: Colors.inverseSurface,
    flex: 1,
  },
  insightTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  insightBackLabel: {
    ...Typography.labelSm,
    color: 'rgba(255,255,255,0.35)',
    fontSize: 9,
    letterSpacing: 1.5,
  },
  insightHeading: {
    ...Typography.labelMd,
    color: Colors.primaryContainer,
    letterSpacing: 2.5,
  },
  insightScroll: {
    flex: 1,
  },
  insightScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  insightPhotographer: {
    ...Typography.labelSm,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  insightTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontStyle: 'italic',
    color: Colors.inverseOnSurface,
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  insightDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 18,
  },
  insightSectionLabel: {
    ...Typography.labelSm,
    color: Colors.primaryContainer,
    letterSpacing: 2,
    marginBottom: 8,
  },
  insightBody: {
    ...Typography.bodySm,
    color: 'rgba(245,240,238,0.75)',
    lineHeight: 20,
  },
  insightSpacer: {
    height: 18,
  },
  insightPageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 0,
  },
});
