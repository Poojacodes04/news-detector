import type { BadgeId, EduStoreV1, ModuleAttempt, ModuleId, ModuleMeta, ModuleProgress, StudentProfile, StudentRecord } from "@/edu/types";

const STORAGE_KEY = "ai-detective-academy:edu-store:v1";

function nowIso() {
  return new Date().toISOString();
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function safeParse(json: string | null): unknown | null {
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function makeEmptyModuleProgress(moduleId: ModuleId): ModuleProgress {
  return {
    moduleId,
    bestPoints: 0,
    lastPoints: 0,
    attempts: 0,
    completed: false,
  };
}

export function computeBadges(modules: Record<ModuleId, ModuleProgress>): BadgeId[] {
  const completedIds = Object.values(modules).filter((m) => m.completed).map((m) => m.moduleId);
  const completedCount = completedIds.length;

  const has = (id: ModuleId) => completedIds.includes(id);
  const badges: BadgeId[] = [];

  if (completedCount >= 1) badges.push("rookie-detective");
  if (has("headline-quiz") && has("feature-importance")) badges.push("pattern-spotter");
  if (has("metrics-playground") && has("confusion-matrix")) badges.push("metrics-mechanic");
  if (has("bias-detection")) badges.push("fairness-friend");
  if (has("training-simulator")) badges.push("model-trainer");
  if (completedCount >= 6) badges.push("case-closer");

  return badges;
}

export function createStudent(displayName: string, moduleMetas: ModuleMeta[]): StudentRecord {
  const createdAt = nowIso();
  const profile: StudentProfile = {
    id: crypto.randomUUID(),
    displayName: displayName.trim() || "Student",
    createdAt,
    lastActiveAt: createdAt,
  };

  const moduleProgress = moduleMetas.reduce((acc, meta) => {
    acc[meta.id] = makeEmptyModuleProgress(meta.id);
    return acc;
  }, {} as Record<ModuleId, ModuleProgress>);

  return {
    profile,
    moduleProgress,
    totalPoints: 0,
    badges: computeBadges(moduleProgress),
    attempts: [],
  };
}

export function makeDefaultStore(moduleMetas: ModuleMeta[]): EduStoreV1 {
  const student = createStudent("Student", moduleMetas);
  return {
    version: 1,
    activeStudentId: student.profile.id,
    students: {
      [student.profile.id]: student,
    },
  };
}

export function loadEduStore(moduleMetas: ModuleMeta[]): EduStoreV1 {
  const raw = safeParse(localStorage.getItem(STORAGE_KEY));
  if (!raw || typeof raw !== "object") {
    const fresh = makeDefaultStore(moduleMetas);
    saveEduStore(fresh);
    return fresh;
  }

  const maybe = raw as Partial<EduStoreV1>;
  if (maybe.version !== 1 || !maybe.students || !maybe.activeStudentId) {
    const fresh = makeDefaultStore(moduleMetas);
    saveEduStore(fresh);
    return fresh;
  }

  // Ensure any new modules are added for older stores (forward-compat for modules list).
  for (const student of Object.values(maybe.students)) {
    if (!student?.moduleProgress) continue;
    for (const meta of moduleMetas) {
      if (!student.moduleProgress[meta.id]) {
        student.moduleProgress[meta.id] = makeEmptyModuleProgress(meta.id);
      }
    }
    student.badges = computeBadges(student.moduleProgress as Record<ModuleId, ModuleProgress>);
  }

  const store = maybe as EduStoreV1;
  saveEduStore(store);
  return store;
}

export function saveEduStore(store: EduStoreV1) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function resetEduStore(moduleMetas: ModuleMeta[]): EduStoreV1 {
  const fresh = makeDefaultStore(moduleMetas);
  saveEduStore(fresh);
  return fresh;
}

export function setActiveStudent(store: EduStoreV1, studentId: string): EduStoreV1 {
  if (!store.students[studentId]) return store;
  const next: EduStoreV1 = {
    ...store,
    activeStudentId: studentId,
  };
  next.students[studentId].profile.lastActiveAt = nowIso();
  saveEduStore(next);
  return next;
}

export function upsertStudent(store: EduStoreV1, record: StudentRecord): EduStoreV1 {
  const next: EduStoreV1 = {
    ...store,
    students: {
      ...store.students,
      [record.profile.id]: record,
    },
  };
  saveEduStore(next);
  return next;
}

export function recordAttempt(
  store: EduStoreV1,
  moduleId: ModuleId,
  scoredPointsRaw: number,
  maxPointsRaw: number,
  completed: boolean,
): EduStoreV1 {
  const student = store.students[store.activeStudentId];
  if (!student) return store;

  const maxPoints = Math.max(1, Math.round(maxPointsRaw));
  const scoredPoints = clamp(Math.round(scoredPointsRaw), 0, maxPoints);

  const prevModule = student.moduleProgress[moduleId];
  const nextModule: ModuleProgress = {
    ...prevModule,
    attempts: prevModule.attempts + 1,
    lastPoints: scoredPoints,
    bestPoints: Math.max(prevModule.bestPoints, scoredPoints),
    completed: prevModule.completed || completed,
    lastCompletedAt: completed ? nowIso() : prevModule.lastCompletedAt,
  };

  const attempt: ModuleAttempt = {
    moduleId,
    scoredPoints,
    maxPoints,
    completed,
    createdAt: nowIso(),
  };

  const nextStudent: StudentRecord = {
    ...student,
    moduleProgress: {
      ...student.moduleProgress,
      [moduleId]: nextModule,
    },
    attempts: [attempt, ...student.attempts].slice(0, 200),
  };

  const totalPoints = Object.values(nextStudent.moduleProgress).reduce((sum, mp) => sum + mp.bestPoints, 0);
  nextStudent.totalPoints = totalPoints;
  nextStudent.badges = computeBadges(nextStudent.moduleProgress);
  nextStudent.profile.lastActiveAt = nowIso();

  const next: EduStoreV1 = {
    ...store,
    students: {
      ...store.students,
      [nextStudent.profile.id]: nextStudent,
    },
  };

  saveEduStore(next);
  return next;
}


