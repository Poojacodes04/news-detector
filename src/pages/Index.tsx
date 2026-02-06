import { useState, useRef } from "react";
import FloatingElements from "@/components/FloatingElements";
import WelcomeSplash from "@/components/WelcomeSplash";
import TrainingRoom from "@/components/TrainingRoom";
import InvestigationLab from "@/components/InvestigationLab";
import ResultsArea from "@/components/ResultsArea";

type Stage = "welcome" | "training" | "investigate" | "results";

interface PredictionResult {
  label: "Fake" | "Real";
  confidence: number;
}

const Index = () => {
  const [stage, setStage] = useState<Stage>("welcome");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentHeadline, setCurrentHeadline] = useState("");
  const [result, setResult] = useState<PredictionResult | null>(null);

  const trainingRef = useRef<HTMLDivElement>(null);
  const investigateRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStart = () => {
    setStage("training");
    setTimeout(() => scrollToRef(trainingRef), 100);
  };

  const handleTrainingComplete = () => {
    setStage("investigate");
    setTimeout(() => scrollToRef(investigateRef), 100);
  };

  const handleInvestigate = async (headline: string) => {
    setCurrentHeadline(headline);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ headline }),
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction from the AI");
      }

      const data = await response.json();
      setResult({
        label: data.label,
        confidence: data.confidence,
      });
      setStage("results");
      setTimeout(() => scrollToRef(resultsRef), 100);
    } catch (err) {
      setError(
        "Oops! Couldn't connect to the AI Detective. Make sure the prediction server is running at http://127.0.0.1:5000 🔧"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setResult(null);
    setCurrentHeadline("");
    setStage("investigate");
    setTimeout(() => scrollToRef(investigateRef), 100);
  };

  return (
    <div className="min-h-screen bg-detective relative overflow-x-hidden">
      <FloatingElements />

      <main className="relative z-10">
        {/* Welcome Section - Always visible initially */}
        <WelcomeSplash onStart={handleStart} />

        {/* Training Room */}
        {(stage === "training" || stage === "investigate" || stage === "results") && (
          <div ref={trainingRef}>
            <TrainingRoom onComplete={handleTrainingComplete} />
          </div>
        )}

        {/* Investigation Lab */}
        {(stage === "investigate" || stage === "results") && (
          <div ref={investigateRef}>
            <InvestigationLab
              onInvestigate={handleInvestigate}
              isLoading={isLoading}
              error={error}
            />
          </div>
        )}

        {/* Results Area */}
        {stage === "results" && result && (
          <div ref={resultsRef}>
            <ResultsArea
              headline={currentHeadline}
              label={result.label}
              confidence={result.confidence}
              onTryAgain={handleTryAgain}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-muted-foreground text-sm">
        <p>🤖🔍 AI Detective Academy — Teaching kids how AI thinks!</p>
        <p className="mt-2 text-xs">
          Remember: AI is a tool, not a truth machine! Always think critically. 🧠✨
        </p>
      </footer>
    </div>
  );
};

export default Index;
