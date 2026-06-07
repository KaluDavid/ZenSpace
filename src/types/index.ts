// ─── Auth ──────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // hashed/stored locally for demo
  createdAt: string;
  avatarInitials: string;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

// ─── Meditation / Content ──────────────────────────────────────────────────
export interface MeditationSession {
  id: string;
  title: string;
  category: MeditationCategory;
  duration: number; // minutes
  description: string;
  imageUrl?: string;
  isFavorite: boolean;
  tags: string[];
  instructor: string;
}

export type MeditationCategory =
  | "sleep"
  | "focus"
  | "anxiety"
  | "morning"
  | "breathing"
  | "mindfulness"
  | "stress";

// ─── Quote (from API) ─────────────────────────────────────────────────────
export interface DailyQuote {
  id: number;
  quote: string;
  author: string;
  category: string;
}

// ─── Settings ─────────────────────────────────────────────────────────────
export interface AppSettings {
  theme: "light" | "dark" | "system";
  notificationsEnabled: boolean;
  dailyReminderTime: string; // "HH:MM"
  soundEnabled: boolean;
}

// ─── Reminder / Notification ──────────────────────────────────────────────
export interface Reminder {
  id: string;
  title: string;
  time: string; // "HH:MM"
  date: string; // ISO date string
  enabled: boolean;
  notificationId?: string;
}

// ─── Navigation ───────────────────────────────────────────────────────────
export type RootStackParamList = {
  "(auth)/login": undefined;
  "(auth)/signup": undefined;
  "(tabs)": undefined;
  "(tabs)/index": undefined;
  "(tabs)/favorites": undefined;
  "settings/index": undefined;
  "settings/theme": undefined;
  "settings/notifications": undefined;
  "meditation/[id]": { id: string };
};
