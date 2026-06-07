import { DailyQuote } from "@/types";

const QUOTE_API_URL = "https://zenquotes.io/api/random";
const FALLBACK_QUOTES: DailyQuote[] = [
  {
    id: 1,
    quote:
      "The present moment is the only moment available to us, and it is the door to all moments.",
    author: "Thich Nhat Hanh",
    category: "mindfulness",
  },
  {
    id: 2,
    quote: "Wherever you are, be there totally.",
    author: "Eckhart Tolle",
    category: "presence",
  },
  {
    id: 3,
    quote: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
    category: "peace",
  },
  {
    id: 4,
    quote: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "resilience",
  },
];

/**
 * Fetches a random daily quote from the ZenQuotes API.
 * Falls back to local quotes if the network request fails.
 */
export async function fetchDailyQuote(): Promise<DailyQuote> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const response = await fetch(QUOTE_API_URL, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    // ZenQuotes returns an array: [{ q: "quote", a: "author", c: "category" }]
    const data = await response.json();
    const raw = Array.isArray(data) ? data[0] : data;

    return {
      id: Date.now(),
      quote: raw.q || "Be present.",
      author: raw.a || "Unknown",
      category: raw.c || "mindfulness",
    };
  } catch (error) {
    // Network error or timeout — use fallback
    const fallback =
      FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
    return fallback;
  }
}

/**
 * Caches the fetched quote to AsyncStorage to avoid repeated API calls.
 * Returns cached quote if fetched today.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const QUOTE_CACHE_KEY = "@zenspace_daily_quote";
const QUOTE_DATE_KEY = "@zenspace_quote_date";

export async function getDailyQuote(): Promise<DailyQuote> {
  try {
    const today = new Date().toDateString();
    const storedDate = await AsyncStorage.getItem(QUOTE_DATE_KEY);

    if (storedDate === today) {
      const cached = await AsyncStorage.getItem(QUOTE_CACHE_KEY);
      if (cached) return JSON.parse(cached);
    }

    // Fetch fresh quote
    const quote = await fetchDailyQuote();

    // Cache it
    await AsyncStorage.setItem(QUOTE_CACHE_KEY, JSON.stringify(quote));
    await AsyncStorage.setItem(QUOTE_DATE_KEY, today);

    return quote;
  } catch {
    return fetchDailyQuote();
  }
}
