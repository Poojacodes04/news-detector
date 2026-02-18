import { useMemo, useState } from "react";
import ModuleShell from "@/edu/components/ModuleShell";
import { getModuleMeta } from "@/edu/modules/registry";
import type { ModuleId } from "@/edu/types";
import { useEdu } from "@/edu/EduContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, ClipboardCheck, RefreshCw, XCircle } from "lucide-react";

type Item = {
  headline: string;
  gold: "Fake" | "Real";
  guidelineHint: string;
  explanation: string;
  ambiguous?: boolean;
};

const ITEMS: Item[] = [
  {
    headline: "Community garden shares free vegetables with neighbors",
    gold: "Real",
    guidelineHint: "Specific, local, and plausible.",
    explanation: "This sounds like a normal community update with no extreme claims.",
  },
  {
    headline: "BREAKING: Scientists confirm chewing gum makes you genius overnight!!!",
    gold: "Fake",
    guidelineHint: "Overpromise + urgency + excessive punctuation.",
    explanation: "Instant, extreme outcomes are a common clickbait pattern.",
  },
  {
    headline: "Study finds students remember more after short breaks",
    gold: "Real",
    guidelineHint: "Careful language (“study finds”) and a realistic claim.",
    explanation: "It’s plausible and not framed as a miracle cure.",
  },
  {
    headline: "Secret trick schools don't want parents to know about grades",
    gold: "Fake",
    guidelineHint: "“They don’t want you to know” framing is a red flag.",
    explanation: "Vague conspiratorial framing without specifics often indicates misinformation.",
  },
  {
    headline: "Town announces schedule for weekend road repairs",
    gold: "Real",
    guidelineHint: "Concrete action + simple reporting.",
    explanation: "Everyday announcements like this are typically straightforward and factual.",
  },
  {
    headline: "Doctors hate this snack — it cures any illness in 24 hours",
    gold: "Fake",
    guidelineHint: "Unrealistic health claim.",
    explanation: "“Cures any illness” is too absolute; reliable reporting avoids guarantees like that.",
  },
  {
    headline: "Museum opens new exhibit about ancient inventions",
    gold: "Real",
    guidelineHint: "Specific and normal event.",
    explanation: "No emotional manipulation; sounds like a typical culture announcement.",
  },
  {
    headline: "You won't believe this teacher's one weird method to end homework forever",
    gold: "Fake",
    guidelineHint: "Clickbait phrasing (“one weird method”).",
    explanation: "This style is designed to get clicks, not to inform.",
  },
  {
    headline: "School board discusses new rules for phone use in class",
    gold: "Real",
    guidelineHint: "Balanced and specific topic.",
    explanation: "Sounds like a normal policy discussion, not a shocking claim.",
  },
  {
    headline: "Experts say some habits may help you focus better",
    gold: "Real",
    guidelineHint: "Soft language (“may”) is more realistic than certainty.",
    explanation: "Responsible writing often uses cautious words instead of guarantees.",
    ambiguous: true,
  },
  {
    headline: "Mind-blowing discovery proves all textbooks are wrong",
    gold: "Fake",
    guidelineHint: "Extreme claim (“all textbooks”).",
    explanation: "Sweeping statements are rarely accurate and are often used to mislead.",
  },
  {
    headline: "Weather service warns of strong winds later today",
    gold: "Real",
    guidelineHint: "Named institution + limited claim.",
    explanation: "A normal alert with a clear source is a good sign.",
  },
];

const MODULE_ID: ModuleId = "data-labeling";

