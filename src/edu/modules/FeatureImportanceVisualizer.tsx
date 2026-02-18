import { useEffect, useMemo, useState } from "react";
import ModuleShell from "@/edu/components/ModuleShell";
import { getModuleMeta } from "@/edu/modules/registry";
import type { ModuleId } from "@/edu/types";
import { useEdu } from "@/edu/EduContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { BrainCircuit, FileCheck2, Wand2 } from "lucide-react";

const MODULE_ID: ModuleId = "feature-importance";

type Weight = { word: string; weight: number; meaning: "pushes-fake" | "pushes-real" | "neutral" };

// Positive weights push toward "Fake". Negative weights push toward "Real".
const WEIGHTS: Weight[] = [
  { word: "shocking", weight: 1.2, meaning: "pushes-fake" },
  { word: "breaking", weight: 1.0, meaning: "pushes-fake" },
  { word: "secret", weight: 1.0, meaning: "pushes-fake" },
  { word: "unbelievable", weight: 0.9, meaning: "pushes-fake" },
  { word: "guaranteed", weight: 1.1, meaning: "pushes-fake" },
  { word: "cures", weight: 1.2, meaning: "pushes-fake" },
  { word: "overnight", weight: 0.8, meaning: "pushes-fake" },
  { word: "study", weight: -0.8, meaning: "pushes-real" },
  { word: "research", weight: -0.7, meaning: "pushes-real" },
  { word: "according", weight: -0.6, meaning: "pushes-real" },
  { word: "reports", weight: -0.6, meaning: "pushes-real" },
  { word: "official", weight: -0.7, meaning: "pushes-real" },
  { word: "community", weight: -0.3, meaning: "pushes-real" },
  { word: "announces", weight: -0.4, meaning: "pushes-real" },
];

