import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function SettingsLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Settings' }} />
      <Stack.Screen name="theme" options={{ title: 'Appearance' }} />
      <Stack.Screen name="notifications" options={{ title: 'Daily Reminders' }} />
    </Stack>
  );
}
