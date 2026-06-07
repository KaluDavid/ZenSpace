import { MeditationSession } from "@/types";

export const MEDITATION_SESSIONS: MeditationSession[] = [
  {
    id: "1",
    title: "Morning Calm",
    category: "morning",
    duration: 10,
    description:
      "Start your day with clarity and intention. This guided session gently awakens your awareness and sets a peaceful tone for the hours ahead. Perfect for beginners and experienced practitioners alike.",
    isFavorite: false,
    tags: ["morning", "beginners", "calm"],
    instructor: "Aria Chen",
  },
  {
    id: "2",
    title: "Deep Sleep Journey",
    category: "sleep",
    duration: 20,
    description:
      "Drift into a restful slumber with this deeply relaxing body-scan meditation. Let go of the day's tension and surrender to restorative sleep.",
    isFavorite: false,
    tags: ["sleep", "relaxation", "body scan"],
    instructor: "Marcus Webb",
  },
  {
    id: "3",
    title: "Anxiety Relief",
    category: "anxiety",
    duration: 15,
    description:
      "Calm anxious thoughts with grounding breathwork and soothing visualizations. This session brings you back to the present moment.",
    isFavorite: false,
    tags: ["anxiety", "breathing", "grounding"],
    instructor: "Aria Chen",
  },
  {
    id: "4",
    title: "Focus Flow",
    category: "focus",
    duration: 12,
    description:
      "Sharpen your concentration and enter a state of deep focus. Ideal before important work sessions or creative projects.",
    isFavorite: false,
    tags: ["focus", "productivity", "concentration"],
    instructor: "Kenji Mori",
  },
  {
    id: "5",
    title: "4-7-8 Breathing",
    category: "breathing",
    duration: 8,
    description:
      "The 4-7-8 technique activates your parasympathetic nervous system, reducing stress rapidly. Inhale for 4 counts, hold for 7, exhale for 8.",
    isFavorite: false,
    tags: ["breathing", "stress", "quick"],
    instructor: "Priya Nair",
  },
  {
    id: "6",
    title: "Stress Melt",
    category: "stress",
    duration: 18,
    description:
      "Release accumulated stress with progressive muscle relaxation paired with mindful awareness. Feel tension dissolve layer by layer.",
    isFavorite: false,
    tags: ["stress", "relaxation", "body"],
    instructor: "Marcus Webb",
  },
  {
    id: "7",
    title: "Mindful Moments",
    category: "mindfulness",
    duration: 10,
    description:
      "A foundational mindfulness practice that builds present-moment awareness. Observe thoughts without judgment and reconnect with now.",
    isFavorite: false,
    tags: ["mindfulness", "awareness", "beginner"],
    instructor: "Priya Nair",
  },
  {
    id: "8",
    title: "Power Nap Reset",
    category: "sleep",
    duration: 20,
    description:
      "A scientifically-designed 20-minute nap session that maximizes restoration without entering deep sleep. Wake up refreshed and alert.",
    isFavorite: false,
    tags: ["sleep", "nap", "energy"],
    instructor: "Kenji Mori",
  },
];

export const CATEGORIES = [
  { id: "all", label: "All", emoji: "✨" },
  { id: "morning", label: "Morning", emoji: "🌅" },
  { id: "sleep", label: "Sleep", emoji: "🌙" },
  { id: "anxiety", label: "Anxiety", emoji: "🌿" },
  { id: "focus", label: "Focus", emoji: "🎯" },
  { id: "breathing", label: "Breathing", emoji: "💨" },
  { id: "stress", label: "Stress", emoji: "☁️" },
  { id: "mindfulness", label: "Mindful", emoji: "🧘" },
];
