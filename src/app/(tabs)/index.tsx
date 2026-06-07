import DailyQuoteCard from "@/components/home/DailyQuoteCard";
import MeditationCard from "@/components/home/MeditationCard";
import ScreenHeaderBtn from "@/components/ui/ScreenHeaderBtn";
import { CATEGORIES, MEDITATION_SESSIONS } from "@/constants/MeditationData";
import { BorderRadius, Shadow, Spacing, Typography } from "@/constants/Theme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { DailyQuote, MeditationSession } from "@/types";
import { getDailyQuote } from "@/utils/api";
import { getFavorites, toggleFavorite } from "@/utils/storage";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [dailyQuote, setDailyQuote] = useState<DailyQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const sessions =
    selectedCategory === "all"
      ? MEDITATION_SESSIONS
      : MEDITATION_SESSIONS.filter((s) => s.category === selectedCategory);

  // Load favorites from local storage
  const loadFavorites = useCallback(async () => {
    const favs = await getFavorites();
    setFavorites(new Set(favs.map((f) => f.id)));
  }, []);

  // Fetch daily quote from external API — Task 19/20
  const loadQuote = useCallback(async () => {
    setQuoteLoading(true);
    const quote = await getDailyQuote();
    setDailyQuote(quote);
    setQuoteLoading(false);
  }, []);

  useEffect(() => {
    loadFavorites();
    loadQuote();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadFavorites(), loadQuote()]);
    setRefreshing(false);
  }, []);

  const handleFavoriteToggle = async (session: MeditationSession) => {
    const nowFav = await toggleFavorite(session);
    setFavorites((prev) => {
      const next = new Set(prev);
      if (nowFav) next.add(session.id);
      else next.delete(session.id);
      return next;
    });
  };

  const handleSessionPress = (session: MeditationSession) => {
    // Task 14: This navigation icon/touch navigates to the detail screen
    router.push(`/meditation/${session.id}`);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* ── Header — Task 12: logo in header ── */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={[styles.logoMark, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoEmoji}>🧘</Text>
          </View>
          <Text style={[styles.logoText, { color: colors.primary }]}>
            ZenSpace
          </Text>
        </View>

        {/* Settings icon — Task 22 */}
        <ScreenHeaderBtn
          iconName="menu-outline"
          onPress={() => router.push("/settings")}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={styles.scroll}
      >
        {/* ── Welcome greeting ── */}
        <View style={styles.greeting}>
          <Text style={[styles.greetingText, { color: colors.textSecondary }]}>
            Good {getTimeOfDay()},
          </Text>
          <Text style={[styles.greetingName, { color: colors.text }]}>
            {user?.username ?? "Practitioner"} 👋
          </Text>
        </View>

        {/* ── Daily Quote from API — Task 19/20 ── */}
        <DailyQuoteCard quote={dailyQuote} loading={quoteLoading} />

        {/* ── Quick stats ── */}
        <View style={styles.statsRow}>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              Shadow.sm,
            ]}
          >
            <Text style={[styles.statNum, { color: colors.primary }]}>
              {favorites.size}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              Saved
            </Text>
          </View>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              Shadow.sm,
            ]}
          >
            <Text style={[styles.statNum, { color: colors.primary }]}>
              {MEDITATION_SESSIONS.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              Sessions
            </Text>
          </View>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              Shadow.sm,
            ]}
          >
            <Text style={[styles.statNum, { color: colors.primary }]}>∞</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>
              Calm
            </Text>
          </View>
        </View>

        {/* ── Category filter ── */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Browse Sessions
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    selectedCategory === cat.id
                      ? colors.primary
                      : colors.surface,
                  borderColor:
                    selectedCategory === cat.id
                      ? colors.primary
                      : colors.border,
                },
              ]}
              onPress={() => setSelectedCategory(cat.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.categoryChipEmoji}>{cat.emoji}</Text>
              <Text
                style={[
                  styles.categoryChipLabel,
                  {
                    color:
                      selectedCategory === cat.id
                        ? "#ffffff"
                        : colors.textSecondary,
                  },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Session grid — Task 14: each card navigates to detail screen ── */}
        <View style={styles.sessionsGrid}>
          {sessions.map((session) => (
            <MeditationCard
              key={session.id}
              session={session}
              isFavorite={favorites.has(session.id)}
              onPress={() => handleSessionPress(session)}
              onFavoriteToggle={() => handleFavoriteToggle(session)}
            />
          ))}
        </View>

        <View style={{ height: Spacing[10] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  logoEmoji: {
    fontSize: 20,
  },
  logoText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.extraBold,
    letterSpacing: -0.5,
  },
  scroll: {
    padding: Spacing[5],
  },
  greeting: {
    marginBottom: Spacing[5],
  },
  greetingText: {
    fontSize: Typography.fontSize.base,
  },
  greetingName: {
    fontSize: Typography.fontSize["3xl"],
    fontWeight: Typography.fontWeight.bold,
    lineHeight: 38,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing[3],
    marginBottom: Spacing[6],
  },
  statCard: {
    flex: 1,
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: "center",
  },
  statNum: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing[3],
  },
  categoriesScroll: {
    marginBottom: Spacing[4],
  },
  categoriesContent: {
    gap: Spacing[2],
    paddingRight: Spacing[5],
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  categoryChipEmoji: {
    fontSize: 14,
  },
  categoryChipLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  sessionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing[3],
  },
});
