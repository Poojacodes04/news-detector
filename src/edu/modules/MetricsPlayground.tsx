import { useMemo, useState } from "react";
import ModuleShell from "@/edu/components/ModuleShell";
import { getModuleMeta } from "@/edu/modules/registry";
import type { ModuleId } from "@/edu/types";
import { useEdu } from "@/edu/EduContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { makeToyScoredExamples, confusionFromThreshold, metricsFromCounts } from "@/edu/modules/toyData";
import { cn } from "@/lib/utils";
import { BookCheck, Gauge } from "lucide-react";

const MODULE_ID: ModuleId = "metrics-playground";

type ScenarioId = "avoid-false-alarms" | "catch-most-fakes" | "balanced";

const SCENARIOS: Record<
  ScenarioId,
  {
    title: string;
    description: string;
    goals: { precisionMin?: number; recallMin?: number; accuracyMin?: number };
    hint: string;
  }
> = {
  "avoid-false-alarms": {
    title: "Avoid false alarms",
    description: "You really don’t want to label real headlines as fake (false positives).",
    goals: { precisionMin: 0.8 },
    hint: "Precision rewards being careful before calling something “Fake”.",
  },
  "catch-most-fakes": {
    title: "Catch most fakes",
    description: "You really don’t want fake headlines to slip through (false negatives).",
    goals: { recallMin: 0.8 },
    hint: "Recall rewards catching more of the true fakes.",
  },
  balanced: {
    title: "Balanced",
    description: "You want a reasonable tradeoff between mistakes.",
    goals: { accuracyMin: 0.8, precisionMin: 0.7, recallMin: 0.7 },
    hint: "Balance usually means a middle-ish threshold, but it depends on the data.",
  },
};