export default function DataLabelingSimulator() {
  const meta = getModuleMeta(MODULE_ID)!;
  const { recordModuleAttempt } = useEdu();

  const [index, setIndex] = useState(0);
  const [labels, setLabels] = useState<Array<"Fake" | "Real" | null>>(() => Array(ITEMS.length).fill(null));
  const [showHint, setShowHint] = useState(true);

  const current = ITEMS[index];
  const chosen = labels[index];

  const answeredCount = useMemo(() => labels.filter(Boolean).length, [labels]);
  const finished = answeredCount === ITEMS.length;
  const progress = Math.round((answeredCount / ITEMS.length) * 100);

  const correctCount = useMemo(() => {
    return labels.reduce((sum, l, i) => sum + (l && l === ITEMS[i].gold ? 1 : 0), 0);
  }, [labels]);

  const score = correctCount;
  const maxPoints = meta.maxPoints;

  const labelCounts = useMemo(() => {
    const fake = labels.filter((l) => l === "Fake").length;
    const real = labels.filter((l) => l === "Real").length;
    return { fake, real };
  }, [labels]);

  const goNext = () => setIndex((i) => Math.min(ITEMS.length - 1, i + 1));
  const goPrev = () => setIndex((i) => Math.max(0, i - 1));

  const choose = (l: "Fake" | "Real") => {
    if (chosen) return;
    const next = [...labels];
    next[index] = l;
    setLabels(next);
  };

  const reset = () => {
    setIndex(0);
    setLabels(Array(ITEMS.length).fill(null));
  };

  const save = () => {
    if (!finished) return;
    recordModuleAttempt({ moduleId: MODULE_ID, scoredPoints: score, maxPoints, completed: true });
  };

  return (
    <ModuleShell
      meta={meta}
      instructions={
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            You are the labeler. Your labels become the “answers” the AI learns from.
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Label each headline as <span className="text-success font-bold">Real</span> or <span className="text-destructive font-bold">Fake</span>.</li>
            <li>After each label, you’ll see the example label and explanation.</li>
            <li>Finish all items to save your score.</li>
          </ul>
          <div className="bg-muted/30 rounded-xl p-3 border border-border">
            <p className="text-xs text-muted-foreground">
              Real life: some examples are ambiguous. Good datasets use clear guidelines and sometimes multiple labelers.
            </p>
          </div>
        </div>
      }
    >
      <div className="card-case-file p-6 text-left">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-border/60">
              Item {index + 1}/{ITEMS.length}
            </Badge>
            <Badge className="bg-secondary text-secondary-foreground">
              <ClipboardCheck size={14} className="mr-1" /> Labeled: {answeredCount}/{ITEMS.length}
            </Badge>
            <Badge variant="outline" className="border-border/60">
              Your labels: {labelCounts.real} Real / {labelCounts.fake} Fake
            </Badge>
          </div>
          <div className="min-w-[220px]">
            <Progress value={progress} className="h-3" />
            <p className="mt-1 text-xs text-muted-foreground">{progress}% complete</p>
          </div>
        </div>

        <div className="mt-5 bg-muted/30 rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground">Headline to label</p>
          <p className="mt-1 text-lg font-bold italic">“{current.headline}”</p>
          {current.ambiguous && (
            <p className="mt-2 text-xs text-muted-foreground">
              Note: this one is a little ambiguous on purpose — that happens in real datasets.
            </p>
          )}
        </div>

        {showHint && (
          <div className="mt-4 bg-accent/20 rounded-xl p-4 border-2 border-accent">
            <p className="text-sm">
              <span className="font-black">Guideline hint:</span>{" "}
              <span className="text-muted-foreground">{current.guidelineHint}</span>
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            className="btn-detective rounded-full bg-gradient-to-r from-success to-secondary text-success-foreground"
            disabled={!!chosen}
            onClick={() => choose("Real")}
          >
            <CheckCircle2 className="mr-2" /> Label Real
          </Button>
          <Button
            className="btn-detective rounded-full bg-gradient-to-r from-destructive to-orange"
            disabled={!!chosen}
            onClick={() => choose("Fake")}
          >
            <XCircle className="mr-2" /> Label Fake
          </Button>
          <Button variant="outline" className="rounded-full" onClick={() => setShowHint((v) => !v)}>
            {showHint ? "Hide hints" : "Show hints"}
          </Button>
        </div>

        {chosen && (
          <div
            className={`mt-5 rounded-xl p-4 border-2 ${
              chosen === current.gold ? "bg-success/10 border-success/50" : "bg-destructive/10 border-destructive/50"
            }`}
          >
            <p className="font-black">
              {chosen === current.gold ? "Match!" : "Different label!"} Example label:{" "}
              <span className={current.gold === "Real" ? "text-success" : "text-destructive"}>{current.gold}</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{current.explanation}</p>
            <Separator className="my-3" />
            <p className="text-xs text-muted-foreground">
              Why it matters: if many items like this are mislabeled, the model learns the wrong pattern and makes more
              mistakes later.
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-between">
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full" onClick={goPrev} disabled={index === 0}>
              Back
            </Button>
            <Button variant="secondary" className="rounded-full" onClick={goNext} disabled={index === ITEMS.length - 1}>
              Next
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full" onClick={reset}>
              <RefreshCw size={16} className="mr-2" />
              Reset
            </Button>
            <Button className="btn-detective rounded-full bg-gradient-to-r from-primary to-secondary" disabled={!finished} onClick={save}>
              Save score ({score}/{ITEMS.length})
            </Button>
          </div>
        </div>

        {finished && (
          <p className="mt-3 text-xs text-muted-foreground">
            Dataset check: you matched {score}/{ITEMS.length}. In real projects, teams measure label agreement and revise guidelines.
          </p>
        )}
      </div>
    </ModuleShell>
  );
}


