import Button from "@/components/ui/Button";
import { MEDITATION_SESSIONS } from "@/constants/MeditationData";
import { BorderRadius, Shadow, Spacing, Typography } from "@/constants/Theme";
import { useTheme } from "@/context/ThemeContext";
import { isFavorite, toggleFavorite } from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CATEGORY_COLORS: Record<string, string> = {
  morning: "#f6c90e",
  sleep: "#6c63ff",
  anxiety: "#00b894",
  focus: "#0984e3",
  breathing: "#00cec9",
  stress: "#e17055",
  mindfulness: "#a29bfe",
};

const CATEGORY_EMOJIS: Record<string, string> = {
  morning: "🌅",
  sleep: "🌙",
  anxiety: "🌿",
  focus: "🎯",
  breathing: "💨",
  stress: "☁️",
  mindfulness: "🧘",
};

export default function MeditationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const [favorited, setFavorited] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  const session = MEDITATION_SESSIONS.find((s) => s.id === id);

  useEffect(() => {
    if (session) {
      isFavorite(session.id).then(setFavorited);
    }
  }, [session?.id]);

  if (!session) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: colors.background }]}
      >
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: colors.text }]}>
            Session not found.
          </Text>
          <Button
            label="Go Back"
            onPress={() => router.back()}
            fullWidth={false}
          />
        </View>
      </SafeAreaView>
    );
  }

  const categoryColor = CATEGORY_COLORS[session.category] ?? colors.primary;
  const emoji = CATEGORY_EMOJIS[session.category] ?? "✨";

  const handleFavorite = async () => {
    const nowFav = await toggleFavorite(session);
    setFavorited(nowFav);
  };

  const handleStartSession = () => {
    setSessionStarted(true);
    Alert.alert(
      "🧘 Session Started",
      `Beginning "${session.title}". Find a comfortable position and close your eyes. This ${session.duration}-minute session has started.`,
      [{ text: "End Session", onPress: () => setSessionStarted(false) }],
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* ── Custom header with back button ── */}
      <View
        style={[
          styles.topBar,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        {/* Navigation back icon — Task 14 */}
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.surfaceSecondary }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back-outline" size={22} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.topBarTitle, { color: colors.text }]}>
          Session Details
        </Text>

        {/* Favorite button */}
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.surfaceSecondary }]}
          onPress={handleFavorite}
        >
          <Ionicons
            name={favorited ? "heart" : "heart-outline"}
            size={22}
            color={favorited ? "#e17055" : colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Hero card ── */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: categoryColor + "22",
              borderColor: categoryColor + "44",
            },
            Shadow.sm,
          ]}
        >
          <Text style={styles.heroEmoji}>{emoji}</Text>
          <View
            style={[styles.categoryTag, { backgroundColor: categoryColor }]}
          >
            <Text style={styles.categoryTagText}>
              {session.category.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* ── Title and meta ── */}
        <Text style={[styles.sessionTitle, { color: colors.text }]}>
          {session.title}
        </Text>

        {/* ── Info row ── */}
        <View style={styles.infoRow}>
          <View
            style={[
              styles.infoChip,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons name="time-outline" size={16} color={colors.primary} />
            <Text
              style={[styles.infoChipText, { color: colors.textSecondary }]}
            >
              {session.duration} min
            </Text>
          </View>

          <View
            style={[
              styles.infoChip,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons name="person-outline" size={16} color={colors.primary} />
            <Text
              style={[styles.infoChipText, { color: colors.textSecondary }]}
            >
              {session.instructor}
            </Text>
          </View>

          <View
            style={[
              styles.infoChip,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons
              name={favorited ? "heart" : "heart-outline"}
              size={16}
              color={favorited ? "#e17055" : colors.textMuted}
            />
            <Text
              style={[styles.infoChipText, { color: colors.textSecondary }]}
            >
              {favorited ? "Saved" : "Not saved"}
            </Text>
          </View>
        </View>

        {/* ── Description ── */}
        <View
          style={[
            styles.descriptionCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.descriptionLabel, { color: colors.textMuted }]}>
            About this session
          </Text>
          <Text style={[styles.descriptionText, { color: colors.text }]}>
            {session.description}
          </Text>
        </View>

        {/* ── Tags ── */}
        <View style={styles.tagsRow}>
          {session.tags.map((tag) => (
            <View
              key={tag}
              style={[styles.tag, { backgroundColor: colors.primary + "18" }]}
            >
              <Text style={[styles.tagText, { color: colors.primary }]}>
                #{tag}
              </Text>
            </View>
          ))}
        </View>

        {/* ── What to expect ── */}
        <View
          style={[
            styles.expectCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.expectTitle, { color: colors.text }]}>
            What to expect
          </Text>
          {[
            "Find a quiet, comfortable place to sit or lie down.",
            "Put on headphones for the best experience.",
            "Close your eyes and follow the guide's voice.",
            "Return gently if your mind wanders — that's normal.",
          ].map((step, i) => (
            <View key={i} style={styles.expectRow}>
              <View
                style={[styles.stepDot, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.stepNum}>{i + 1}</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                {step}
              </Text>
            </View>
          ))}
        </View>

        {/* ── CTA ── */}
        <Button
          label={
            sessionStarted
              ? "⏸ Session in Progress..."
              : `▶ Begin ${session.duration}-Min Session`
          }
          onPress={handleStartSession}
          disabled={sessionStarted}
          style={{ marginTop: Spacing[4] }}
        />

        <Button
          label={favorited ? "♥ Remove from Favorites" : "♡ Add to Favorites"}
          onPress={handleFavorite}
          variant="outline"
          style={{ marginTop: Spacing[3] }}
        />

        <View style={{ height: Spacing[10] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
  },
  scroll: {
    padding: Spacing[5],
  },
  heroCard: {
    height: 180,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[5],
    position: "relative",
  },
  heroEmoji: {
    fontSize: 72,
  },
  categoryTag: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  categoryTagText: {
    color: "#ffffff",
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: 1,
  },
  sessionTitle: {
    fontSize: Typography.fontSize["3xl"],
    fontWeight: Typography.fontWeight.bold,
    lineHeight: 38,
    marginBottom: Spacing[4],
  },
  infoRow: {
    flexDirection: "row",
    gap: Spacing[2],
    flexWrap: "wrap",
    marginBottom: Spacing[5],
  },
  infoChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  infoChipText: {
    fontSize: Typography.fontSize.sm,
  },
  descriptionCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing[4],
    marginBottom: Spacing[4],
  },
  descriptionLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing[2],
  },
  descriptionText: {
    fontSize: Typography.fontSize.base,
    lineHeight: 26,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing[2],
    marginBottom: Spacing[5],
  },
  tag: {
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  tagText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  expectCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing[4],
    gap: Spacing[3],
  },
  expectTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing[1],
  },
  expectRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[3],
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  stepNum: {
    color: "#fff",
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  stepText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    lineHeight: 22,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[4],
  },
  notFoundText: {
    fontSize: Typography.fontSize.lg,
  },
});
