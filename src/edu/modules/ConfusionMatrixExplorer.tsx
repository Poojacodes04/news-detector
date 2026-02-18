import { useMemo, useState } from "react";
import ModuleShell from "@/edu/components/ModuleShell";
import { getModuleMeta } from "@/edu/modules/registry";
import type { ModuleId } from "@/edu/types";
import { useEdu } from "@/edu/EduContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { makeToyScoredExamples, confusionFromThreshold, metricsFromCounts, type ScoredExample } from "@/edu/modules/toyData";
import { cn } from "@/lib/utils";
import { FileCheck2, Target } from "lucide-react";

const MODULE_ID: ModuleId = "confusion-matrix";

type Cell = "TP" | "FP" | "TN" | "FN";

export default function ConfusionMatrixExplorer() {
  const meta = getModuleMeta(MODULE_ID)!;
  const { recordModuleAttempt } = useEdu();

  const examples = useMemo(() => makeToyScoredExamples(), []);
  const [threshold, setThreshold] = useState(0.5);
  const [cell, setCell] = useState<Cell>("TP");

  const counts = useMemo(() => confusionFromThreshold(examples, threshold), [examples, threshold]);
  const m = useMemo(() => metricsFromCounts(counts), [counts]);

  const challenge = useMemo(() => {
    // Keep false positives low while still catching many fakes.
    const fpOk = counts.fp <= 2;
    const recallOk = m.recall >= 0.75;
    return { fpOk, recallOk, passed: fpOk && recallOk };
  }, [counts.fp, m.recall]);

  const score = useMemo(() => {
    const fpScore = 1 - Math.min(1, counts.fp / 6);
    const recallScore = Math.min(1, m.recall / 0.85);
    const combined = 0.55 * recallScore + 0.45 * fpScore;
    return Math.round(combined * meta.maxPoints);
  }, [counts.fp, m.recall, meta.maxPoints]);

  const save = () => {
    recordModuleAttempt({
      moduleId: MODULE_ID,
      scoredPoints: score,
      maxPoints: meta.maxPoints,
      completed: challenge.passed,
    });
  };

  const getCellExamples = (c: Cell): ScoredExample[] => {
    return examples.filter((ex) => {
      const pred = ex.scoreFake >= threshold ? "Fake" : "Real";
      if (c === "TP") return ex.truth === "Fake" && pred === "Fake";
      if (c === "FP") return ex.truth === "Real" && pred === "Fake";
      if (c === "TN") return ex.truth === "Real" && pred === "Real";
      return ex.truth === "Fake" && pred === "Real";
    });
  };

  const cellStyle = (c: Cell) => {
    switch (c) {
      case "TP":
        return "bg-success/10 border-success/40";
      case "TN":
        return "bg-success/10 border-success/40";
      case "FP":
        return "bg-destructive/10 border-destructive/40";
      case "FN":
        return "bg-destructive/10 border-destructive/40";
    }
  };

  return (
    <ModuleShell
      meta={meta}
      instructions={
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Many models output a <span className="text-accent font-bold">score</span> (0 to 1). We choose a{" "}
            <span className="text-accent font-bold">threshold</span> to turn that score into “Fake” vs “Real”.
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Move the threshold slider.</li>
            <li>Watch the confusion matrix update.</li>
            <li>
              Challenge: keep <span className="font-bold">False Positives ≤ 2</span> and{" "}
              <span className="font-bold">Recall ≥ 75%</span>, then save.
            </li>
          </ul>
        </div>
      }
    >
      <div className="card-case-file p-6 text-left">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-secondary text-secondary-foreground">
              <Target size={14} className="mr-1" /> Threshold: {threshold.toFixed(2)}
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
          <p className="text-sm font-bold">Decision threshold</p>
          <p className="text-xs text-muted-foreground mb-2">
            If scoreFake ≥ threshold, the model predicts <span className="font-bold">Fake</span>. Otherwise it predicts{" "}
            <span className="font-bold">Real</span>.
          </p>
          <Slider value={[Math.round(threshold * 100)]} min={1} max={99} step={1} onValueChange={(v) => setThreshold(v[0] / 100)} />
        </div>

        <div className={cn("mt-6 rounded-xl p-4 border-2", challenge.passed ? "bg-success/10 border-success/50" : "bg-accent/10 border-accent/50")}>
          <p className="font-black">Challenge</p>
          <p className="mt-2 text-sm text-muted-foreground">
            False Positives ≤ 2: <span className={challenge.fpOk ? "text-success font-bold" : "text-destructive font-bold"}>{counts.fp}</span>
            {" · "}
            Recall ≥ 75%:{" "}
            <span className={challenge.recallOk ? "text-success font-bold" : "text-destructive font-bold"}>{(m.recall * 100).toFixed(1)}%</span>
          </p>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold">Confusion matrix</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full">
                  Inspect examples
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Examples in {cell}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(["TP", "FP", "TN", "FN"] as Cell[]).map((c) => (
                    <Button
                      key={c}
                      variant={cell === c ? "secondary" : "outline"}
                      className="rounded-full"
                      onClick={() => setCell(c)}
                    >
                      {c}
                    </Button>
                  ))}
                </div>
                <div className="space-y-2 max-h-[60vh] overflow-auto">
                  {getCellExamples(cell).map((ex) => (
                    <div key={ex.id} className="rounded-lg border border-border bg-muted/30 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-bold">{ex.headline}</p>
                        <Badge variant="outline" className="border-border/60">
                          truth: {ex.truth} · scoreFake: {ex.scoreFake.toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {getCellExamples(cell).length === 0 && (
                    <p className="text-sm text-muted-foreground">No examples in this cell for the current threshold.</p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-3">
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
                  <TableCell className={cn("border", cellStyle("TP"))}>
                    <button className="w-full text-left" onClick={() => setCell("TP")}>
                      <span className="font-mono font-bold">{counts.tp}</span>
                      <span className="ml-2 text-xs text-muted-foreground">(TP)</span>
                    </button>
                  </TableCell>
                  <TableCell className={cn("border", cellStyle("FN"))}>
                    <button className="w-full text-left" onClick={() => setCell("FN")}>
                      <span className="font-mono font-bold">{counts.fn}</span>
                      <span className="ml-2 text-xs text-muted-foreground">(FN)</span>
                    </button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">True Real</TableCell>
                  <TableCell className={cn("border", cellStyle("FP"))}>
                    <button className="w-full text-left" onClick={() => setCell("FP")}>
                      <span className="font-mono font-bold">{counts.fp}</span>
                      <span className="ml-2 text-xs text-muted-foreground">(FP)</span>
                    </button>
                  </TableCell>
                  <TableCell className={cn("border", cellStyle("TN"))}>
                    <button className="w-full text-left" onClick={() => setCell("TN")}>
                      <span className="font-mono font-bold">{counts.tn}</span>
                      <span className="ml-2 text-xs text-muted-foreground">(TN)</span>
                    </button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Try: raising the threshold usually reduces false positives, but may increase false negatives.
          </p>
          <Button className="rounded-full btn-detective bg-gradient-to-r from-primary to-secondary" onClick={save}>
            <FileCheck2 className="mr-2" size={18} />
            Save score
          </Button>
        </div>
      </div>
    </ModuleShell>
  );
}


