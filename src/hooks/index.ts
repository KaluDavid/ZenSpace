import { DailyQuote, MeditationSession } from "@/types";
import { getDailyQuote } from "@/utils/api";
import { getFavorites, toggleFavorite } from "@/utils/storage";
import { useCallback, useEffect, useState } from "react";

// ─── useQuote ──────────────────────────────────────────────────────────────

interface UseQuoteReturn {
  quote: DailyQuote | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Fetches the daily quote from the external API.
 * Caches result to avoid multiple network calls.
 */
export function useQuote(): UseQuoteReturn {
  const [quote, setQuote] = useState<DailyQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = await getDailyQuote();
      setQuote(q);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load quote.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { quote, loading, error, refresh: fetch };
}

// ─── useFavorites ──────────────────────────────────────────────────────────

interface UseFavoritesReturn {
  favorites: Set<string>;
  loading: boolean;
  toggle: (session: MeditationSession) => Promise<void>;
  reload: () => Promise<void>;
}

/**
 * Manages the favorites set in memory, synced with AsyncStorage.
 */
export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const stored = await getFavorites();
    setFavorites(new Set(stored.map((s) => s.id)));
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const toggle = useCallback(async (session: MeditationSession) => {
    const nowFav = await toggleFavorite(session);
    setFavorites((prev) => {
      const next = new Set(prev);
      if (nowFav) next.add(session.id);
      else next.delete(session.id);
      return next;
    });
  }, []);

  return { favorites, loading, toggle, reload };
}
