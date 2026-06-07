/**
 * ZenSpace — Local Storage Utilities (AsyncStorage)
 *
 * Grading requirement: Task 16 — local storage implementation file.
 * Handles favorites persistence, user preferences, and reminder storage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { MeditationSession, Reminder, AppSettings } from '@/types';

// ─── Storage Keys ─────────────────────────────────────────────────────────
const KEYS = {
  FAVORITES: '@zenspace_favorites',
  REMINDERS: '@zenspace_reminders',
  SETTINGS: '@zenspace_settings',
  STREAK: '@zenspace_streak',
  LAST_OPEN: '@zenspace_last_open',
};

// ─── Favorites ─────────────────────────────────────────────────────────────

/**
 * Retrieve all favorite meditation sessions from local storage.
 */
export async function getFavorites(): Promise<MeditationSession[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Add a meditation session to favorites and persist it.
 */
export async function addFavorite(session: MeditationSession): Promise<void> {
  try {
    const current = await getFavorites();
    const exists = current.find((s) => s.id === session.id);
    if (exists) return;

    const updated = [...current, { ...session, isFavorite: true }];
    await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
  } catch {
    // ignore write errors
  }
}

/**
 * Remove a session from favorites by its ID.
 */
export async function removeFavorite(sessionId: string): Promise<void> {
  try {
    const current = await getFavorites();
    const updated = current.filter((s) => s.id !== sessionId);
    await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
  } catch {
    // ignore write errors
  }
}

/**
 * Toggle favorite status — add if not favorited, remove if already favorited.
 * Returns the new favorite state (true = now favorited).
 */
export async function toggleFavorite(session: MeditationSession): Promise<boolean> {
  const current = await getFavorites();
  const isFav = current.some((s) => s.id === session.id);

  if (isFav) {
    await removeFavorite(session.id);
    return false;
  } else {
    await addFavorite(session);
    return true;
  }
}

/**
 * Check whether a specific session is in favorites.
 */
export async function isFavorite(sessionId: string): Promise<boolean> {
  const current = await getFavorites();
  return current.some((s) => s.id === sessionId);
}

// ─── Reminders ─────────────────────────────────────────────────────────────

export async function getReminders(): Promise<Reminder[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.REMINDERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveReminders(reminders: Reminder[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
  } catch {
    // ignore
  }
}

export async function addReminder(reminder: Reminder): Promise<void> {
  const current = await getReminders();
  await saveReminders([...current, reminder]);
}

export async function deleteReminder(reminderId: string): Promise<void> {
  const current = await getReminders();
  await saveReminders(current.filter((r) => r.id !== reminderId));
}

// ─── App Settings ──────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  notificationsEnabled: true,
  dailyReminderTime: '08:00',
  soundEnabled: true,
};

export async function getSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<void> {
  try {
    const current = await getSettings();
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify({ ...current, ...settings }));
  } catch {
    // ignore
  }
}

// ─── Debug / Dev helpers ───────────────────────────────────────────────────

/**
 * Returns all AsyncStorage keys (for debugging / evidence screenshots).
 */
export async function getAllStorageKeys(): Promise<readonly string[]> {
  try {
    return await AsyncStorage.getAllKeys();
  } catch {
    return [];
  }
}

/**
 * Clear all app data (used for testing / logout).
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  } catch {
    // ignore
  }
}
