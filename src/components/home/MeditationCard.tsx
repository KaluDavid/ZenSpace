import { BorderRadius, Shadow, Spacing, Typography } from "@/constants/Theme";
import { useTheme } from "@/context/ThemeContext";
import { MeditationSession } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

interface MeditationCardProps {
  session: MeditationSession;
  isFavorite: boolean;
  onPress: () => void;
  onFavoriteToggle: () => void;
  horizontal?: boolean;
}

export default function MeditationCard({
  session,
  isFavorite,
  onPress,
  onFavoriteToggle,
  horizontal = false,
}: MeditationCardProps) {
  const { colors } = useTheme();
  const categoryColor = CATEGORY_COLORS[session.category] ?? colors.primary;
  const emoji = CATEGORY_EMOJIS[session.category] ?? "✨";

  if (horizontal) {
    return (
      <TouchableOpacity
        style={[
          styles.horizontalCard,
          { backgroundColor: colors.card, borderColor: colors.border },
          Shadow.sm,
        ]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        {/* Color bar */}
        <View
          style={[styles.horizontalAccent, { backgroundColor: categoryColor }]}
        />

        <View style={styles.horizontalContent}>
          <View style={styles.horizontalTop}>
            <Text style={[styles.emoji]}>{emoji}</Text>
            <Text
              style={[styles.cardTitle, { color: colors.text }]}
              numberOfLines={1}
            >
              {session.title}
            </Text>
          </View>
          <View style={styles.horizontalMeta}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: categoryColor + "22" },
              ]}
            >
              <Text style={[styles.categoryText, { color: categoryColor }]}>
                {session.category}
              </Text>
            </View>
            <Text style={[styles.duration, { color: colors.textMuted }]}>
              {session.duration} min
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={onFavoriteToggle} style={styles.favoriteBtn}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={22}
            color={isFavorite ? "#e17055" : colors.textMuted}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  // Vertical / grid card
  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        Shadow.sm,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Header color band */}
      <View
        style={[styles.cardHeader, { backgroundColor: categoryColor + "33" }]}
      >
        <Text style={styles.cardEmoji}>{emoji}</Text>
        <TouchableOpacity onPress={onFavoriteToggle} style={styles.cardFavBtn}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={20}
            color={isFavorite ? "#e17055" : colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.cardBody}>
        <Text
          style={[styles.cardTitle, { color: colors.text }]}
          numberOfLines={2}
        >
          {session.title}
        </Text>
        <View style={styles.cardFooter}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: categoryColor + "22" },
            ]}
          >
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {session.category}
            </Text>
          </View>
          <Text style={[styles.duration, { color: colors.textMuted }]}>
            ⏱ {session.duration}m
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Grid card
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
    flex: 1,
    minWidth: 160,
    maxWidth: "48%",
  },
  cardHeader: {
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: Spacing[3],
  },
  cardEmoji: {
    fontSize: 32,
    flex: 1,
    textAlign: "center",
  },
  cardFavBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 4,
  },
  cardBody: {
    padding: Spacing[3],
    gap: Spacing[2],
  },
  cardTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    lineHeight: 22,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // Horizontal card
  horizontalCard: {
    flexDirection: "row",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
    alignItems: "center",
    marginBottom: Spacing[3],
  },
  horizontalAccent: {
    width: 4,
    alignSelf: "stretch",
  },
  horizontalContent: {
    flex: 1,
    padding: Spacing[3],
    gap: Spacing[1],
  },
  horizontalTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },
  horizontalMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },
  emoji: {
    fontSize: 18,
  },
  favoriteBtn: {
    padding: Spacing[3],
  },

  // Shared
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  categoryText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    textTransform: "capitalize",
  },
  duration: {
    fontSize: Typography.fontSize.xs,
  },
});
