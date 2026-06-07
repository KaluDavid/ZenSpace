import { BorderRadius, Shadow, Spacing, Typography } from "@/constants/Theme";
import { useTheme } from "@/context/ThemeContext";
import { Reminder } from "@/types";
import {
  cancelNotification,
  requestNotificationPermissions,
  scheduleNotification,
  triggerTestNotification,
} from "@/utils/notifications";
import {
  addReminder,
  deleteReminder,
  getReminders
} from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [testLoading, setTestLoading] = useState(false);

  // New reminder form state
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderHour, setReminderHour] = useState("08");
  const [reminderMinute, setReminderMinute] = useState("00");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadReminders();
    checkPermissions();
  }, []);

  async function checkPermissions() {
    const granted = await requestNotificationPermissions();
    setPermissionsGranted(granted);
  }

  async function loadReminders() {
    const stored = await getReminders();
    setReminders(stored);
  }

  /**
   * handleAddReminder — creates a new reminder and schedules a notification.
   * Grading requirement: Task 27 (configure screenshot).
   */
  async function handleAddReminder() {
    const hour = parseInt(reminderHour, 10);
    const minute = parseInt(reminderMinute, 10);

    if (
      isNaN(hour) ||
      hour < 0 ||
      hour > 23 ||
      isNaN(minute) ||
      minute < 0 ||
      minute > 59
    ) {
      Alert.alert(
        "Invalid Time",
        "Please enter a valid time (HH: 0–23, MM: 0–59).",
      );
      return;
    }

    if (!reminderTitle.trim()) {
      Alert.alert("Missing Title", "Please enter a name for your reminder.");
      return;
    }

    setAdding(true);

    const timeStr = `${reminderHour.padStart(2, "0")}:${reminderMinute.padStart(2, "0")}`;

    const newReminder: Reminder = {
      id: generateId(),
      title: reminderTitle.trim(),
      time: timeStr,
      date: new Date().toISOString(),
      enabled: true,
    };

    // Schedule the notification — Task 27
    if (permissionsGranted && notificationsEnabled) {
      const notifId = await scheduleNotification(newReminder);
      if (notifId) newReminder.notificationId = notifId;
    }

    await addReminder(newReminder);
    setReminders((prev) => [...prev, newReminder]);

    // Reset form
    setReminderTitle("");
    setReminderHour("08");
    setReminderMinute("00");
    setAdding(false);

    Alert.alert(
      "Reminder Set ✓",
      `"${newReminder.title}" scheduled for ${timeStr} daily.`,
    );
  }

  /**
   * deleteReminder — removes a reminder and cancels its scheduled notification.
   */
  async function handleDeleteReminder(reminder: Reminder) {
    if (reminder.notificationId) {
      await cancelNotification(reminder.notificationId);
    }
    await deleteReminder(reminder.id);
    setReminders((prev) => prev.filter((r) => r.id !== reminder.id));
  }

  /**
   * triggerTestNotification — sends an immediate notification for testing.
   * Grading requirement: Task 28 (notification-alert screenshot).
   */
  async function handleTestNotification() {
    setTestLoading(true);
    try {
      await triggerTestNotification();
      Alert.alert(
        "🔔 Test Sent",
        "A test notification has been sent. Check your notification tray.",
        [{ text: "Got it" }],
      );
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Could not send test notification.");
    } finally {
      setTestLoading(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Permission status ── */}
        <View
          style={[
            styles.permissionCard,
            {
              backgroundColor: permissionsGranted
                ? colors.success + "12"
                : colors.error + "12",
              borderColor: permissionsGranted
                ? colors.success + "30"
                : colors.error + "30",
            },
          ]}
        >
          <Ionicons
            name={permissionsGranted ? "checkmark-circle" : "alert-circle"}
            size={20}
            color={permissionsGranted ? colors.success : colors.error}
          />
          <Text
            style={[
              styles.permissionText,
              { color: permissionsGranted ? colors.success : colors.error },
            ]}
          >
            {permissionsGranted
              ? "Notification permissions granted"
              : "Notifications not permitted — tap to allow"}
          </Text>
          {!permissionsGranted && (
            <TouchableOpacity onPress={checkPermissions}>
              <Text style={[styles.allowText, { color: colors.primary }]}>
                Allow
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Master toggle — Task 27 ── */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={colors.primary}
              />
              <View>
                <Text style={[styles.rowLabel, { color: colors.text }]}>
                  Enable Notifications
                </Text>
                <Text style={[styles.rowSubtitle, { color: colors.textMuted }]}>
                  Receive daily mindfulness reminders
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary + "80" }}
              thumbColor={
                notificationsEnabled ? colors.primary : colors.textMuted
              }
            />
          </View>
        </View>

        {/* ── Add new reminder form — Task 27 ── */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
          ADD REMINDER
        </Text>

        <View
          style={[
            styles.section,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {/* Reminder title input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Reminder name
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  color: colors.text,
                  backgroundColor: colors.surfaceSecondary,
                  borderColor: colors.border,
                },
              ]}
              placeholder="e.g. Morning meditation"
              placeholderTextColor={colors.textMuted}
              value={reminderTitle}
              onChangeText={setReminderTitle}
            />
          </View>

          {/* Time inputs */}
          <View style={styles.timeRow}>
            <View style={styles.inputGroup}>
              <Text
                style={[styles.inputLabel, { color: colors.textSecondary }]}
              >
                Hour (0–23)
              </Text>
              <TextInput
                style={[
                  styles.timeInput,
                  {
                    color: colors.text,
                    backgroundColor: colors.surfaceSecondary,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="08"
                placeholderTextColor={colors.textMuted}
                value={reminderHour}
                onChangeText={setReminderHour}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>
            <Text style={[styles.timeSeparator, { color: colors.text }]}>
              :
            </Text>
            <View style={styles.inputGroup}>
              <Text
                style={[styles.inputLabel, { color: colors.textSecondary }]}
              >
                Minute (0–59)
              </Text>
              <TextInput
                style={[
                  styles.timeInput,
                  {
                    color: colors.text,
                    backgroundColor: colors.surfaceSecondary,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="00"
                placeholderTextColor={colors.textMuted}
                value={reminderMinute}
                onChangeText={setReminderMinute}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.addBtn,
              {
                backgroundColor:
                  notificationsEnabled && !adding
                    ? colors.primary
                    : colors.border,
              },
            ]}
            onPress={handleAddReminder}
            disabled={!notificationsEnabled || adding}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.addBtnText}>
              {adding ? "Scheduling..." : "Add Reminder"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Existing reminders list ── */}
        {reminders.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
              SCHEDULED ({reminders.length})
            </Text>
            <View
              style={[
                styles.section,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              {reminders.map((reminder, idx) => (
                <React.Fragment key={reminder.id}>
                  <View style={styles.reminderRow}>
                    <View
                      style={[
                        styles.reminderIconWrap,
                        { backgroundColor: colors.primary + "20" },
                      ]}
                    >
                      <Ionicons
                        name="alarm-outline"
                        size={18}
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.reminderInfo}>
                      <Text
                        style={[styles.reminderTitle, { color: colors.text }]}
                      >
                        {reminder.title}
                      </Text>
                      <Text
                        style={[
                          styles.reminderTime,
                          { color: colors.textMuted },
                        ]}
                      >
                        Daily at {reminder.time}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteReminder(reminder)}
                      style={styles.deleteBtn}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={colors.error}
                      />
                    </TouchableOpacity>
                  </View>
                  {idx < reminders.length - 1 && (
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
          </>
        )}

        {/* ── Test notification — Task 28 ── */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
          TEST
        </Text>

        <TouchableOpacity
          style={[
            styles.testBtn,
            {
              backgroundColor: colors.surface,
              borderColor: colors.primary + "40",
            },
            Shadow.sm,
          ]}
          onPress={handleTestNotification}
          disabled={testLoading}
          activeOpacity={0.8}
        >
          <Ionicons
            name="paper-plane-outline"
            size={22}
            color={colors.primary}
          />
          <View>
            <Text style={[styles.testBtnLabel, { color: colors.text }]}>
              {testLoading ? "Sending..." : "Send Test Notification"}
            </Text>
            <Text style={[styles.testBtnSub, { color: colors.textMuted }]}>
              Triggers an immediate notification
            </Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: Spacing[10] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: Spacing[5] },
  permissionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    padding: Spacing[3],
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing[5],
  },
  permissionText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  allowText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  sectionLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: 1.5,
    marginBottom: Spacing[2],
    marginTop: Spacing[1],
  },
  section: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing[4],
    marginBottom: Spacing[5],
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  rowSubtitle: { fontSize: Typography.fontSize.xs, marginTop: 2 },
  inputGroup: { flex: 1 },
  inputLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing[1],
  },
  textInput: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing[3],
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing[3],
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing[2],
    marginBottom: Spacing[3],
  },
  timeInput: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing[3],
    fontSize: Typography.fontSize.xl,
    textAlign: "center",
    fontWeight: Typography.fontWeight.bold,
  },
  timeSeparator: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    paddingBottom: Spacing[3],
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
  },
  addBtnText: {
    color: "#ffffff",
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing[2],
    gap: Spacing[3],
  },
  reminderIconWrap: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  reminderInfo: { flex: 1 },
  reminderTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  reminderTime: { fontSize: Typography.fontSize.sm, marginTop: 2 },
  deleteBtn: { padding: Spacing[2] },
  divider: { height: 1, marginVertical: Spacing[2] },
  testBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
  },
  testBtnLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
  },
  testBtnSub: { fontSize: Typography.fontSize.sm, marginTop: 2 },
});