const WEIGHT_MAP = new Map(WEIGHTS.map((w) => [w.word, w.weight]));

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replaceAll(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

export default function FeatureImportanceVisualizer() {
  const meta = getModuleMeta(MODULE_ID)!;
  const { recordModuleAttempt } = useEdu();

  const [text, setText] = useState("Scientists report early study results on student sleep habits");
  const [backendResult, setBackendResult] = useState<null | { label: string; confidence: number }>(null);
  const [backendError, setBackendError] = useState<string | null>(null);

  const tokens = useMemo(() => tokenize(text), [text]);
  const contributions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of tokens) counts.set(t, (counts.get(t) ?? 0) + 1);
    return Array.from(counts.entries())
      .map(([word, count]) => {
        const w = WEIGHT_MAP.get(word) ?? 0;
        return { word, count, weight: w, contribution: w * count };
      })
      .filter((x) => x.weight !== 0)
      .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  }, [tokens]);

  const logit = useMemo(() => contributions.reduce((sum, c) => sum + c.contribution, 0), [contributions]);
  const probFake = sigmoid(logit);
  const toyLabel = probFake >= 0.5 ? "Fake" : "Real";

  const goals = useMemo(() => {
    const g1 = probFake >= 0.75;
    const g2 = probFake <= 0.25;
    const g3 = contributions.length >= 2;
    return { g1, g2, g3 };
  }, [contributions.length, probFake]);

  const score = useMemo(() => {
    const points = (goals.g1 ? 1 : 0) + (goals.g2 ? 1 : 0) + (goals.g3 ? 1 : 0);
    // 3 mini-goals -> max points
    return Math.round((points / 3) * meta.maxPoints);
  }, [goals, meta.maxPoints]);

  const completed = goals.g1 && goals.g2 && goals.g3;

  const save = () => {
    recordModuleAttempt({
      moduleId: MODULE_ID,
      scoredPoints: score,
      maxPoints: meta.maxPoints,
      completed,
    });
  };

  const tryBackend = async () => {
    setBackendError(null);
    setBackendResult(null);
    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline: text }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setBackendResult({ label: data.label, confidence: data.confidence });
    } catch {
      setBackendError("Couldn’t reach the Flask model at http://127.0.0.1:5000. (That’s okay — the toy visualizer still works.)");
    }
  };

  useEffect(() => {
    setBackendResult(null);
    setBackendError(null);
  }, [text]);

  return (
    <ModuleShell
      meta={meta}
      instructions={
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            This activity shows a simple idea: some words push a model toward “Fake” and some push toward “Real”.
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Type a headline.</li>
            <li>See which words contribute to the toy model’s decision.</li>
            <li>Complete the 3 mini-goals and save your score.</li>
          </ul>
        </div>
      }
    >
      <div className="card-case-file p-6 text-left">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-secondary text-secondary-foreground">
              <BrainCircuit size={14} className="mr-1" /> Toy model: {toyLabel} ({Math.round(probFake * 100)}% fake)
            </Badge>
            <Badge variant="outline" className="border-border/60">
              Score: {score}/{meta.maxPoints}
            </Badge>
          </div>
          <Button variant="outline" className="rounded-full" onClick={tryBackend}>
            Compare with real model (optional)
          </Button>
        </div>

        <div className="mt-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px] text-lg !bg-muted/30 border border-border"
            placeholder="Type a headline..."
          />
        </div>

        <div className="mt-4 bg-muted/10 rounded-xl p-4 border border-border">
          <p className="text-sm font-bold">Probability meter</p>
          <p className="text-xs text-muted-foreground">
            This is a toy “fake-likeness” score from word weights (not a real fact-checker).
          </p>
          <Progress
            value={Math.round(probFake * 100)}
            className={cn("mt-3 h-4", toyLabel === "Fake" ? "[&>div]:bg-destructive" : "[&>div]:bg-success")}
          />
        </div>

        {(backendResult || backendError) && (
          <div className={cn("mt-4 rounded-xl p-4 border-2", backendResult ? "bg-success/10 border-success/50" : "bg-destructive/10 border-destructive/50")}>
            <p className="font-black">Real Flask model (optional)</p>
            {backendResult ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Prediction: <span className="font-bold">{backendResult.label}</span> · confidence:{" "}
                <span className="font-bold">{Math.round(backendResult.confidence * 100)}%</span>
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">{backendError}</p>
            )}
          </div>
        )}

        <Separator className="my-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-muted/10 rounded-xl p-4 border border-border">
            <p className="text-sm font-bold">Word contributions</p>
            <p className="text-xs text-muted-foreground mt-1">
              Positive pushes toward Fake. Negative pushes toward Real.
            </p>

            <div className="mt-4 space-y-2">
              {contributions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No weighted words found yet. Try words like “shocking” or “study”.</p>
              ) : (
                contributions.map((c) => (
                  <div key={c.word} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3">
                    <div className="min-w-0">
                      <p className="font-bold">
                        {c.word}{" "}
                        <span className="text-xs text-muted-foreground">
                          ×{c.count}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        weight {c.weight > 0 ? "+" : ""}
                        {c.weight.toFixed(2)} → contribution {c.contribution > 0 ? "+" : ""}
                        {c.contribution.toFixed(2)}
                      </p>
                    </div>
                    <Badge className={c.contribution >= 0 ? "bg-destructive text-destructive-foreground" : "bg-success text-success-foreground"}>
                      {c.contribution >= 0 ? "pushes Fake" : "pushes Real"}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className={cn("rounded-xl p-4 border-2", completed ? "bg-success/10 border-success/50" : "bg-accent/10 border-accent/50")}>
              <p className="font-black">Mini-goals (3)</p>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                <li>
                  {goals.g1 ? "✅" : "⬜"} Make the toy model think it’s <span className="font-bold">Fake</span> (≥ 75% fake)
                </li>
                <li>
                  {goals.g2 ? "✅" : "⬜"} Make the toy model think it’s <span className="font-bold">Real</span> (≤ 25% fake)
                </li>
                <li>
                  {goals.g3 ? "✅" : "⬜"} Use at least <span className="font-bold">two</span> weighted words
                </li>
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Tip: try adding “shocking” (pushes fake) or “study” (pushes real).
              </p>
            </div>

            <div className="bg-muted/10 rounded-xl p-4 border border-border">
              <p className="text-sm font-bold">Why this matters</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Some models can be interpreted: we can see which features are driving the prediction. That’s helpful for
                debugging… but it still doesn’t prove the headline is true or false.
              </p>
            </div>

            <Button className="w-full rounded-full btn-detective bg-gradient-to-r from-primary to-secondary" onClick={save}>
              <FileCheck2 className="mr-2" size={18} />
              Save score
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full"
              onClick={() => setText("SHOCKING secret method guarantees genius overnight")}
            >
              <Wand2 className="mr-2" size={18} />
              Try a sample
            </Button>
          </div>
        </div>
      </div>
    </ModuleShell>
  );
}


