import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MODULES } from "@/edu/modules/registry";
import { ModuleCard } from "@/edu/components/ModuleCard";
import { useEdu } from "@/edu/EduContext";
import { BADGES } from "@/edu/badges";
import { useMemo, useState } from "react";
import { Trophy, RotateCcw, UserPlus, Users } from "lucide-react";

export default function Learn() {
  const { store, activeStudent, setActiveStudentId, addStudent, renameActiveStudent, resetProgress } = useEdu();
  const [newName, setNewName] = useState(activeStudent.profile.displayName);
  const [newStudentName, setNewStudentName] = useState("");

  const completedCount = useMemo(() => {
    return Object.values(activeStudent.moduleProgress).filter((m) => m.completed).length;
  }, [activeStudent.moduleProgress]);

  const totalModules = MODULES.length;
  const percentComplete = Math.round((completedCount / totalModules) * 100);
  const leaderboard = useMemo(() => {
    return Object.values(store.students)
      .map((s) => ({
        id: s.profile.id,
        name: s.profile.displayName,
        points: s.totalPoints,
        completed: Object.values(s.moduleProgress).filter((m) => m.completed).length,
      }))
      .sort((a, b) => b.points - a.points)
      .slice(0, 5);
  }, [store.students]);

  return (
    <SiteLayout title="Interactive Learning" subtitle="Your mission: learn how AI is trained, tested, and improved.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student panel */}
        <div className="card-case-file p-6 text-left lg:col-span-1 h-fit">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black flex items-center gap-2">
              <Users className="text-accent" size={20} />
              Student Profile
            </h2>
            <Badge className="bg-secondary text-secondary-foreground">
              <Trophy size={14} className="mr-1" /> {activeStudent.totalPoints} pts
            </Badge>
          </div>

          <div className="mt-4">
            <Label htmlFor="studentSelect" className="text-xs text-muted-foreground">
              Active student
            </Label>
            <select
              id="studentSelect"
              className="mt-1 w-full rounded-md bg-muted px-3 py-2 text-sm border border-border"
              value={store.activeStudentId}
              onChange={(e) => setActiveStudentId(e.target.value)}
            >
              {Object.values(store.students)
                .sort((a, b) => a.profile.createdAt.localeCompare(b.profile.createdAt))
                .map((s) => (
                  <option key={s.profile.id} value={s.profile.id}>
                    {s.profile.displayName}
                  </option>
                ))}
            </select>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="rename" className="text-xs text-muted-foreground">
              Display name
            </Label>
            <div className="flex gap-2">
              <Input
                id="rename"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-muted border-border"
              />
              <Button
                variant="secondary"
                className="rounded-full"
                onClick={() => renameActiveStudent(newName)}
              >
                Save
              </Button>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="space-y-2">
            <Label htmlFor="newStudent" className="text-xs text-muted-foreground">
              Add another student (same device)
            </Label>
            <div className="flex gap-2">
              <Input
                id="newStudent"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="e.g., Alex"
                className="bg-muted border-border"
              />
              <Button
                className="rounded-full bg-gradient-to-r from-accent via-orange to-accent text-accent-foreground btn-detective"
                onClick={() => {
                  addStudent(newStudentName || "Student");
                  setNewStudentName("");
                }}
              >
                <UserPlus size={16} />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This is perfect for classrooms on a shared computer. Teacher Mode can export everyone’s results.
            </p>
          </div>

          <Separator className="my-5" />

          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">Progress</p>
              <p className="text-xs text-muted-foreground">
                {completedCount}/{totalModules} completed
              </p>
            </div>
            <div className="mt-2">
              <Progress value={percentComplete} className="h-3" />
              <p className="mt-2 text-xs text-muted-foreground">{percentComplete}%</p>
            </div>
          </div>

          <Separator className="my-5" />

          <div>
            <p className="text-sm font-bold mb-2">Badges</p>
            {activeStudent.badges.length === 0 ? (
              <p className="text-xs text-muted-foreground">Complete an activity to earn your first badge.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {activeStudent.badges.map((b) => (
                  <Badge key={b} className="bg-success text-success-foreground">
                    {BADGES[b].emoji} {BADGES[b].title}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator className="my-5" />

          <div>
            <p className="text-sm font-bold mb-2">Leaderboard (this device)</p>
            <div className="space-y-2">
              {leaderboard.map((row, i) => (
                <div key={row.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">
                      {i + 1}. {row.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {row.completed}/{MODULES.length} modules
                    </p>
                  </div>
                  <Badge className="bg-secondary text-secondary-foreground">{row.points} pts</Badge>
                </div>
              ))}
              {leaderboard.length === 0 && <p className="text-xs text-muted-foreground">No scores yet.</p>}
            </div>
          </div>

          <Separator className="my-5" />

          <Button
            variant="destructive"
            className="w-full rounded-full"
            onClick={() => {
              // Reset is intentionally global (clears classroom too). Teacher can re-add students quickly.
              resetProgress();
            }}
          >
            <RotateCcw className="mr-2" size={18} />
            Reset progress (this device)
          </Button>
        </div>

        {/* Modules list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card-case-file p-6 text-left">
            <h2 className="text-2xl font-black">Choose a module</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Each module includes instructions, interactive challenges, and explanations. Your best score is saved on this device.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {MODULES.map((meta) => (
              <ModuleCard key={meta.id} meta={meta} progress={activeStudent.moduleProgress[meta.id]} />
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}


