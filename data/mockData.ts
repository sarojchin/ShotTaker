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

// --- Motivational quotes (30 entries for daily rotation) ---
export const quotes = [
  { text: 'Your first 10,000 photographs are your worst.', author: 'Henri Cartier-Bresson' },
  { text: 'The camera is an instrument that teaches people how to see without a camera.', author: 'Dorothea Lange' },
  { text: 'Photography is the story I fail to put into words.', author: 'Destin Sparks' },
  { text: 'In photography there is a reality so subtle that it becomes more real than reality.', author: 'Alfred Stieglitz' },
  { text: "To me, photography is an art of observation. It's about finding something interesting in an ordinary place.", author: 'Elliott Erwitt' },
  { text: 'The best camera is the one you have with you.', author: 'Chase Jarvis' },
  { text: 'Light makes photography. Embrace light. Admire it. Love it. But above all, know light.', author: 'George Eastman' },
  { text: 'A photograph is a secret about a secret. The more it tells you, the less you know.', author: 'Diane Arbus' },
  { text: 'Which of my photographs is my favourite? The one I\'m going to take tomorrow.', author: 'Imogen Cunningham' },
  { text: 'Photography takes an instant out of time, altering life by holding it still.', author: 'Dorothea Lange' },
  { text: 'The camera makes you forget you\'re there. It\'s not like you are hiding but you forget, you are just looking so much.', author: 'Annie Leibovitz' },
  { text: 'You don\'t take a photograph, you make it.', author: 'Ansel Adams' },
  { text: 'In every man\'s heart there is a secret nerve that answers to the vibrations of beauty.', author: 'Christopher Morley' },
  { text: 'To photograph is to appropriate the thing photographed.', author: 'Susan Sontag' },
  { text: 'The whole point of taking pictures is so that you don\'t have to explain things with words.', author: 'Elliott Erwitt' },
  { text: 'Landscape photography is the supreme test of the photographer, and often the supreme disappointment.', author: 'Ansel Adams' },
  { text: 'Life is like a camera. Focus on what\'s important, capture the good times, develop from the negatives.', author: 'Anonymous' },
  { text: 'There are no rules for good photographs, there are only good photographs.', author: 'Ansel Adams' },
  { text: 'Photography is a love affair with life.', author: 'Burk Uzzle' },
  { text: 'It is more important to click with people than to click the shutter.', author: 'Alfred Eisenstaedt' },
  { text: 'A good snapshot stops a moment from running away.', author: 'Eudora Welty' },
  { text: 'The picture that you took with your camera is the imagination you want to create with reality.', author: 'Scott Lorenzo' },
  { text: 'One photo out of focus is a mistake. Ten photos out of focus are an experimentation. One hundred photos out of focus are a style.', author: 'Anonymous' },
  { text: 'Black and white are the colors of photography. To me they symbolize the alternatives of hope and despair.', author: 'Robert Frank' },
  { text: 'In photography, the smallest thing can be a great subject. The little human detail can become a Leitmotiv.', author: 'Henri Cartier-Bresson' },
  { text: 'Photography is a way of feeling, of touching, of loving. What you have caught on film is captured forever.', author: 'Aaron Siskind' },
  { text: 'The eye should learn to listen before it looks.', author: 'Robert Frank' },
  { text: 'No place is boring if you\'ve had a good night\'s sleep and have a pocket full of unexposed film.', author: 'Robert Adams' },
  { text: 'Every photograph is a certificate of presence.', author: 'Roland Barthes' },
  { text: 'You put your camera around your neck along with putting on your shoes, and there it is, an appendage of the body that shares your life with you.', author: 'Annie Leibovitz' },
];
