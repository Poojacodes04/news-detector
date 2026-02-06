import { useState } from "react";
import {
  Brain,
  Search,
  Dice6,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface TrainingRoomProps {
  onComplete: () => void;
}

const cards = [
  {
    id: 1,
    title: "AI Has No Brain!",
    emoji: "🧠❌",
    icon: Brain,
    color: "from-destructive/20 to-orange/20",
    borderColor: "border-orange",
    content: (
      <div className="space-y-4">
        <div className="flex justify-center gap-8 my-6">
          {/* Human Brain */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-4xl mb-2 animate-pulse-scale">
              🧠
            </div>
            <p className="text-sm font-bold text-foreground">Human Brain</p>
            <p className="text-xs text-success">Understands ✓</p>
          </div>

          <div className="flex items-center text-3xl">≠</div>

          {/* AI "Brain" */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-4xl mb-2 animate-wiggle">
              🤖
            </div>
            <p className="text-sm font-bold text-foreground">AI</p>
            <p className="text-xs text-destructive">No Understanding ✗</p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-4 border border-border">
          <p className="text-lg text-center">
            AI doesn't actually{" "}
            <span className="text-accent font-bold">read</span> or{" "}
            <span className="text-accent font-bold">understand</span> words like
            you do!
          </p>
          <p className="text-sm text-muted-foreground text-center mt-2">
            It just spots patterns in letters and words 🔤
          </p>
        </div>

        {/* Animated word bubbles */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {["SHOCKING", "BREAKING", "SCIENTISTS", "STUDY", "EXPERTS"].map(
            (word, i) => (
              <span
                key={word}
                className="px-3 py-1 rounded-full bg-primary/30 text-sm font-bold animate-float"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {word}
              </span>
            ),
          )}
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "AI is a Pattern Detective",
    emoji: "🔍",
    icon: Search,
    color: "from-secondary/20 to-primary/20",
    borderColor: "border-secondary",
    content: (
      <div className="space-y-4">
        <p className="text-lg text-center mb-4">
          AI looks for <span className="text-accent font-bold">patterns</span>{" "}
          in words that often appear in fake vs real news!
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* Fake patterns */}
          <div className="bg-destructive/10 rounded-xl p-4 border-2 border-destructive/50">
            <h4 className="font-bold text-destructive text-center mb-3">
              🚨 Fake News Words
            </h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "SHOCKING!",
                "YOU WON'T BELIEVE",
                "SECRET",
                "THEY DON'T WANT YOU TO KNOW",
              ].map((word, i) => (
                <span
                  key={word}
                  className="px-2 py-1 rounded bg-destructive/30 text-xs font-bold animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          {/* Real patterns */}
          <div className="bg-success/10 rounded-xl p-4 border-2 border-success/50">
            <h4 className="font-bold text-success text-center mb-3">
              ✓ Real News Words
            </h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "According to",
                "Research shows",
                "Study finds",
                "Experts say",
              ].map((word, i) => (
                <span
                  key={word}
                  className="px-2 py-1 rounded bg-success/30 text-xs font-bold animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-4 border border-accent mt-4">
          <Lightbulb className="inline-block text-accent mr-2" size={20} />
          <span className="text-sm">
            The AI learned these patterns from reading{" "}
            <span className="text-accent font-bold">millions</span> of
            headlines!
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "AI Makes Guesses",
    emoji: "🎲",
    icon: Dice6,
    color: "from-lime/20 to-accent/20",
    borderColor: "border-lime",
    content: (
      <div className="space-y-4">
        <p className="text-lg text-center mb-4">
          AI doesn't <span className="text-accent font-bold">know</span> if news
          is fake — it makes an{" "}
          <span className="text-lime font-bold">educated guess!</span>
        </p>

        {/* Probability visualization */}
        <div className="bg-muted/50 rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl">🤔</span>
            <div className="flex-1">
              <p className="text-sm mb-2">AI's Certainty Meter:</p>
              <div className="relative">
                <Progress value={81} className="h-6" />
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-primary-foreground">
                  81% Sure
                </span>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Even at 81%, the AI could still be{" "}
              <span className="text-destructive font-bold">wrong!</span>
            </p>
          </div>
        </div>

        {/* Fun dice animation */}
        <div className="flex justify-center gap-4 my-4">
          {["🎲", "🎯", "📊", "🔮"].map((emoji, i) => (
            <span
              key={i}
              className="text-4xl animate-float"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              {emoji}
            </span>
          ))}
        </div>

        <div className="bg-accent/20 rounded-xl p-4 border-2 border-accent">
          <p className="text-center  ">
            <Sparkles className="inline-block mr-2" size={20} />
            It's like a super-fast guessing game based on what AI has seen
            before!
            <Sparkles className="inline-block ml-2" size={20} />
          </p>
        </div>
      </div>
    ),
  },
];

const TrainingRoom = ({ onComplete }: TrainingRoomProps) => {
  const [currentCard, setCurrentCard] = useState(0);

  const nextCard = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard((prev) => prev - 1);
    }
  };

  const card = cards[currentCard];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-2">
        <span className="text-gradient">Training Room</span>
      </h2>
      <p className="text-xl text-muted-foreground text-center mb-8">
        🎓 How Does AI Solve Cases?
      </p>

      {/* Progress indicator */}
      <div className="flex gap-2 mb-6">
        {cards.map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              i === currentCard
                ? "bg-accent scale-125"
                : i < currentCard
                  ? "bg-success"
                  : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Card */}
      <div
        className={`w-full max-w-2xl card-case-file bg-gradient-to-br ${card.color} p-6 md:p-8 border-2 ${card.borderColor} animate-bounce-in`}
        key={card.id}
      >
        {/* Card header */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <card.icon size={36} className="text-accent" />
          <h3 className="text-2xl md:text-3xl font-bold">{card.title}</h3>
          <span className="text-3xl">{card.emoji}</span>
        </div>

        {/* Card content */}
        {card.content}
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        <Button
          onClick={prevCard}
          variant="outline"
          size="lg"
          className="rounded-full px-6"
          disabled={currentCard === 0}
        >
          <ChevronLeft size={24} />
          Back
        </Button>

        <Button
          onClick={nextCard}
          size="lg"
          className="btn-detective rounded-full px-8 bg-gradient-to-r from-primary to-secondary"
        >
          {currentCard === cards.length - 1 ? (
            <>
              Start Investigating!
              <Search className="ml-2" size={24} />
            </>
          ) : (
            <>
              Next
              <ChevronRight size={24} />
            </>
          )}
        </Button>
      </div>
    </section>
  );
};

export default TrainingRoom;
