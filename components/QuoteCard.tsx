import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

interface Quote {
  text: string;
  author: string;
  authorTitle?: string;
}

interface QuoteCardProps {
  quote: Quote;
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <View style={styles.section}>
      {/* Background patches */}
      <View style={styles.patchGreen} />
      <View style={styles.patchGold} />

      {/* Elevated white card */}
      <View style={styles.card}>
        {/* Header row */}
        <View style={styles.header}>
          <Text style={styles.label}>QUOTES</Text>
          <Text style={styles.openQuoteMark}>{'\u201C'}</Text>
        </View>

        {/* Quote body */}
        <Text style={styles.quoteText}>
          {'\u201C'}{quote.text}{'\u201D'}
        </Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Attribution */}
        <Text style={styles.authorName}>{quote.author}</Text>
        {quote.authorTitle ? (
          <Text style={styles.authorTitle}>{quote.authorTitle}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 20,
    marginTop: 32,
    marginBottom: 8,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },

  // Decorative background patches
  patchGreen: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '55%',
    backgroundColor: '#8fa896',
  },
  patchGold: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: '55%',
    width: '50%',
    backgroundColor: '#c9b55a',
  },

  // White elevated card
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    shadowColor: Colors.onBackground,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 4,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    ...Typography.labelSm,
    color: Colors.primary,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  openQuoteMark: {
    fontSize: 40,
    lineHeight: 40,
    color: Colors.surfaceHighest,
    fontWeight: '700',
  },

  // Quote text — large italic
  quoteText: {
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: '500',
    color: Colors.onBackground,
    lineHeight: 30,
    letterSpacing: -0.2,
    marginBottom: 20,
  },

  // Thin divider
  divider: {
    height: 1,
    backgroundColor: Colors.outlineVariant,
    opacity: 0.5,
    marginBottom: 16,
  },

  // Attribution
  authorName: {
    ...Typography.labelMd,
    color: Colors.onBackground,
    fontSize: 12,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  authorTitle: {
    fontSize: 11,
    fontStyle: 'italic',
    fontWeight: '400',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    lineHeight: 16,
  },
});
