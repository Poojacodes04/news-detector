import type { BadgeId } from "@/edu/types";

export const BADGES: Record<
  BadgeId,
  { title: string; description: string; emoji: string }
> = {
  "rookie-detective": {
    title: "Rookie Detective",
    description: "Complete your first activity.",
    emoji: "🕵️",
  },
  "pattern-spotter": {
    title: "Pattern Spotter",
    description: "Complete the quiz + feature importance activity.",
    emoji: "🔎",
  },
  "metrics-mechanic": {
    title: "Metrics Mechanic",
    description: "Complete metrics + confusion matrix activities.",
    emoji: "📊",
  },
  "fairness-friend": {
    title: "Fairness Friend",
    description: "Complete the bias activity.",
    emoji: "⚖️",
  },
  "model-trainer": {
    title: "Model Trainer",
    description: "Complete the training simulator.",
    emoji: "🧪",
  },
  "case-closer": {
    title: "Case Closer",
    description: "Complete 6+ activities.",
    emoji: "🏁",
  },
};


