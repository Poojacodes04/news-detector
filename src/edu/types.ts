export type ModuleId =
  | "headline-quiz"
  | "data-labeling"
  | "bias-detection"
  | "confusion-matrix"
  | "metrics-playground"
  | "overfitting-demo"
  | "feature-importance"
  | "training-simulator";

export type ModuleDifficulty = "beginner" | "intermediate";

export type BadgeId =
  | "rookie-detective"
  | "pattern-spotter"
  | "metrics-mechanic"
  | "fairness-friend"
  | "model-trainer"
  | "case-closer";

export type EduPageId =
  | "learn"
  | "how-ai-works"
  | "dataset"
  | "limitations"
  | "about"
  | "faq"
  | "teacher";

export interface ModuleMeta {
  id: ModuleId;
  title: string;
  shortDescription: string;
  difficulty: ModuleDifficulty;
  estimatedMinutes: number;
  maxPoints: number;
  teacherNotes: string;
}

export interface ModuleAttempt {
  moduleId: ModuleId;
  scoredPoints: number;
  maxPoints: number;
  completed: boolean;
  createdAt: string; // ISO
}

export interface ModuleProgress {
  moduleId: ModuleId;
  bestPoints: number;
  lastPoints: number;
  attempts: number;
  completed: boolean;
  lastCompletedAt?: string; // ISO
}

export interface StudentProfile {
  id: string;
  displayName: string;
  createdAt: string; // ISO
  lastActiveAt: string; // ISO
}

export interface StudentRecord {
  profile: StudentProfile;
  moduleProgress: Record<ModuleId, ModuleProgress>;
  totalPoints: number;
  badges: BadgeId[];
  attempts: ModuleAttempt[];
}

export interface EduStoreV1 {
  version: 1;
  activeStudentId: string;
  students: Record<string, StudentRecord>;
}


