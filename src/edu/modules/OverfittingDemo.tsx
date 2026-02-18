import { useMemo, useState } from "react";
import ModuleShell from "@/edu/components/ModuleShell";
import { getModuleMeta } from "@/edu/modules/registry";
import type { ModuleId } from "@/edu/types";
import { useEdu } from "@/edu/EduContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const MODULE_ID: ModuleId = "overfitting-demo";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function accModel(args: { complexity: number; dataSize: number; noisePct: number }) {
  const { complexity, dataSize, noisePct } = args;
  const noise = noisePct / 100;

  // Training accuracy grows with complexity (memorization helps).
  const train = 0.55 + 0.45 * (1 - Math.exp(-(complexity * dataSize) / 2200));

  // Test accuracy improves with more data but penalizes too much complexity.
  const dataBoost = 0.46 * (1 - Math.exp(-dataSize / 320));
  const complexityPenalty = 0.02 * Math.max(0, complexity - 5) ** 2; // overfit penalty after mid complexity
  const noisePenalty = 0.35 * noise;
  const test = 0.52 + dataBoost - complexityPenalty - noisePenalty;

  return {
    train: clamp(train, 0.45, 0.99),
    test: clamp(test, 0.45, 0.95),
  };
}

export default function OverfittingDemo() {
  const meta = getModuleMeta(MODULE_ID)!;
  const { recordModuleAttempt } = useEdu();

  const [dataSize, setDataSize] = useState(300);
  const [noisePct, setNoisePct] = useState(10);
  const [complexity, setComplexity] = useState(5);

  const series = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const c = i + 1;
      const a = accModel({ complexity: c, dataSize, noisePct });
      return {
        complexity: c,
        train: Math.round(a.train * 1000) / 10,
        test: Math.round(a.test * 1000) / 10,
      };
    });
  }, [dataSize, noisePct]);

  const current = useMemo(() => accModel({ complexity, dataSize, noisePct }), [complexity, dataSize, noisePct]);

  const best = useMemo(() => {
    return series.reduce(
      (bestSoFar, row) => (row.test > bestSoFar.test ? row : bestSoFar),
      series[0],
    );
  }, [series]);

  const currentTest = Math.round(current.test * 1000) / 10;
  const bestTest = best.test;

  const gap = Math.max(0, bestTest - currentTest); // percent points
  const meetsChallenge = gap <= 1.0; // within 1.0 percentage point

  const score = useMemo(() => {
    const closeness = 1 - clamp(gap / 8, 0, 1);
    const dataBonus = clamp((dataSize - 100) / 600, 0, 1) * 0.1; // small bonus for exploring more data
    return Math.round((closeness + dataBonus) * meta.maxPoints);
  }, [dataSize, gap, meta.maxPoints]);

  const save = () => {
    recordModuleAttempt({
      moduleId: MODULE_ID,
      scoredPoints: score,
      maxPoints: meta.maxPoints,
      completed: meetsChallenge,
    });
  };

  return (
    <ModuleShell
      meta={meta}
      instructions={
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Overfitting happens when a model learns the training data too perfectly and fails on new examples.
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Change complexity, data size, and label noise.</li>
            <li>Watch training vs test accuracy.</li>
            <li>
              Challenge: choose a complexity that gets within <span className="font-bold">1%</span> of the best test score.
            </li>
          </ul>
        </div>
      }
    >
      <div className="card-case-file p-6 text-left space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-secondary text-secondary-foreground">
              Train: {(current.train * 100).toFixed(1)}%
            </Badge>
            <Badge variant="outline" className="border-border/60">
              Test: {(current.test * 100).toFixed(1)}%
            </Badge>
            <Badge variant="outline" className="border-border/60">
              Best test: {best.test.toFixed(1)}% (complexity {best.complexity})
            </Badge>
          </div>
          <Badge className="bg-secondary text-secondary-foreground">
            <Trophy size={14} className="mr-1" /> Score: {score}/{meta.maxPoints}
          </Badge>
        </div>

        <div className={cn("rounded-xl p-4 border-2", meetsChallenge ? "bg-success/10 border-success/50" : "bg-accent/10 border-accent/50")}>
          <p className="font-black">Challenge status</p>
          <p className="mt-2 text-sm text-muted-foreground">
            You are <span className={meetsChallenge ? "text-success font-bold" : "text-destructive font-bold"}>{gap.toFixed(1)}%</span> below the best possible test score for these settings.
          </p>
          <Progress value={Math.round((1 - clamp(gap / 8, 0, 1)) * 100)} className="mt-3 h-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div>
              <p className="text-sm font-bold">Complexity</p>
              <p className="text-xs text-muted-foreground mb-2">
                Higher complexity can memorize more… which can hurt generalization.
              </p>
              <Slider value={[complexity]} min={1} max={10} step={1} onValueChange={(v) => setComplexity(v[0])} />
              <p className="mt-1 text-xs text-muted-foreground">Selected: {complexity}</p>
            </div>

            <div>
              <p className="text-sm font-bold">Training data size</p>
              <p className="text-xs text-muted-foreground mb-2">
                More data usually helps the model learn real patterns instead of memorizing.
              </p>
              <Slider value={[dataSize]} min={50} max={800} step={50} onValueChange={(v) => setDataSize(v[0])} />
              <p className="mt-1 text-xs text-muted-foreground">Examples: {dataSize}</p>
            </div>

            <div>
              <p className="text-sm font-bold">Label noise</p>
              <p className="text-xs text-muted-foreground mb-2">
                Wrong labels add confusion and reduce test accuracy.
              </p>
              <Slider value={[noisePct]} min={0} max={35} step={5} onValueChange={(v) => setNoisePct(v[0])} />
              <p className="mt-1 text-xs text-muted-foreground">Noise: {noisePct}%</p>
            </div>

            <Button className="rounded-full btn-detective bg-gradient-to-r from-primary to-secondary w-full" onClick={save}>
              <Sparkles className="mr-2" size={18} />
              Save score
            </Button>
          </div>

          <div className="bg-muted/10 rounded-xl p-4 border border-border">
            <p className="text-sm font-bold mb-3">Training vs test accuracy</p>
            <ChartContainer
              className="w-full"
              config={{
                train: { label: "Training", color: "hsl(var(--secondary))" },
                test: { label: "Test", color: "hsl(var(--success))" },
              }}
            >
              <LineChart data={series} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="complexity" tickLine={false} axisLine={false} />
                <YAxis domain={[45, 95]} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="train" stroke="var(--color-train)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="test" stroke="var(--color-test)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
            <p className="mt-3 text-xs text-muted-foreground">
              Notice: training accuracy can keep rising with complexity, while test accuracy can peak and then fall.
            </p>
          </div>
        </div>
      </div>
    </ModuleShell>
  );
}


