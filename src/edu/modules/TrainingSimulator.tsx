import { useMemo, useState } from "react";
import ModuleShell from "@/edu/components/ModuleShell";
import { getModuleMeta } from "@/edu/modules/registry";
import type { ModuleId } from "@/edu/types";
import { useEdu } from "@/edu/EduContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Beaker, Cpu, FileCheck2, Layers, Play, Sparkles } from "lucide-react";

const MODULE_ID: ModuleId = "training-simulator";

type Choice<T extends string> = { id: T; title: string; description: string };

type DataSize = "small" | "medium" | "large";
type GuidelineQuality = "vague" | "okay" | "clear";
type FeatureCount = "few" | "standard" | "many";
type ModelType = "naive-bayes" | "logistic" | "tree";
type MetricFocus = "accuracy" | "precision" | "recall";

const DATA: Choice<DataSize>[] = [
  { id: "small", title: "Small dataset", description: "Fast, but risky: the model may not learn enough patterns." },
  { id: "medium", title: "Medium dataset", description: "A decent baseline for learning patterns." },
  { id: "large", title: "Large dataset", description: "More examples usually improves generalization." },
];
const GUIDELINES: Choice<GuidelineQuality>[] = [
  { id: "vague", title: "Vague rules", description: "Labelers disagree often → noisy labels." },
  { id: "okay", title: "Some rules", description: "Better, but still some inconsistency." },
  { id: "clear", title: "Clear rules", description: "Higher agreement → cleaner training signal." },
];
const FEATURES: Choice<FeatureCount>[] = [
  { id: "few", title: "Few features", description: "Simpler model, might miss useful clues." },
  { id: "standard", title: "Standard (like this project)", description: "Good balance for many text tasks." },
  { id: "many", title: "Many features", description: "More expressive, but can overfit small data." },
];
const MODELS: Choice<ModelType>[] = [
  { id: "naive-bayes", title: "Naive Bayes", description: "Simple, fast, strong baseline for text." },
  { id: "logistic", title: "Logistic Regression", description: "Often accurate; weights are interpretable." },
  { id: "tree", title: "Decision Tree", description: "Can overfit easily with sparse text features." },
];
const FOCUS: Choice<MetricFocus>[] = [
  { id: "accuracy", title: "Accuracy", description: "Overall correctness (but can hide mistake types)." },
  { id: "precision", title: "Precision", description: "Avoid false alarms (Real labeled as Fake)." },
  { id: "recall", title: "Recall", description: "Catch more fakes (avoid misses)." },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

export default function TrainingSimulator() {
  const meta = getModuleMeta(MODULE_ID)!;
  const { recordModuleAttempt } = useEdu();

  const [dataSize, setDataSize] = useState<DataSize>("medium");
  const [guidelines, setGuidelines] = useState<GuidelineQuality>("okay");
  const [features, setFeatures] = useState<FeatureCount>("standard");
  const [model, setModel] = useState<ModelType>("naive-bayes");
  const [focus, setFocus] = useState<MetricFocus>("accuracy");

  const [trained, setTrained] = useState(false);
  const [trainingPct, setTrainingPct] = useState(0);

  const sim = useMemo(() => {
    // Convert choices to numeric effects.
    const dataBoost = dataSize === "small" ? 0.0 : dataSize === "medium" ? 0.08 : 0.16;
    const noise = guidelines === "vague" ? 0.18 : guidelines === "okay" ? 0.1 : 0.05;

    const featureRisk = features === "few" ? -0.02 : features === "standard" ? 0.03 : 0.06;
    const overfitPenalty = features === "many" && dataSize === "small" ? 0.08 : features === "many" && dataSize === "medium" ? 0.04 : 0.0;

    const modelBase =
      model === "naive-bayes" ? 0.78 : model === "logistic" ? 0.81 : 0.74;
    const modelPenalty = model === "tree" ? 0.03 : 0.0;

    // Base metrics
    const accuracy = clamp(modelBase + dataBoost + featureRisk - overfitPenalty - noise - modelPenalty, 0.55, 0.92);
    const precision = clamp(accuracy - (focus === "recall" ? 0.06 : 0.0) + (focus === "precision" ? 0.05 : 0.0), 0.5, 0.95);
    const recall = clamp(accuracy - (focus === "precision" ? 0.06 : 0.0) + (focus === "recall" ? 0.05 : 0.0), 0.5, 0.95);

    // Confusion matrix for an imaginary test set of 100 items with 50 fakes.
    const total = 100;
    const positives = 50;
    const tp = Math.round(recall * positives);
    const fn = positives - tp;
    const predictedPos = Math.round(tp / Math.max(precision, 0.01));
    const fp = clamp(predictedPos - tp, 0, total - positives);
    const tn = total - positives - fp;

    const fairnessRisk =
      dataSize === "small" ? 0.12 : dataSize === "medium" ? 0.08 : 0.05;
    const biasRisk = clamp(fairnessRisk + (guidelines === "vague" ? 0.05 : 0.0) + (features === "many" ? 0.03 : 0.0), 0.03, 0.25);

    return { accuracy, precision, recall, tp, fp, tn, fn, biasRisk };
  }, [dataSize, features, focus, guidelines, model]);

  const score = useMemo(() => {
    // Reward high accuracy plus cleaner data practices.
    const accPts = clamp((sim.accuracy - 0.6) / (0.9 - 0.6), 0, 1) * 10;
    const biasPts = (1 - clamp(sim.biasRisk / 0.25, 0, 1)) * 4;
    const focusPts =
      focus === "accuracy"
        ? 2
        : focus === "precision"
          ? sim.precision >= 0.8
            ? 2
            : 1
          : sim.recall >= 0.8
            ? 2
            : 1;
    return Math.round(clamp(accPts + biasPts + focusPts, 0, meta.maxPoints));
  }, [focus, meta.maxPoints, sim.accuracy, sim.biasRisk, sim.precision, sim.recall]);

  const completed = trained && sim.accuracy >= 0.8 && sim.biasRisk <= 0.12;

  const train = async () => {
    setTrained(false);
    setTrainingPct(0);
    // Tiny fake progress animation.
    for (const pct of [10, 25, 45, 65, 85, 100]) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 180));
      setTrainingPct(pct);
    }
    setTrained(true);
  };

  const save = () => {
    recordModuleAttempt({
      moduleId: MODULE_ID,
      scoredPoints: score,
      maxPoints: meta.maxPoints,
      completed,
    });
  };

  const choiceButtons = <T extends string>(
    items: Choice<T>[],
    value: T,
    setValue: (v: T) => void,
  ) => (
    <div className="flex flex-wrap gap-2">
      {items.map((c) => (
        <Button
          key={c.id}
          variant={value === c.id ? "secondary" : "outline"}
          className="rounded-full"
          onClick={() => setValue(c.id)}
        >
          {c.title}
        </Button>
      ))}
    </div>
  );

  return (
    <ModuleShell
      meta={meta}
      instructions={
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            This simulator mirrors a real ML pipeline: data → labels → features → model → evaluation.
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Make choices for each step.</li>
            <li>Train the model and inspect results.</li>
            <li>
              Challenge: reach <span className="font-bold">accuracy ≥ 80%</span> while keeping <span className="font-bold">bias risk ≤ 12%</span>.
            </li>
          </ul>
        </div>
      }
    >
      <div className="card-case-file p-6 text-left space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-secondary text-secondary-foreground">
              <Cpu size={14} className="mr-1" /> Simulated accuracy: {round1(sim.accuracy * 100)}%
            </Badge>
            <Badge variant="outline" className="border-border/60">
              Precision: {round1(sim.precision * 100)}%
            </Badge>
            <Badge variant="outline" className="border-border/60">
              Recall: {round1(sim.recall * 100)}%
            </Badge>
            <Badge variant="outline" className="border-border/60">
              Bias risk: {round1(sim.biasRisk * 100)}%
            </Badge>
          </div>
          <Badge className="bg-secondary text-secondary-foreground">
            <Trophy size={14} className="mr-1" /> Score: {score}/{meta.maxPoints}
          </Badge>
        </div>

        <div className={cn("rounded-xl p-4 border-2", completed ? "bg-success/10 border-success/50" : "bg-accent/10 border-accent/50")}>
          <p className="font-black">Challenge status</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Accuracy ≥ 80% and bias risk ≤ 12%. Train, then save when you meet the goal.
          </p>
          <Progress value={Math.round(sim.accuracy * 100)} className="mt-3 h-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div>
              <p className="text-sm font-bold flex items-center gap-2">
                <Layers size={16} className="text-accent" /> 1) Data size
              </p>
              <p className="text-xs text-muted-foreground mb-2">How many examples do we collect?</p>
              {choiceButtons(DATA, dataSize, setDataSize)}
            </div>

            <div>
              <p className="text-sm font-bold flex items-center gap-2">
                <Beaker size={16} className="text-accent" /> 2) Labeling guidelines
              </p>
              <p className="text-xs text-muted-foreground mb-2">How consistent are the labels?</p>
              {choiceButtons(GUIDELINES, guidelines, setGuidelines)}
            </div>

            <div>
              <p className="text-sm font-bold flex items-center gap-2">
                <Sparkles size={16} className="text-accent" /> 3) Features
              </p>
              <p className="text-xs text-muted-foreground mb-2">How many word features do we use?</p>
              {choiceButtons(FEATURES, features, setFeatures)}
            </div>

            <div>
              <p className="text-sm font-bold">4) Model type</p>
              <p className="text-xs text-muted-foreground mb-2">Different models behave differently with text.</p>
              {choiceButtons(MODELS, model, setModel)}
            </div>

            <div>
              <p className="text-sm font-bold">5) What do you optimize?</p>
              <p className="text-xs text-muted-foreground mb-2">This changes which mistakes you prefer to avoid.</p>
              {choiceButtons(FOCUS, focus, setFocus)}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="rounded-full btn-detective bg-gradient-to-r from-accent via-orange to-accent text-accent-foreground flex-1"
                onClick={train}
              >
                <Play className="mr-2" size={18} />
                Train model
              </Button>
              <Button className="rounded-full btn-detective bg-gradient-to-r from-primary to-secondary flex-1" onClick={save} disabled={!trained}>
                <FileCheck2 className="mr-2" size={18} />
                Save score
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/10 rounded-xl p-4 border border-border">
              <p className="text-sm font-bold">Training progress</p>
              <Progress value={trainingPct} className="mt-3 h-3" />
              <p className="mt-2 text-xs text-muted-foreground">
                {trained ? "Training complete! Now inspect results." : "Click “Train model” to simulate the pipeline."}
              </p>
            </div>

            <div className="bg-muted/10 rounded-xl p-4 border border-border">
              <p className="text-sm font-bold">Confusion matrix (test set of 100)</p>
              <Separator className="my-3" />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Pred Fake</TableHead>
                    <TableHead>Pred Real</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold">True Fake</TableCell>
                    <TableCell className="bg-success/10 border border-success/40 font-mono">{sim.tp}</TableCell>
                    <TableCell className="bg-destructive/10 border border-destructive/40 font-mono">{sim.fn}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">True Real</TableCell>
                    <TableCell className="bg-destructive/10 border border-destructive/40 font-mono">{sim.fp}</TableCell>
                    <TableCell className="bg-success/10 border border-success/40 font-mono">{sim.tn}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="bg-muted/10 rounded-xl p-4 border border-border">
              <p className="text-sm font-bold">Reflection question</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Which step did the most damage in your configuration: too little data, unclear labeling, too many features, or model choice?
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModuleShell>
  );
}


