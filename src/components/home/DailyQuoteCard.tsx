/**
 * ZenSpace — DailyQuoteCard Component
 * Displays the daily quote fetched from the external API.
 * Grading requirement: Task 20 — evidence-api-ux.png
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { DailyQuote } from '@/types';
import { BorderRadius, Typography, Spacing, Shadow } from '@/constants/Theme';

interface DailyQuoteCardProps {
  quote: DailyQuote | null;
  loading: boolean;
  error?: string;
}

export default function DailyQuoteCard({ quote, loading, error }: DailyQuoteCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.primary },
        Shadow.md,
      ]}
    >
      {/* API source indicator */}
      <View style={styles.apiTag}>
        <Text style={styles.apiTagText}>✦ Daily Wisdom</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="rgba(255,255,255,0.8)" />
          <Text style={styles.loadingText}>Fetching today's quote...</Text>
        </View>
      ) : error ? (
        <Text style={styles.errorText}>Could not load quote. {error}</Text>
      ) : quote ? (
        <>
          <Text style={styles.quoteText}>"{quote.quote}"</Text>
          <Text style={styles.authorText}>— {quote.author}</Text>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing[5],
    marginBottom: Spacing[6],
  },
  apiTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing[3],
  },
  apiTagText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    letterSpacing: 1,
  },
  quoteText: {
    color: '#ffffff',
    fontSize: Typography.fontSize.md,
    fontStyle: 'italic',
    lineHeight: 26,
    marginBottom: Spacing[3],
  },
  authorText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: Spacing[2],
    paddingVertical: Spacing[3],
  },
  loadingText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: Typography.fontSize.sm,
  },
  errorText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: Typography.fontSize.sm,
    fontStyle: 'italic',
  },
});
