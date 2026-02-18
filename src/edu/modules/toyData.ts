export type TruthLabel = "Fake" | "Real";

export type ScoredExample = {
  id: string;
  headline: string;
  truth: TruthLabel;
  scoreFake: number; // 0..1 (model's probability/confidence of "Fake")
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// Deterministic pseudo-random based on seed string (for stable examples).
function hashTo01(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 2 ** 32;
}

export function makeToyScoredExamples(): ScoredExample[] {
  const raw: Array<{ headline: string; truth: TruthLabel; baseFake: number }> = [
    { headline: "City council approves funding for new crosswalks", truth: "Real", baseFake: 0.15 },
    { headline: "SHOCKING: New rule bans all homework forever!!!", truth: "Fake", baseFake: 0.88 },
    { headline: "Study finds short naps may improve focus for some students", truth: "Real", baseFake: 0.25 },
    { headline: "You won't believe what this simple trick does to your brain!", truth: "Fake", baseFake: 0.78 },
    { headline: "Local team wins match after close final score", truth: "Real", baseFake: 0.22 },
    { headline: "Secret report proves everything is a lie", truth: "Fake", baseFake: 0.83 },
    { headline: "Museum announces free entry day for families", truth: "Real", baseFake: 0.18 },
    { headline: "Experts say a balanced breakfast can help energy levels", truth: "Real", baseFake: 0.35 },
    { headline: "BREAKING: This fruit cures any illness in 24 hours", truth: "Fake", baseFake: 0.9 },
    { headline: "School board discusses updated safety drills", truth: "Real", baseFake: 0.28 },
    { headline: "They don't want you to know this one weird secret", truth: "Fake", baseFake: 0.8 },
    { headline: "Weather service issues advisory for strong winds", truth: "Real", baseFake: 0.2 },
    { headline: "Scientists confirm unbelievable discovery under your bed", truth: "Fake", baseFake: 0.76 },
    { headline: "Community volunteers organize park cleanup event", truth: "Real", baseFake: 0.16 },
    { headline: "New video reveals the shocking truth the media hides", truth: "Fake", baseFake: 0.82 },
    { headline: "Researchers publish results with limitations and next steps", truth: "Real", baseFake: 0.24 },
    { headline: "Local clinic offers free checkups this weekend", truth: "Real", baseFake: 0.3 },
    { headline: "Amazing hack makes you instantly smarter with zero effort", truth: "Fake", baseFake: 0.86 },
    { headline: "Library adds new books based on student suggestions", truth: "Real", baseFake: 0.14 },
    { headline: "Exclusive: secret method guarantees perfect grades", truth: "Fake", baseFake: 0.79 },
    { headline: "Transit agency reports delays due to maintenance", truth: "Real", baseFake: 0.19 },
    { headline: "Warning: this common item is more dangerous than you think!", truth: "Fake", baseFake: 0.74 },
    { headline: "Town shares update on recycling schedule changes", truth: "Real", baseFake: 0.17 },
    { headline: "Unbelievable proof that science is wrong forever", truth: "Fake", baseFake: 0.84 },
  ];

  return raw.map((r, idx) => {
    const jitter = (hashTo01(`${idx}:${r.headline}`) - 0.5) * 0.18; // +/- 0.09
    return {
      id: String(idx + 1),
      headline: r.headline,
      truth: r.truth,
      scoreFake: clamp(r.baseFake + jitter, 0.01, 0.99),
    };
  });
}

export function confusionFromThreshold(examples: ScoredExample[], threshold: number) {
  let tp = 0, fp = 0, tn = 0, fn = 0;
  for (const ex of examples) {
    const pred: TruthLabel = ex.scoreFake >= threshold ? "Fake" : "Real";
    if (ex.truth === "Fake" && pred === "Fake") tp++;
    if (ex.truth === "Real" && pred === "Fake") fp++;
    if (ex.truth === "Real" && pred === "Real") tn++;
    if (ex.truth === "Fake" && pred === "Real") fn++;
  }
  return { tp, fp, tn, fn };
}

export function metricsFromCounts({ tp, fp, tn, fn }: { tp: number; fp: number; tn: number; fn: number }) {
  const total = tp + fp + tn + fn;
  const accuracy = total ? (tp + tn) / total : 0;
  const precision = tp + fp ? tp / (tp + fp) : 0;
  const recall = tp + fn ? tp / (tp + fn) : 0;
  const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0;
  return { accuracy, precision, recall, f1 };
}


