import React, { createContext, useContext, useMemo, useState } from "react";
import type { EduStoreV1, ModuleId, StudentRecord } from "@/edu/types";
import { createStudent, loadEduStore, recordAttempt, resetEduStore, setActiveStudent, upsertStudent } from "@/edu/storage";
import { MODULES } from "@/edu/modules/registry";

type EduContextValue = {
  store: EduStoreV1;
  activeStudent: StudentRecord;
  setActiveStudentId: (id: string) => void;
  addStudent: (displayName: string) => void;
  renameActiveStudent: (displayName: string) => void;
  resetProgress: () => void;
  recordModuleAttempt: (args: { moduleId: ModuleId; scoredPoints: number; maxPoints: number; completed: boolean }) => void;
};

const EduContext = createContext<EduContextValue | null>(null);

export function EduProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<EduStoreV1>(() => loadEduStore(MODULES));

  const activeStudent = store.students[store.activeStudentId];
  // Store always guarantees at least 1 student, but guard just in case.
  const safeActive = activeStudent || Object.values(store.students)[0];

  const value: EduContextValue = useMemo(() => {
    return {
      store,
      activeStudent: safeActive,
      setActiveStudentId: (id) => setStore((prev) => setActiveStudent(prev, id)),
      addStudent: (displayName) => {
        const newStudent = createStudent(displayName, MODULES);
        setStore((prev) => {
          let next = upsertStudent(prev, newStudent);
          next = setActiveStudent(next, newStudent.profile.id);
          return next;
        });
      },
      renameActiveStudent: (displayName) => {
        const nextStudent: StudentRecord = {
          ...safeActive,
          profile: {
            ...safeActive.profile,
            displayName: displayName.trim() || safeActive.profile.displayName,
            lastActiveAt: new Date().toISOString(),
          },
        };
        setStore((prev) => upsertStudent(prev, nextStudent));
      },
      resetProgress: () => setStore(resetEduStore(MODULES)),
      recordModuleAttempt: ({ moduleId, scoredPoints, maxPoints, completed }) =>
        setStore((prev) => recordAttempt(prev, moduleId, scoredPoints, maxPoints, completed)),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store, safeActive]);

  return <EduContext.Provider value={value}>{children}</EduContext.Provider>;
}

export function useEdu() {
  const ctx = useContext(EduContext);
  if (!ctx) throw new Error("useEdu must be used within EduProvider");
  return ctx;
}