export default function MetricsPlayground() {
  const meta = getModuleMeta(MODULE_ID)!;
  const { recordModuleAttempt } = useEdu();

  const examples = useMemo(() => makeToyScoredExamples(), []);
  const [scenario, setScenario] = useState<ScenarioId>("balanced");
  const [threshold, setThreshold] = useState(0.5);

  const counts = useMemo(() => confusionFromThreshold(examples, threshold), [examples, threshold]);
  const m = useMemo(() => metricsFromCounts(counts), [counts]);

  const goals = SCENARIOS[scenario].goals;
  const met = useMemo(() => {
    const precisionOk = goals.precisionMin ? m.precision >= goals.precisionMin : true;
    const recallOk = goals.recallMin ? m.recall >= goals.recallMin : true;
    const accuracyOk = goals.accuracyMin ? m.accuracy >= goals.accuracyMin : true;
    return { precisionOk, recallOk, accuracyOk, passed: precisionOk && recallOk && accuracyOk };
  }, [goals, m]);

  // Two quick understanding checks.
  const [q1, setQ1] = useState<null | "precision" | "recall">(null);
  const [q2, setQ2] = useState<null | "fp" | "fn">(null);
  const q1Correct = q1 === "precision"; // “avoiding false alarms” -> precision
  const q2Correct = q2 === "fn"; // “fake slips through” -> false negative

  const pointsFromGoals = useMemo(() => {
    // Partial credit based on scenario goals.
    const p = Math.min(1, m.precision / (goals.precisionMin ?? 1));
    const r = Math.min(1, m.recall / (goals.recallMin ?? 1));
    const a = Math.min(1, m.accuracy / (goals.accuracyMin ?? 1));

    const components = [
      goals.precisionMin ? p : 1,
      goals.recallMin ? r : 1,
      goals.accuracyMin ? a : 1,
    ];
    const avg = components.reduce((s, x) => s + x, 0) / components.length;
    return Math.round(avg * 8); // 8 points reserved for thresholding goal
  }, [goals, m]);

  const pointsFromQuestions = (q1Correct ? 2 : 0) + (q2Correct ? 2 : 0); // 4 points
  const score = clamp(pointsFromGoals + pointsFromQuestions, 0, meta.maxPoints);
  const finished = q1 !== null && q2 !== null;

  const save = () => {
    recordModuleAttempt({
      moduleId: MODULE_ID,
      scoredPoints: score,
      maxPoints: meta.maxPoints,
      completed: met.passed && finished,
    });
  };

  return (
    <ModuleShell
      meta={meta}
      instructions={
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Metrics help you describe <span className="text-accent font-bold">what kinds of mistakes</span> a model is making.
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Pick a scenario.</li>
            <li>Move the threshold to meet the scenario goal.</li>
            <li>Answer two quick questions, then save your score.</li>
          </ul>
        </div>
      }
    >
      <div className="card-case-file p-6 text-left">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-secondary text-secondary-foreground">
              <Gauge size={14} className="mr-1" /> Threshold: {threshold.toFixed(2)}
            </Badge>
            <Badge variant="outline" className="border-border/60">
              Accuracy: {(m.accuracy * 100).toFixed(1)}%
            </Badge>
            <Badge variant="outline" className="border-border/60">
              Precision: {(m.precision * 100).toFixed(1)}%
            </Badge>
            <Badge variant="outline" className="border-border/60">
              Recall: {(m.recall * 100).toFixed(1)}%
            </Badge>
          </div>
          <Badge className="bg-secondary text-secondary-foreground">Score: {score}/{meta.maxPoints}</Badge>
        </div>

        <div className="mt-5">
          <p className="text-sm font-bold">Scenario</p>
          <p className="text-xs text-muted-foreground mb-3">{SCENARIOS[scenario].description}</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => (
              <Button
                key={id}
                variant={scenario === id ? "secondary" : "outline"}
                className="rounded-full"
                onClick={() => setScenario(id)}
              >
                {SCENARIOS[id].title}
              </Button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{SCENARIOS[scenario].hint}</p>
        </div>

        <div className="mt-5">
          <p className="text-sm font-bold">Threshold slider</p>
          <Slider value={[Math.round(threshold * 100)]} min={1} max={99} step={1} onValueChange={(v) => setThreshold(v[0] / 100)} />
        </div>

        <div className={cn("mt-6 rounded-xl p-4 border-2", met.passed ? "bg-success/10 border-success/50" : "bg-accent/10 border-accent/50")}>
          <p className="font-black">Goal check</p>
          <div className="mt-2 text-sm text-muted-foreground space-y-1">
            {goals.accuracyMin && (
              <div>
                Accuracy ≥ {(goals.accuracyMin * 100).toFixed(0)}%:{" "}
                <span className={met.accuracyOk ? "text-success font-bold" : "text-destructive font-bold"}>
                  {(m.accuracy * 100).toFixed(1)}%
                </span>
              </div>
            )}
            {goals.precisionMin && (
              <div>
                Precision ≥ {(goals.precisionMin * 100).toFixed(0)}%:{" "}
                <span className={met.precisionOk ? "text-success font-bold" : "text-destructive font-bold"}>
                  {(m.precision * 100).toFixed(1)}%
                </span>
              </div>
            )}
            {goals.recallMin && (
              <div>
                Recall ≥ {(goals.recallMin * 100).toFixed(0)}%:{" "}
                <span className={met.recallOk ? "text-success font-bold" : "text-destructive font-bold"}>
                  {(m.recall * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          <Progress value={Math.round((pointsFromGoals / 8) * 100)} className="mt-3 h-3" />
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <div>
            <p className="text-sm font-bold">Quick check #1</p>
            <p className="text-xs text-muted-foreground mb-2">
              If you want to avoid “false alarms” (calling Real headlines Fake), which metric matters most?
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant={q1 === "precision" ? "secondary" : "outline"} className="rounded-full" onClick={() => setQ1("precision")}>
                Precision
              </Button>
              <Button variant={q1 === "recall" ? "secondary" : "outline"} className="rounded-full" onClick={() => setQ1("recall")}>
                Recall
              </Button>
            </div>
            {q1 && (
              <p className="mt-2 text-xs text-muted-foreground">
                {q1Correct
                  ? "Correct: higher precision means fewer false positives."
                  : "Not quite: recall is about catching true fakes; precision is about avoiding false positives."}
              </p>
            )}
          </div>

          <div>
            <p className="text-sm font-bold">Quick check #2</p>
            <p className="text-xs text-muted-foreground mb-2">
              If a fake headline is predicted as real, that mistake is called…
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant={q2 === "fp" ? "secondary" : "outline"} className="rounded-full" onClick={() => setQ2("fp")}>
                False Positive
              </Button>
              <Button variant={q2 === "fn" ? "secondary" : "outline"} className="rounded-full" onClick={() => setQ2("fn")}>
                False Negative
              </Button>
            </div>
            {q2 && (
              <p className="mt-2 text-xs text-muted-foreground">
                {q2Correct
                  ? "Correct: the model missed a fake (a negative prediction when the truth is positive)."
                  : "Close: false positive is predicting Fake when the truth is Real. Here, it predicted Real for a Fake example."}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">Save when you’ve met the scenario goal and answered both questions.</p>
          <Button
            className="rounded-full btn-detective bg-gradient-to-r from-primary to-secondary"
            onClick={save}
            disabled={!finished}
          >
            <BookCheck className="mr-2" size={18} />
            Save score
          </Button>
        </div>
      </div>
    </ModuleShell>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}


