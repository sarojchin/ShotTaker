// TakeTheShot — "The Technical Gallerist" Design System
// Sophisticated light palette: charcoals, crisp whites, Golden Hour orange, Technical Blue

const Colors = {
  // Surface hierarchy (tonal layering, no borders)
  background: '#fcf9f8',           // surface - main canvas
  surface: '#f0edec',              // surface_container - content grouping
  surfaceContainerLow: '#f6f3f2',  // surface_container_low - subtle sections
  surfaceContainerHigh: '#eae7e6', // surface_container_high - deeper grouping
  surfaceElevated: '#ffffff',      // surface_container_lowest - lifted cards
  surfaceHighest: '#e4e1e0',      // surface_container_highest - input fills

  // Text / on-surface
  onBackground: '#1c1b1b',        // primary text — never use pure #000
  onSurface: '#1c1b1b',
  onSurfaceVariant: '#524440',     // secondary text
  textMuted: '#857a75',            // muted / tertiary text

  // Primary — "Golden Hour" orange
  primary: '#8b500a',
  primaryContainer: '#d48c45',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#3a1e00',

  // Secondary — warm neutral
  secondary: '#6f5b4f',
  secondaryContainer: '#ecdfd6',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#29150b',

  // Tertiary — "Technical Blue"
  tertiary: '#005bc1',
  tertiaryContainer: '#d4e3ff',
  onTertiary: '#ffffff',
  onTertiaryContainer: '#001b3f',

  // Outline
  outline: '#867771',
  outlineVariant: '#d7c3b3',       // ghost borders (15% opacity usage)

  // Inverse (for tooltips)
  inverseSurface: '#322f2e',
  inverseOnSurface: '#f5f0ee',

  // Error
  error: '#ba1a1a',
  errorContainer: '#ffdad6',

  // Streak / gamification
  streakFlame: '#d48c45',
  gold: '#b8860b',
  silver: '#8a8a8a',
  bronze: '#8b5e3c',

  // Category colors (muted, sophisticated)
  composition: '#5e7a9e',
  lighting: '#b8860b',
  technique: '#4a7c59',
  subject: '#7a5ea0',

  // Difficulty
  beginner: '#4a7c59',
  intermediate: '#b8860b',
  advanced: '#a63d2f',

  // Utility
  white: '#ffffff',
  black: '#1c1b1b',
  overlay: 'rgba(28,27,27,0.4)',
  success: '#4a7c59',
};

export default Colors;
