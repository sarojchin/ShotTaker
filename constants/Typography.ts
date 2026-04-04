import { TextStyle } from 'react-native';

// "The Editorial Scale" — Inter as typographic workhorse
// Display/headlines: tight letter-spacing (-0.02em)
// Metadata labels: all-caps, wide letter-spacing (+0.05em)
// Body: generous line-height (1.5)

const Typography: Record<string, TextStyle> = {
  // Display — authoritative, editorial
  displayLg: {
    fontSize: 56,
    fontWeight: '700',
    letterSpacing: -1.12,  // -0.02em
    lineHeight: 64,
  },
  displayMd: {
    fontSize: 45,
    fontWeight: '700',
    letterSpacing: -0.9,
    lineHeight: 52,
  },

  // Headlines
  headlineLg: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.64,  // -0.02em
    lineHeight: 40,
  },
  headlineMd: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.56,
    lineHeight: 36,
  },
  headlineSm: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: -0.48,
    lineHeight: 32,
  },

  // Titles
  titleLg: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.44,
    lineHeight: 28,
  },
  titleMd: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleSm: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.1,
    lineHeight: 20,
  },

  // Body — breathable line-height
  bodyLg: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  bodyMd: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.25,
    lineHeight: 21,       // ~1.5x
  },
  bodySm: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.4,
    lineHeight: 18,
  },

  // Labels — metadata layer (camera-lens engraving style)
  labelLg: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.7,   // +0.05em
    lineHeight: 20,
    textTransform: 'uppercase',
  },
  labelMd: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  labelSm: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.55,
    lineHeight: 16,
    textTransform: 'uppercase',
  },

  // Legacy aliases for backwards compat during migration
  largeTitle: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.64,
    lineHeight: 40,
  },
  title1: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.56,
    lineHeight: 36,
  },
  title2: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.44,
    lineHeight: 28,
  },
  title3: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.4,
    lineHeight: 26,
  },
  headline: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.25,
    lineHeight: 21,
  },
  callout: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  subhead: {
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: -0.24,
    lineHeight: 22,
  },
  footnote: {
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: -0.08,
    lineHeight: 18,
  },
  caption1: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  caption2: {
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
};

export default Typography;
