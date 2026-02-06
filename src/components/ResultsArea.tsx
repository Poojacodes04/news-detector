import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ResultsAreaProps {
  headline: string;
  label: "Fake" | "Real";
  confidence: number;
  onTryAgain: () => void;
}

const fakeComments = [
  "🚨 Whoa there, detective! This headline has suspicious patterns!",
  "🔴 The AI spotted some red flags in this one!",
  "⚠️ Hmm... this looks like it might be trying to trick people!",
];

const realComments = [
  "✅ Nice! This headline looks like legitimate news!",
  "🟢 The AI thinks this one is playing by the rules!",
  "📰 This headline follows patterns of reliable reporting!",
];

const tips = [
  "Try adding words like 'SHOCKING' or 'You won't believe' to see how it changes!",
  "What happens if you write a boring, factual headline?",
  "Can you make the AI think a true story is fake?",
  "Try the same headline with and without exclamation marks!!!",
];

const Confetti = () => {
  const colors = [
    "#FFE66D",
    "#FF6B6B",
    "#4ECDC4",
    "#A855F7",
    "#3B82F6",
    "#22C55E",
  ];
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${piece.left}%`,
            top: "-20px",
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
          }}
        />
      ))}
    </div>
  );
};

const ResultsArea = ({
  headline,
  label,
  confidence,
  onTryAgain,
}: ResultsAreaProps) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  const isFake = label === "Fake";
  const confidencePercent = Math.round(confidence * 100);
  const comment = isFake
    ? fakeComments[Math.floor(Math.random() * fakeComments.length)]
    : realComments[Math.floor(Math.random() * realComments.length)];
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  useEffect(() => {
    // Animate confidence bar
    const timer = setTimeout(() => {
      setAnimatedConfidence(confidencePercent);
    }, 500);

    // Hide confetti after animation
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(confettiTimer);
    };
  }, [confidencePercent]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {showConfetti && <Confetti />}

      <h2 className="text-3xl md:text-5xl font-bold text-center mb-2">
        <span className="text-gradient">Case File Results</span>
      </h2>
      <p className="text-xl text-muted-foreground text-center mb-8">
        📋 Investigation Complete!
      </p>

      {/* Results Card */}
      <div className="w-full max-w-2xl card-case-file p-6 md:p-8 relative">
        {/* Tape decorations */}
        <div className="absolute -top-3 left-8 tape px-4 py-1 rounded-sm text-xs font-bold text-accent-foreground">
          VERDICT
        </div>

        {/* Headline being analyzed */}
        <div className="bg-muted/30 rounded-xl p-4 mb-6 border border-border">
          <p className="text-sm text-muted-foreground mb-1">
            Headline Analyzed:
          </p>
          <p className="text-lg font-medium italic">"{headline}"</p>
        </div>

        {/* Big Stamp Result */}
        <div className="flex justify-center mb-6">
          <div
            className={`relative px-12 py-6 border-8 rounded-lg ${
              isFake
                ? "stamp-fake border-destructive animate-stamp"
                : "stamp-real border-success animate-stamp-real"
            }`}
          >
            <div className="flex items-center gap-3">
              {isFake ? (
                <XCircle className="w-12 h-12" />
              ) : (
                <CheckCircle className="w-12 h-12" />
              )}
              <span className="text-4xl md:text-5xl font-black tracking-wider">
                {isFake ? "FAKE" : "REAL"}
              </span>
            </div>
            <p className="text-center text-sm mt-2 font-bold">
              {isFake ? "DETECTED!" : "VERIFIED!"}
            </p>
          </div>
        </div>

        {/* Detective Comment */}
        <div
          className={`rounded-xl p-4 mb-6 border-2 ${
            isFake
              ? "bg-destructive/10 border-destructive/50"
              : "bg-success/10 border-success/50"
          }`}
        >
          <p className="text-lg text-center">{comment}</p>
        </div>

        {/* Certainty Meter */}
        <div className="bg-muted/50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-lg">🎯 AI Certainty Meter:</span>
            <span
              className={`text-2xl font-black ${
                isFake ? "text-destructive" : "text-success"
              }`}
            >
              {animatedConfidence}%
            </span>
          </div>
          <div className="relative">
            <Progress
              value={animatedConfidence}
              className={`h-8 ${isFake ? "[&>div]:bg-destructive" : "[&>div]:bg-success"}`}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center mt-2">
            {confidencePercent >= 80
              ? "The AI is pretty confident about this one!"
              : confidencePercent >= 60
                ? "The AI is somewhat sure, but it could be wrong..."
                : "The AI is making a guess - it's not very certain!"}
          </p>
        </div>

        {/* Important Reminder */}
        <div className="bg-accent/20 rounded-xl p-4 border-2 border-accent">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold ">But remember...</p>
              <p className="text-sm text-muted-foreground">
                AI is just guessing from patterns! It doesn't actually{" "}
                <span className="text-accent font-bold">know</span> if something
                is true or false. Always think critically and check reliable
                sources! 🧠✨
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Try Again Section */}
      <div className="w-full max-w-2xl mt-8 text-center">
        <div className="card-case-file p-6 mb-6">
          <h3 className="text-xl font-bold mb-3 flex items-center justify-center gap-2">
            <Sparkles className="text-accent" size={24} />
            Can you trick the AI?
            <Sparkles className="text-accent" size={24} />
          </h3>
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <Lightbulb className="inline-block text-accent mr-2" size={20} />
            <span className="text-sm text-muted-foreground">{randomTip}</span>
          </div>
        </div>

        <Button
          onClick={onTryAgain}
          size="lg"
          className="btn-detective text-xl px-10 py-7 rounded-full bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] hover:bg-right transition-all duration-500"
        >
          <RefreshCw className="mr-3" size={24} />
          Investigate Another Headline
        </Button>
      </div>
    </section>
  );
};

export default ResultsArea;
