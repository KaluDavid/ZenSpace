import { BorderRadius, Shadow, Spacing, Typography } from "@/constants/Theme";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ThemeSettingsScreen() {
  const { colors, isDark, toggleTheme, theme, setTheme } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Current theme preview ── */}
        <View
          style={[
            styles.previewCard,
            { backgroundColor: isDark ? "#1a1a2e" : "#f8f7ff" },
            Shadow.sm,
          ]}
        >
          <View style={styles.previewHeader}>
            <View style={[styles.previewDot, { backgroundColor: "#ff6b6b" }]} />
            <View style={[styles.previewDot, { backgroundColor: "#ffd93d" }]} />
            <View style={[styles.previewDot, { backgroundColor: "#6bcb77" }]} />
          </View>
          <Text style={[styles.previewEmoji]}>{isDark ? "🌙" : "☀️"}</Text>
          <Text
            style={[
              styles.previewLabel,
              { color: isDark ? "#ffffff" : "#1a1a2e" },
            ]}
          >
            {isDark ? "Dark mode active" : "Light mode active"}
          </Text>
        </View>

        {/* ── Theme toggle — main feature of settings screen ── */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Theme
          </Text>

          {/* Quick toggle */}
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons
                name={isDark ? "moon-outline" : "sunny-outline"}
                size={22}
                color={colors.primary}
              />
              <View>
                <Text style={[styles.rowLabel, { color: colors.text }]}>
                  {isDark ? "Dark mode" : "Light mode"}
                </Text>
                <Text style={[styles.rowSubtitle, { color: colors.textMuted }]}>
                  Toggle app appearance
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary + "80" }}
              thumbColor={isDark ? colors.primary : colors.textMuted}
              ios_backgroundColor={colors.border}
            />
          </View>

          <View
            style={[styles.divider, { backgroundColor: colors.borderLight }]}
          />

          {/* Light mode option */}
          <TouchableOpacity
            style={styles.row}
            onPress={() => setTheme("light")}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="sunny-outline" size={22} color="#f6c90e" />
              <View>
                <Text style={[styles.rowLabel, { color: colors.text }]}>
                  Light
                </Text>
                <Text style={[styles.rowSubtitle, { color: colors.textMuted }]}>
                  Clean white interface
                </Text>
              </View>
            </View>
            {theme === "light" && (
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>

          <View
            style={[styles.divider, { backgroundColor: colors.borderLight }]}
          />

          {/* Dark mode option */}
          <TouchableOpacity
            style={styles.row}
            onPress={() => setTheme("dark")}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="moon-outline" size={22} color="#a29bfe" />
              <View>
                <Text style={[styles.rowLabel, { color: colors.text }]}>
                  Dark
                </Text>
                <Text style={[styles.rowSubtitle, { color: colors.textMuted }]}>
                  Easy on the eyes at night
                </Text>
              </View>
            </View>
            {theme === "dark" && (
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* ── Accessibility note ── */}
        <View
          style={[
            styles.noteCard,
            {
              backgroundColor: colors.primary + "10",
              borderColor: colors.primary + "25",
            },
          ]}
        >
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={colors.primary}
          />
          <Text style={[styles.noteText, { color: colors.textSecondary }]}>
            Your theme preference is saved locally and persists between
            sessions.
          </Text>
        </View>

        <View style={{ height: Spacing[10] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    padding: Spacing[5],
  },
  previewCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing[5],
    alignItems: "center",
    marginBottom: Spacing[6],
  },
  previewHeader: {
    flexDirection: "row",
    gap: 6,
    marginBottom: Spacing[4],
    alignSelf: "flex-start",
  },
  previewDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  previewEmoji: {
    fontSize: 48,
    marginBottom: Spacing[2],
  },
  previewLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  section: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: Spacing[5],
    padding: Spacing[4],
    gap: Spacing[1],
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing[2],
    color: "#888",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing[3],
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    flex: 1,
  },
  rowLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  rowSubtitle: {
    fontSize: Typography.fontSize.xs,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: Spacing[1],
  },
  noteCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[2],
    padding: Spacing[3],
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  noteText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    lineHeight: 20,
  },
});
