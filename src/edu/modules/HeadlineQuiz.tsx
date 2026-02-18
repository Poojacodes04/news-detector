import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ModuleShell from "@/edu/components/ModuleShell";
import { getModuleMeta } from "@/edu/modules/registry";
import { useEdu } from "@/edu/EduContext";
import type { ModuleId } from "@/edu/types";
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";

type QuizItem = {
  headline: string;
  label: "Fake" | "Real";
  explanation: string;
};

const ITEMS: QuizItem[] = [
  {
    headline: "City opens new playground after students help design it",
    label: "Real",
    explanation: "It’s specific, plausible, and doesn’t use urgent or extreme language. Real news often includes concrete details.",
  },
  {
    headline: "SHOCKING: One simple trick makes homework disappear forever!!!",
    label: "Fake",
    explanation: "Over-the-top promises and lots of punctuation are common in misleading clickbait.",
  },
  {
    headline: "Researchers report early results from a study on sleep and learning",
    label: "Real",
    explanation: "Careful wording like “report” and “early results” sounds more like responsible reporting than certainty.",
  },
  {
    headline: "You WON'T BELIEVE what scientists found under your kitchen sink!",
    label: "Fake",
    explanation: "The headline tries to create curiosity and fear but gives no concrete information or source.",
  },
  {
    headline: "Local library adds weekend hours after community survey",
    label: "Real",
    explanation: "Mentions a reason (survey) and a realistic change. It doesn’t demand you react immediately.",
  },
  {
    headline: "Secret government file proves everything you learned is wrong",
    label: "Fake",
    explanation: "Vague claims (“everything”) and secret-proof framing are common patterns in misinformation.",
  },
  {
    headline: "School robotics team wins regional competition",
    label: "Real",
    explanation: "Specific event + outcome is typical of straightforward reporting.",
  },
  {
    headline: "Doctors HATE this new fruit — it cures anything in 24 hours!",
    label: "Fake",
    explanation: "“Cures anything” is an unrealistic medical claim. Extreme certainty is a red flag.",
  },
  {
    headline: "Weather service issues advisory for heavy rain this afternoon",
    label: "Real",
    explanation: "This sounds like a normal alert from a named institution, with a limited, realistic claim.",
  },
  {
    headline: "BREAKING: Teachers discover magical method to make tests easy",
    label: "Fake",
    explanation: "“Magical method” + “breaking” without details is a classic clickbait pattern.",
  },
];

const MODULE_ID: ModuleId = "headline-quiz";

export default function HeadlineQuiz() {
  const meta = getModuleMeta(MODULE_ID)!;
  const { recordModuleAttempt } = useEdu();

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<"Fake" | "Real" | null>>(() => Array(ITEMS.length).fill(null));
  const [showExplanation, setShowExplanation] = useState(false);

  const current = ITEMS[index];
  const chosen = answers[index];

  const correctCount = useMemo(() => {
    return answers.reduce((sum, a, i) => sum + (a && a === ITEMS[i].label ? 1 : 0), 0);
  }, [answers]);

  const answeredCount = useMemo(() => answers.filter(Boolean).length, [answers]);
  const progress = Math.round((answeredCount / ITEMS.length) * 100);
  const finished = answeredCount === ITEMS.length;

  const score = correctCount;
  const maxPoints = meta.maxPoints;

  const handleAnswer = (a: "Fake" | "Real") => {
    if (chosen) return;
    const next = [...answers];
    next[index] = a;
    setAnswers(next);
    setShowExplanation(true);
  };

  const goNext = () => {
    setShowExplanation(false);
    setIndex((i) => Math.min(ITEMS.length - 1, i + 1));
  };

  const goPrev = () => {
    setShowExplanation(false);
    setIndex((i) => Math.max(0, i - 1));
  };

  const submitIfFinished = () => {
    if (!finished) return;
    recordModuleAttempt({
      moduleId: MODULE_ID,
      scoredPoints: score,
      maxPoints,
      completed: true,
    });
  };

  const reset = () => {
    setIndex(0);
    setAnswers(Array(ITEMS.length).fill(null));
    setShowExplanation(false);
  };

  return (
    <ModuleShell
      meta={meta}
      instructions={
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Read each headline and choose <span className="text-success font-bold">Real</span> or{" "}
            <span className="text-destructive font-bold">Fake</span>.
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Don’t overthink: this is about <span className="text-accent font-bold">patterns</span>, not proof.</li>
            <li>After you answer, you’ll see an explanation.</li>
            <li>Finish all items to save your score.</li>
          </ul>
        </div>
      }
    >
      <div className="card-case-file p-6 text-left">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-border/60">
              Question {index + 1}/{ITEMS.length}
            </Badge>
            <Badge className="bg-secondary text-secondary-foreground">
              Score: {correctCount}/{ITEMS.length}
            </Badge>
          </div>
          <div className="min-w-[220px]">
            <Progress value={progress} className="h-3" />
            <p className="mt-1 text-xs text-muted-foreground">{progress}% complete</p>
          </div>
        </div>

        <div className="mt-5 bg-muted/30 rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground">Headline</p>
          <p className="mt-1 text-lg font-bold italic">“{current.headline}”</p>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            className="btn-detective rounded-xl bg-gradient-to-r from-success to-secondary text-success-foreground"
            disabled={!!chosen}
            onClick={() => handleAnswer("Real")}
          >
            <CheckCircle2 className="mr-2" /> Real
          </Button>
          <Button
            className="btn-detective rounded-xl bg-gradient-to-r from-destructive to-orange"
            disabled={!!chosen}
            onClick={() => handleAnswer("Fake")}
          >
            <XCircle className="mr-2" /> Fake
          </Button>
        </div>

        {chosen && (
          <div
            className={`mt-5 rounded-xl p-4 border-2 ${
              chosen === current.label ? "bg-success/10 border-success/50" : "bg-destructive/10 border-destructive/50"
            }`}
          >
            <p className="font-black">
              {chosen === current.label ? "Nice call!" : "Good try!"} The label was{" "}
              <span className={current.label === "Real" ? "text-success" : "text-destructive"}>{current.label}</span>.
            </p>
            {showExplanation && <p className="mt-2 text-sm text-muted-foreground">{current.explanation}</p>}
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-between">
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full" onClick={goPrev} disabled={index === 0}>
              Back
            </Button>
            <Button
              variant="secondary"
              className="rounded-full"
              onClick={goNext}
              disabled={index === ITEMS.length - 1}
            >
              Next
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full" onClick={reset}>
              <RefreshCw size={16} className="mr-2" />
              Reset
            </Button>
            <Button
              className="btn-detective rounded-full bg-gradient-to-r from-primary to-secondary"
              disabled={!finished}
              onClick={submitIfFinished}
            >
              Save score
            </Button>
          </div>
        </div>

        {finished && (
          <p className="mt-3 text-xs text-muted-foreground">
            Tip: A “fake-looking” headline can still describe a true event. This quiz trains your pattern-spotting, not
            fact-checking.
          </p>
        )}
      </div>
    </ModuleShell>
  );
}


