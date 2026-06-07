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
  View,
} from "react-native";

export default function SignupScreen() {
  const { colors } = useTheme();
  const { signup } = useAuth();

  // Form state — Task 6: three fields required
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation errors
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  function validate(): boolean {
    let valid = true;
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    if (!username.trim() || username.trim().length < 2) {
      setUsernameError("Username must be at least 2 characters.");
      valid = false;
    }

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
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    }

    return valid;
  }

  async function handleSignup() {
    if (!validate()) return;

    setLoading(true);
    const result = await signup(username.trim(), email.trim(), password);
    setLoading(false);

    if (!result.success) {
      // Task 7: This error shows in signup_error.png
      setGeneralError(result.error ?? "Registration failed. Please try again.");
    }
    // Success: AuthContext + RootNavigator redirect to (tabs) automatically
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
        {/* ── Brand ── */}
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
            Begin your mindfulness journey
          </Text>
        </View>

        {/* ── Form ── */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.heading, { color: colors.text }]}>
            Create account
          </Text>
          <Text style={[styles.subheading, { color: colors.textSecondary }]}>
            Join thousands finding daily calm
          </Text>

          {/* General error banner — Task 7 */}
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

          {/* Username field — Task 6: field 1 */}
          <Input
            label="Username"
            placeholder="Choose a username"
            value={username}
            onChangeText={(t) => {
              setUsername(t);
              setUsernameError("");
              setGeneralError("");
            }}
            autoCapitalize="none"
            autoComplete="username"
            leftIcon="person-outline"
            error={usernameError}
          />

          {/* Email field — Task 6: field 2 */}
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

          {/* Password field — Task 6: field 3 */}
          <Input
            label="Password"
            placeholder="Min. 6 characters"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setPasswordError("");
              setGeneralError("");
            }}
            secureTextEntry
            autoComplete="new-password"
            leftIcon="lock-closed-outline"
            error={passwordError}
          />

          {/* Sign up button — Task 6 */}
          <Button
            label="Create Account"
            onPress={handleSignup}
            loading={loading}
            style={{ marginTop: Spacing[2] }}
          />

          {/* Login link — Task 6 */}
          <View style={styles.loginRow}>
            <Text style={[styles.loginText, { color: colors.textSecondary }]}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>
                Log in
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
    marginBottom: Spacing[7],
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
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing[4],
  },
  loginText: {
    fontSize: Typography.fontSize.base,
  },
  loginLink: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
  },
});
