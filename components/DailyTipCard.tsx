import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { DailyTip, TipVisualType } from '../data/dailyTips';

// ── Tip visuals rendered purely with Views ────────────────────────────────────

function RuleOfThirdsVisual() {
  return (
    <View style={visual.container}>
      {/* Grid lines — 2 vertical */}
      <View style={[visual.lineV, { left: '33.33%' }]} />
      <View style={[visual.lineV, { left: '66.66%' }]} />
      {/* Grid lines — 2 horizontal */}
      <View style={[visual.lineH, { top: '33.33%' }]} />
      <View style={[visual.lineH, { top: '66.66%' }]} />
      {/* Subject dot at right-center intersection */}
      <View style={[visual.dot, { left: '66.66%', top: '50%', marginLeft: -7, marginTop: -7 }]} />
    </View>
  );
}

function GoldenHourVisual() {
  return (
    <View style={[visual.container, { backgroundColor: '#2a3a50' }]}>
      {/* Sky gradient layers */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#1a2a40', top: 0, bottom: '50%' }]} />
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#c8722a', top: '45%', bottom: 0, opacity: 0.9 }]} />
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#e89840', top: '55%', bottom: 0, opacity: 0.8 }]} />
      {/* Horizon line */}
      <View style={[visual.lineH, { top: '58%', opacity: 0.3 }]} />
      {/* Sun */}
      <View style={[visual.sun, { left: '50%', top: '50%', marginLeft: -18, marginTop: -18 }]} />
      {/* Sun glow */}
      <View style={[visual.sunGlow, { left: '50%', top: '50%', marginLeft: -32, marginTop: -32 }]} />
    </View>
  );
}

function LeadingLinesVisual() {
  return (
    <View style={[visual.container, { backgroundColor: '#2c3028' }]}>
      {/* Converging lines from bottom corners to center-top vanishing point */}
      {/* We'll approximate with thin rotated views */}
      <View style={[visual.leadLine, { bottom: 0, left: 0, transform: [{ rotate: '-28deg' }, { translateX: -40 }] }]} />
      <View style={[visual.leadLine, { bottom: 0, left: '20%', transform: [{ rotate: '-16deg' }] }]} />
      <View style={[visual.leadLine, { bottom: 0, left: '40%', transform: [{ rotate: '-4deg' }] }]} />
      <View style={[visual.leadLine, { bottom: 0, right: '40%', transform: [{ rotate: '4deg' }] }]} />
      <View style={[visual.leadLine, { bottom: 0, right: '20%', transform: [{ rotate: '16deg' }] }]} />
      <View style={[visual.leadLine, { bottom: 0, right: 0, transform: [{ rotate: '28deg' }, { translateX: 40 }] }]} />
      {/* Vanishing point dot */}
      <View style={[visual.dot, { left: '50%', top: '22%', marginLeft: -5, marginTop: -5, width: 10, height: 10, borderRadius: 5 }]} />
    </View>
  );
}

function FramingVisual() {
  return (
    <View style={[visual.container, { backgroundColor: '#3a3028' }]}>
      {/* Outer dark frame */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#2a221a' }]} />
      {/* Inner scene */}
      <View style={visual.framingInner}>
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#5a6848', borderRadius: 2 }]} />
        {/* Subject dot in center of inner frame */}
        <View style={[visual.dot, { alignSelf: 'center', marginTop: 'auto', marginBottom: 'auto' }]} />
      </View>
    </View>
  );
}

function DepthVisual() {
  return (
    <View style={[visual.container, { backgroundColor: '#e8e4e0' }]}>
      {/* Background blurred circles */}
      <View style={[visual.depthCircle, { width: 60, height: 60, borderRadius: 30, left: '10%', top: '20%', backgroundColor: 'rgba(180,160,140,0.25)' }]} />
      <View style={[visual.depthCircle, { width: 80, height: 80, borderRadius: 40, right: '8%', top: '10%', backgroundColor: 'rgba(180,160,140,0.2)' }]} />
      <View style={[visual.depthCircle, { width: 50, height: 50, borderRadius: 25, right: '20%', bottom: '15%', backgroundColor: 'rgba(180,160,140,0.18)' }]} />
      {/* Sharp subject in focus */}
      <View style={[visual.depthSubject, { left: '50%', top: '50%', marginLeft: -28, marginTop: -28 }]} />
      {/* Focus zone indicator lines */}
      <View style={[visual.focusLine, { left: '42%', top: '20%', height: '60%' }]} />
      <View style={[visual.focusLine, { left: '62%', top: '20%', height: '60%' }]} />
    </View>
  );
}

function ExposureTriangleVisual() {
  return (
    <View style={[visual.container, { backgroundColor: '#1e2030' }]}>
      {/* Triangle sides approximated with rotated Views */}
      {/* Left side */}
      <View style={[visual.triLine, { bottom: '18%', left: '14%', width: '38%', transform: [{ rotate: '-56deg' }, { translateY: -1 }] }]} />
      {/* Right side */}
      <View style={[visual.triLine, { bottom: '18%', right: '14%', width: '38%', transform: [{ rotate: '56deg' }, { translateY: -1 }] }]} />
      {/* Bottom side */}
      <View style={[visual.triLine, { bottom: '18%', left: '14%', width: '72%', transform: [{ rotate: '0deg' }] }]} />
      {/* Vertex labels */}
      <Text style={[visual.triLabel, { top: '8%', left: 0, right: 0, textAlign: 'center' }]}>ISO</Text>
      <Text style={[visual.triLabel, { bottom: '6%', left: '8%' }]}>APERTURE</Text>
      <Text style={[visual.triLabel, { bottom: '6%', right: '2%', textAlign: 'right' }]}>SHUTTER</Text>
      {/* Center dot */}
      <View style={[visual.dot, { left: '50%', top: '52%', marginLeft: -5, marginTop: -5, width: 10, height: 10, borderRadius: 5 }]} />
    </View>
  );
}

function TipVisual({ type }: { type: TipVisualType }) {
  switch (type) {
    case 'ruleOfThirds':    return <RuleOfThirdsVisual />;
    case 'goldenHour':      return <GoldenHourVisual />;
    case 'leadingLines':    return <LeadingLinesVisual />;
    case 'framing':         return <FramingVisual />;
    case 'depth':           return <DepthVisual />;
    case 'exposureTriangle':return <ExposureTriangleVisual />;
  }
}

// ── Card ──────────────────────────────────────────────────────────────────────

interface Props {
  tip: DailyTip;
  onLearnMore?: () => void;
}

export default function DailyTipCard({ tip, onLearnMore }: Props) {
  return (
    <View style={styles.card}>
      {/* Visual illustration */}
      <TipVisual type={tip.visualType} />

      {/* Content */}
      <View style={styles.content}>
        {/* Label row */}
        <View style={styles.labelRow}>
          <Ionicons name="bulb" size={14} color={Colors.primaryContainer} />
          <Text style={styles.label}>DAILY TIP</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{tip.title.toUpperCase()}</Text>

        {/* Description */}
        <Text style={styles.description}>{tip.description}</Text>

        {/* Learn More CTA */}
        {onLearnMore && (
          <TouchableOpacity style={styles.learnMoreRow} onPress={onLearnMore} activeOpacity={0.7}>
            <Text style={styles.learnMoreText}>LEARN MORE</Text>
            <Ionicons name="arrow-forward" size={13} color={Colors.primary} style={{ marginLeft: 5 }} />
          </TouchableOpacity>
        )}
        {!onLearnMore && (
          <View style={styles.learnMoreRow}>
            <Text style={styles.learnMoreText}>LEARN MORE</Text>
            <Ionicons name="arrow-forward" size={13} color={Colors.primary} style={{ marginLeft: 5 }} />
          </View>
        )}
      </View>
    </View>
  );
}

// ── Visual styles ─────────────────────────────────────────────────────────────

const visual = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1.6,
    backgroundColor: '#dce8d8',
    borderRadius: 4,
    overflow: 'hidden',
  },
  lineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(80,100,80,0.25)',
  },
  lineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(80,100,80,0.25)',
  },
  dot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primaryContainer,
  },
  sun: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0c040',
  },
  sunGlow: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(240,180,40,0.25)',
  },
  leadLine: {
    position: 'absolute',
    height: '120%',
    width: 1,
    backgroundColor: 'rgba(220,200,160,0.35)',
  },
  framingInner: {
    position: 'absolute',
    top: '18%',
    left: '16%',
    right: '16%',
    bottom: '18%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  depthCircle: {
    position: 'absolute',
  },
  depthSubject: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.onSurfaceVariant,
    borderWidth: 3,
    borderColor: Colors.onBackground,
  },
  focusLine: {
    position: 'absolute',
    width: 1,
    backgroundColor: 'rgba(28,27,27,0.18)',
  },
  triLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: 'rgba(212,140,69,0.7)',
  },
  triLabel: {
    position: 'absolute',
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(212,140,69,0.85)',
    letterSpacing: 1.2,
  },
});

// ── Card styles ───────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
  content: {
    paddingTop: 20,
    paddingBottom: 4,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  label: {
    ...Typography.labelSm,
    color: Colors.primaryContainer,
    fontSize: 11,
    letterSpacing: 1.8,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    fontStyle: 'italic',
    color: Colors.onBackground,
    letterSpacing: -0.5,
    lineHeight: 38,
    marginBottom: 14,
  },
  description: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: 18,
  },
  learnMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  learnMoreText: {
    ...Typography.labelSm,
    color: Colors.primary,
    fontSize: 11,
    letterSpacing: 1.8,
  },
});
