import { BorderRadius, Typography } from "@/constants/Theme";
import { useTheme } from "@/context/ThemeContext";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
  textStyle,
}: ButtonProps) {
  const { colors } = useTheme();

  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      borderRadius: BorderRadius.lg,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
    };

    // Size
    if (size === "sm") {
      Object.assign(base, { paddingVertical: 8, paddingHorizontal: 16 });
    } else if (size === "md") {
      Object.assign(base, { paddingVertical: 14, paddingHorizontal: 24 });
    } else {
      Object.assign(base, { paddingVertical: 18, paddingHorizontal: 28 });
    }

    if (fullWidth) base.width = "100%";

    // Variant backgrounds
    switch (variant) {
      case "primary":
        return { ...base, backgroundColor: colors.primary };
      case "secondary":
        return { ...base, backgroundColor: colors.surfaceSecondary };
      case "outline":
        return {
          ...base,
          backgroundColor: "transparent",
          borderWidth: 1.5,
          borderColor: colors.primary,
        };
      case "ghost":
        return { ...base, backgroundColor: "transparent" };
      case "danger":
        return { ...base, backgroundColor: colors.error };
    }
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontWeight: Typography.fontWeight.semiBold,
      fontSize: size === "sm" ? Typography.fontSize.sm : Typography.fontSize.md,
    };

    switch (variant) {
      case "primary":
      case "danger":
        return { ...base, color: "#ffffff" };
      case "secondary":
        return { ...base, color: colors.text };
      case "outline":
      case "ghost":
        return { ...base, color: colors.primary };
    }
  };

  return (
    <TouchableOpacity
      style={[
        getContainerStyle(),
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "primary" || variant === "danger"
              ? "#fff"
              : colors.primary
          }
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});
