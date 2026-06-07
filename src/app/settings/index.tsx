import { BorderRadius, Shadow, Spacing, Typography } from "@/constants/Theme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ── Settings menu items definition — Task 23 ──────────────────────────────
const SETTINGS_ITEMS = [
  {
    id: "appearance",
    label: "Appearance",
    subtitle: "Light / Dark mode",
    icon: "color-palette-outline" as const,
    route: "/settings/theme" as const,
    color: "#6c63ff",
  },
  {
    id: "favorites",
    label: "My Favorites",
    subtitle: "Saved meditation sessions",
    icon: "heart-outline" as const,
    route: "/(tabs)/favorites" as const,
    color: "#e17055",
  },
  {
    id: "reminders",
    label: "Daily Reminders",
    subtitle: "Manage notification schedule",
    icon: "notifications-outline" as const,
    route: "/settings/notifications" as const,
    color: "#00b894",
  },
];

export default function SettingsMenuScreen() {
  const { colors, isDark } = useTheme();
  const { user, logout } = useAuth();

  async function handleLogout() {
    Alert.alert("Sign Out", "Are you sure you want to sign out of ZenSpace?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── User profile card ── */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: colors.primary },
            Shadow.md,
          ]}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.avatarInitials ?? "ZS"}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user?.username ?? "Practitioner"}
            </Text>
            <Text style={styles.profileEmail}>{user?.email ?? ""}</Text>
          </View>
          <View
            style={[
              styles.themeBadge,
              { backgroundColor: "rgba(255,255,255,0.2)" },
            ]}
          >
            <Ionicons name={isDark ? "moon" : "sunny"} size={16} color="#fff" />
          </View>
        </View>

        {/* ── Menu items — Task 23 ── */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
          PREFERENCES
        </Text>

        <View
          style={[
            styles.menuGroup,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {SETTINGS_ITEMS.map((item, index) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.menuIconWrap,
                    { backgroundColor: item.color + "20" },
                  ]}
                >
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>
                <View style={styles.menuTextBlock}>
                  <Text style={[styles.menuLabel, { color: colors.text }]}>
                    {item.label}
                  </Text>
                  <Text
                    style={[styles.menuSubtitle, { color: colors.textMuted }]}
                  >
                    {item.subtitle}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
              {index < SETTINGS_ITEMS.length - 1 && (
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: colors.borderLight },
                  ]}
                />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* ── App info ── */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
          ABOUT
        </Text>

        <View
          style={[
            styles.menuGroup,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.menuItem}>
            <View
              style={[
                styles.menuIconWrap,
                { backgroundColor: "#0984e3" + "20" },
              ]}
            >
              <Ionicons
                name="information-circle-outline"
                size={22}
                color="#0984e3"
              />
            </View>
            <View style={styles.menuTextBlock}>
              <Text style={[styles.menuLabel, { color: colors.text }]}>
                Version
              </Text>
              <Text style={[styles.menuSubtitle, { color: colors.textMuted }]}>
                ZenSpace 1.0.0
              </Text>
            </View>
          </View>
          <View
            style={[styles.divider, { backgroundColor: colors.borderLight }]}
          />
          <View style={styles.menuItem}>
            <View
              style={[
                styles.menuIconWrap,
                { backgroundColor: "#a29bfe" + "20" },
              ]}
            >
              <Ionicons name="school-outline" size={22} color="#a29bfe" />
            </View>
            <View style={styles.menuTextBlock}>
              <Text style={[styles.menuLabel, { color: colors.text }]}>
                Course
              </Text>
              <Text style={[styles.menuSubtitle, { color: colors.textMuted }]}>
                IBM React Native Capstone — UVW Code Labs
              </Text>
            </View>
          </View>
        </View>

        {/* ── Logout button — Task 23 ── */}
        <TouchableOpacity
          style={[
            styles.logoutBtn,
            {
              backgroundColor: colors.error + "12",
              borderColor: colors.error + "30",
            },
          ]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={22} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>
            Sign Out
          </Text>
        </TouchableOpacity>

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
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing[6],
    gap: Spacing[3],
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: "#ffffff",
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  profileEmail: {
    color: "rgba(255,255,255,0.75)",
    fontSize: Typography.fontSize.sm,
    marginTop: 2,
  },
  themeBadge: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: 1.5,
    marginBottom: Spacing[2],
    marginTop: Spacing[1],
  },
  menuGroup: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: Spacing[5],
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing[4],
    gap: Spacing[3],
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  menuTextBlock: {
    flex: 1,
  },
  menuLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
  },
  menuSubtitle: {
    fontSize: Typography.fontSize.sm,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginLeft: 68,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
  },
});
