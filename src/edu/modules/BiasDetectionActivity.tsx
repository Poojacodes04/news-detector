import { useMemo, useState } from "react";
import ModuleShell from "@/edu/components/ModuleShell";
import { getModuleMeta } from "@/edu/modules/registry";
import type { ModuleId } from "@/edu/types";
import { useEdu } from "@/edu/EduContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Scale, Trophy } from "lucide-react";

const MODULE_ID: ModuleId = "bias-detection";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

export default function BiasDetectionActivity() {
  const meta = getModuleMeta(MODULE_ID)!;
  const { recordModuleAttempt } = useEdu();

  // Dataset composition sliders (sum <= 100; remainder becomes "Other").
  const [science, setScience] = useState(25);
  const [community, setCommunity] = useState(25);
  const [entertainment, setEntertainment] = useState(25);

  // Label noise (how often labels are wrong).
  const [labelNoise, setLabelNoise] = useState(10); // %

  const other = clamp(100 - (science + community + entertainment), 0, 100);
  const normalized = useMemo(() => {
    const sum = science + community + entertainment + other;
    return {
      science: (science / sum) * 100,
      community: (community / sum) * 100,
      entertainment: (entertainment / sum) * 100,
      other: (other / sum) * 100,
    };
  }, [science, community, entertainment, other]);

  // Toy performance model:
  // - More representation => better accuracy on that group.
  // - More label noise => lower accuracy across the board.
  const groupAcc = useMemo(() => {
    const noisePenalty = (labelNoise / 100) * 0.25; // up to -0.25
    const accFromPct = (pct: number) => {
      // Diminishing returns. 0% -> 0.52, 25% -> ~0.75, 50% -> ~0.82, 100% -> ~0.90
      const base = 0.52 + 0.38 * (1 - Math.exp(-pct / 22));
      return clamp(base - noisePenalty, 0.45, 0.95);
    };
    return {
      science: accFromPct(normalized.science),
      community: accFromPct(normalized.community),
      entertainment: accFromPct(normalized.entertainment),
      other: accFromPct(normalized.other),
    };
  }, [labelNoise, normalized]);

  const overallAcc = useMemo(() => {
    return (
      (groupAcc.science * normalized.science +
        groupAcc.community * normalized.community +
        groupAcc.entertainment * normalized.entertainment +
        groupAcc.other * normalized.other) /
      100
    );
  }, [groupAcc, normalized]);

  const gap = useMemo(() => {
    const vals = Object.values(groupAcc);
    return Math.max(...vals) - Math.min(...vals);
  }, [groupAcc]);

  const meetsChallenge = overallAcc >= 0.78 && gap <= 0.12 && labelNoise <= 15;

  const score = useMemo(() => {
    // Points reward: overall accuracy + fairness (small gap) + low noise.
    const accScore = clamp((overallAcc - 0.55) / (0.9 - 0.55), 0, 1);
    const gapScore = 1 - clamp(gap / 0.25, 0, 1);
    const noiseScore = 1 - clamp(labelNoise / 40, 0, 1);
    const combined = 0.55 * accScore + 0.3 * gapScore + 0.15 * noiseScore;
    return Math.round(combined * meta.maxPoints);
  }, [gap, labelNoise, meta.maxPoints, overallAcc]);

  const save = () => {
    recordModuleAttempt({
      moduleId: MODULE_ID,
      scoredPoints: score,
      maxPoints: meta.maxPoints,
      completed: meetsChallenge,
    });
  };

  const bar = (value01: number, color: string) => (
    <div className="mt-2 h-3 w-full rounded-full bg-muted overflow-hidden border border-border">
      <div className={cn("h-full", color)} style={{ width: `${Math.round(value01 * 100)}%` }} />
    </div>
  );

  return (
    <ModuleShell
      meta={meta}
      instructions={
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Build a training dataset by choosing how many examples come from different topics.
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>More examples from a group usually means the model does better on that group.</li>
            <li>Label noise (wrong labels) makes the model worse for everyone.</li>
            <li>
              Challenge: aim for <span className="text-accent font-bold">high overall accuracy</span> and{" "}
              <span className="text-accent font-bold">small gaps</span> between groups.
            </li>
          </ul>
        </div>
      }
    >
      <div className="card-case-file p-6 text-left">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-secondary text-secondary-foreground">
              <Scale size={14} className="mr-1" /> Fairness gap: {round1(gap * 100)}%
            </Badge>
            <Badge variant="outline" className="border-border/60">
              Overall: {round1(overallAcc * 100)}%
            </Badge>
            <Badge variant="outline" className="border-border/60">
              Noise: {labelNoise}%
            </Badge>
          </div>
          <Badge className="bg-secondary text-secondary-foreground">
            <Trophy size={14} className="mr-1" /> Score: {score}/{meta.maxPoints}
          </Badge>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div>
              <p className="text-sm font-bold">Dataset composition (percent)</p>
              <p className="text-xs text-muted-foreground">
                Tip: if your three sliders add up to less than 100%, the leftover becomes “Other”.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Science</p>
                  <p className="text-xs text-muted-foreground">{science}%</p>
                </div>
                <Slider value={[science]} min={0} max={100} step={5} onValueChange={(v) => setScience(v[0])} />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Community</p>
                  <p className="text-xs text-muted-foreground">{community}%</p>
                </div>
                <Slider value={[community]} min={0} max={100} step={5} onValueChange={(v) => setCommunity(v[0])} />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">Entertainment</p>
                  <p className="text-xs text-muted-foreground">{entertainment}%</p>
                </div>
                <Slider
                  value={[entertainment]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(v) => setEntertainment(v[0])}
                />
              </div>
              <div className="bg-muted/30 rounded-xl p-3 border border-border">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold">Other (auto)</p>
                  <p className="text-xs text-muted-foreground">{other}%</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">Label noise</p>
                <p className="text-xs text-muted-foreground">{labelNoise}%</p>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Noise means some labels are wrong. This can happen when rules are unclear or labelers disagree.
              </p>
              <Slider value={[labelNoise]} min={0} max={40} step={5} onValueChange={(v) => setLabelNoise(v[0])} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/30 rounded-xl p-4 border border-border">
              <p className="font-bold">Group performance (toy simulation)</p>
              <p className="text-xs text-muted-foreground mt-1">
                This is a simplified simulator for learning. Real fairness analysis is more detailed.
              </p>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Science</p>
                    <p className="text-xs text-muted-foreground">{round1(groupAcc.science * 100)}%</p>
                  </div>
                  {bar(groupAcc.science, "bg-success")}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Community</p>
                    <p className="text-xs text-muted-foreground">{round1(groupAcc.community * 100)}%</p>
                  </div>
                  {bar(groupAcc.community, "bg-secondary")}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Entertainment</p>
                    <p className="text-xs text-muted-foreground">{round1(groupAcc.entertainment * 100)}%</p>
                  </div>
                  {bar(groupAcc.entertainment, "bg-orange")}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Other</p>
                    <p className="text-xs text-muted-foreground">{round1(groupAcc.other * 100)}%</p>
                  </div>
                  {bar(groupAcc.other, "bg-primary")}
                </div>
              </div>
            </div>

            <div className={cn("rounded-xl p-4 border-2", meetsChallenge ? "bg-success/10 border-success/50" : "bg-accent/10 border-accent/50")}>
              <p className="font-black">{meetsChallenge ? "Challenge met!" : "Challenge"}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try to reach: overall ≥ <span className="font-bold">78%</span>, gap ≤ <span className="font-bold">12%</span>, noise ≤{" "}
                <span className="font-bold">15%</span>.
              </p>
              <div className="mt-3">
                <p className="text-xs text-muted-foreground">Overall accuracy meter</p>
                <Progress value={Math.round(overallAcc * 100)} className="mt-2 h-3" />
              </div>
            </div>

            <Button className="w-full rounded-full btn-detective bg-gradient-to-r from-primary to-secondary" onClick={save}>
              Save score
            </Button>
          </div>
        </div>
      </div>
    </ModuleShell>
  );
}


