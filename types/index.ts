export type Category = 'Composition' | 'Lighting' | 'Technique' | 'Subject';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Challenge {
  id: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  description: string;
  tips: string[];
}

export interface DailyChallenge {
  date: string; // ISO date
  challenge: Challenge;
}

export interface Streak {
  current: number;
  longest: number;
  thisWeek: boolean[]; // Mon-Sun, true = shot taken
}

export interface Profile {
  id: string;
  username: string;
  avatarUrl: string | null;
  streak: Streak;
  points: number;
  completions: number;
}

export interface Completion {
  id: string;
  userId: string;
  challengeId: string;
  imageUri: string;
  completedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  profile: Profile;
  isCurrentUser: boolean;
}
