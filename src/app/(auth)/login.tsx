import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { BorderRadius, Spacing, Typography } from "@/constants/Theme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function LoginScreen() {
  const { colors } = useTheme();
  const { login } = useAuth();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation error state
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  function validate(): boolean {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    if (!email.trim()) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    }

    return valid;
  }

  async function handleLogin() {
    if (!validate()) return;

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (!result.success) {
      // Task 10: This error message will appear in login_error.png
      setGeneralError(result.error ?? "Login failed. Please try again.");
    }
    // On success, AuthContext + RootNavigator redirect automatically
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Logo / Brand ── */}
        <View style={styles.brandContainer}>
          <View
            style={[styles.logoCircle, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.logoEmoji}>🧘</Text>
          </View>
          <Text style={[styles.appName, { color: colors.primary }]}>
            ZenSpace
          </Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            Find your inner calm
          </Text>
        </View>

        {/* ── Form Card ── */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.heading, { color: colors.text }]}>
            Welcome back
          </Text>
          <Text style={[styles.subheading, { color: colors.textSecondary }]}>
            Sign in to continue your journey
          </Text>

          {/* General error banner — Task 10 */}
          {generalError ? (
            <View
              style={[
                styles.errorBanner,
                {
                  backgroundColor: colors.error + "18",
                  borderColor: colors.error + "44",
                },
              ]}
            >
              <Text style={[styles.errorBannerText, { color: colors.error }]}>
                ⚠ {generalError}
              </Text>
            </View>
          ) : null}

          {/* Email field — Task 9 */}
          <Input
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setEmailError("");
              setGeneralError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            leftIcon="mail-outline"
            error={emailError}
          />

          {/* Password field — Task 9 */}
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setPasswordError("");
              setGeneralError("");
            }}
            secureTextEntry
            autoComplete="password"
            leftIcon="lock-closed-outline"
            error={passwordError}
          />

          {/* Sign in button — Task 9 */}
          <Button
            label="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: Spacing[2] }}
          />

          {/* Sign up link — Task 9 */}
          <View style={styles.signupRow}>
            <Text style={[styles.signupText, { color: colors.textSecondary }]}>
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text style={[styles.signupLink, { color: colors.primary }]}>
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: Spacing[5],
    paddingBottom: Spacing[10],
  },
  brandContainer: {
    alignItems: "center",
    marginBottom: Spacing[8],
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[3],
  },
  logoEmoji: {
    fontSize: 40,
  },
  appName: {
    fontSize: Typography.fontSize["4xl"],
    fontWeight: Typography.fontWeight.extraBold,
    letterSpacing: -0.5,
    marginBottom: Spacing[1],
  },
  tagline: {
    fontSize: Typography.fontSize.base,
  },
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing[6],
    borderWidth: 1,
  },
  heading: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing[1],
  },
  subheading: {
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing[5],
  },
  errorBanner: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing[3],
    marginBottom: Spacing[4],
  },
  errorBannerText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing[4],
  },
  signupText: {
    fontSize: Typography.fontSize.base,
  },
  signupLink: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
  },
});
