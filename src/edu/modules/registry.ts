import type { ModuleMeta } from "@/edu/types";

export const MODULES: ModuleMeta[] = [
  {
    id: "headline-quiz",
    title: "Fake vs Real Headline Quiz",
    shortDescription: "Decide if headlines look reliable or suspicious. Get instant feedback and learn the clues.",
    difficulty: "beginner",
    estimatedMinutes: 6,
    maxPoints: 10,
    teacherNotes:
      "Goal: practice identifying surface-level cues (tone, claims, sourcing language). Remind students: cues are hints, not proof.",
  },
  {
    id: "data-labeling",
    title: "Data Labeling Simulator",
    shortDescription: "Label a mini dataset and see how labeling rules change what the model learns.",
    difficulty: "beginner",
    estimatedMinutes: 8,
    maxPoints: 12,
    teacherNotes:
      "Goal: show that training data is made by people and labeling can be noisy or ambiguous. Discuss guidelines + consistency.",
  },
  {
    id: "bias-detection",
    title: "Bias Detection Activity",
    shortDescription: "Adjust what the dataset contains and watch which groups the model struggles with.",
    difficulty: "beginner",
    estimatedMinutes: 7,
    maxPoints: 10,
    teacherNotes:
      "Goal: teach representation bias. Students can optimize accuracy but should also minimize the performance gap across groups.",
  },
  {
    id: "confusion-matrix",
    title: "Confusion Matrix Explorer",
    shortDescription: "Move the threshold and see true/false positives/negatives update in real time.",
    difficulty: "intermediate",
    estimatedMinutes: 9,
    maxPoints: 12,
    teacherNotes:
      "Goal: interpret confusion matrices. Ask: which mistakes are worse for your use case? Why does threshold matter?",
  },
  {
    id: "metrics-playground",
    title: "Accuracy / Precision / Recall Playground",
    shortDescription: "Explore metric tradeoffs and learn why one number is never the whole story.",
    difficulty: "intermediate",
    estimatedMinutes: 9,
    maxPoints: 12,
    teacherNotes:
      "Goal: connect metrics to confusion matrix. Use student-friendly examples: alarms, spam filters, medical tests (non-graphic).",
  },
  {
    id: "overfitting-demo",
    title: "Overfitting Demonstration",
    shortDescription: "Tune complexity and data size to see why “too fancy” can fail on new examples.",
    difficulty: "beginner",
    estimatedMinutes: 7,
    maxPoints: 10,
    teacherNotes:
      "Goal: show training vs test performance. Emphasize: more parameters + tiny data can memorize instead of generalize.",
  },
  {
    id: "feature-importance",
    title: "Feature Importance Visualizer",
    shortDescription: "See which words push a model toward “fake” or “real” and why linear models can be interpretable.",
    difficulty: "beginner",
    estimatedMinutes: 8,
    maxPoints: 10,
    teacherNotes:
      "Goal: show bag-of-words / TF‑IDF idea. Caution: importance depends on data; don’t treat it as universal truth.",
  },
  {
    id: "training-simulator",
    title: "Model Training Step‑by‑Step Simulator",
    shortDescription: "Walk through the full pipeline: collect, label, vectorize, train, evaluate, deploy.",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    maxPoints: 16,
    teacherNotes:
      "Goal: tie everything together. Encourage reflection: what could go wrong at each step and how would we test it?",
  },
];

export function getModuleMeta(id: string | undefined) {
  return MODULES.find((m) => m.id === id);
}


