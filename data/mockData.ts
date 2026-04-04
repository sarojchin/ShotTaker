import { DailyChallenge, Profile, Streak, LeaderboardEntry } from '../types';
import challenges from './challenges';

// --- Current user ---
export const currentUserStreak: Streak = {
  current: 14,
  longest: 21,
  thisWeek: [true, true, true, true, true, true, false], // Mon–Sun
};

export const currentUser: Profile = {
  id: 'me',
  username: 'you',
  avatarUrl: null,
  streak: currentUserStreak,
  points: 1240,
  completions: 23,
};

// --- Today's challenge ---
export const todayChallenge: DailyChallenge = {
  date: new Date().toISOString().split('T')[0],
  challenge: challenges[2], // Leading Lines
};

// --- Leaderboard ---
const leaderboardProfiles: Profile[] = [
  {
    id: '1',
    username: 'aperture_ace',
    avatarUrl: null,
    streak: { current: 21, longest: 21, thisWeek: [true, true, true, true, true, true, true] },
    points: 3850,
    completions: 52,
  },
  {
    id: '2',
    username: 'lenscraft',
    avatarUrl: null,
    streak: { current: 18, longest: 30, thisWeek: [true, true, true, true, true, true, false] },
    points: 3420,
    completions: 47,
  },
  {
    id: '3',
    username: 'shutterfly_99',
    avatarUrl: null,
    streak: { current: 15, longest: 22, thisWeek: [true, true, true, true, true, false, false] },
    points: 2980,
    completions: 41,
  },
  {
    id: '4',
    username: 'bokeh_king',
    avatarUrl: null,
    streak: { current: 12, longest: 19, thisWeek: [true, true, true, true, false, false, false] },
    points: 2510,
    completions: 35,
  },
  {
    id: '5',
    username: 'iso_hunter',
    avatarUrl: null,
    streak: { current: 9, longest: 16, thisWeek: [true, true, true, false, false, false, false] },
    points: 1890,
    completions: 28,
  },
  // current user will be inserted at rank 6
  {
    id: '6',
    username: 'f_stop_fanatic',
    avatarUrl: null,
    streak: { current: 5, longest: 11, thisWeek: [true, true, true, true, true, false, false] },
    points: 1100,
    completions: 19,
  },
  {
    id: '7',
    username: 'exposure_emily',
    avatarUrl: null,
    streak: { current: 4, longest: 8, thisWeek: [true, true, true, true, false, false, false] },
    points: 920,
    completions: 15,
  },
  {
    id: '8',
    username: 'pixel_wanderer',
    avatarUrl: null,
    streak: { current: 3, longest: 7, thisWeek: [true, true, true, false, false, false, false] },
    points: 680,
    completions: 11,
  },
  {
    id: '9',
    username: 'snap_scholar',
    avatarUrl: null,
    streak: { current: 2, longest: 5, thisWeek: [true, true, false, false, false, false, false] },
    points: 410,
    completions: 7,
  },
  {
    id: '10',
    username: 'viewfinder_viv',
    avatarUrl: null,
    streak: { current: 1, longest: 3, thisWeek: [true, false, false, false, false, false, false] },
    points: 220,
    completions: 4,
  },
];

export const leaderboard: LeaderboardEntry[] = [
  ...leaderboardProfiles.slice(0, 5).map((profile, i) => ({
    rank: i + 1,
    profile,
    isCurrentUser: false,
  })),
  {
    rank: 6,
    profile: currentUser,
    isCurrentUser: true,
  },
  ...leaderboardProfiles.slice(5).map((profile, i) => ({
    rank: i + 7,
    profile,
    isCurrentUser: false,
  })),
];

// --- Motivational quotes ---
export const quotes = [
  { text: 'Your first 10,000 photographs are your worst.', author: 'Henri Cartier-Bresson' },
  { text: 'The camera is an instrument that teaches people how to see without a camera.', author: 'Dorothea Lange' },
  { text: 'Photography is the story I fail to put into words.', author: 'Destin Sparks' },
  { text: 'In photography there is a reality so subtle that it becomes more real than reality.', author: 'Alfred Stieglitz' },
  { text: 'To me, photography is an art of observation. It\'s about finding something interesting in an ordinary place.', author: 'Elliott Erwitt' },
  { text: 'The best camera is the one you have with you.', author: 'Chase Jarvis' },
  { text: 'Light makes photography. Embrace light. Admire it. Love it. But above all, know light.', author: 'George Eastman' },
];
