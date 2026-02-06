import { Search, Sparkles, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeSplashProps {
  onStart: () => void;
}

const WelcomeSplash = ({ onStart }: WelcomeSplashProps) => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      {/* Mascot Robot Detective */}
      <div className="relative mb-8 animate-bounce-in">
        <div className="w-40 h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center relative animate-glow">
          {/* Robot Face */}
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-card flex flex-col items-center justify-center relative">
            {/* Eyes */}
            <div className="flex gap-6 mb-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary flex items-center justify-center animate-pulse-scale">
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-background"></div>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary flex items-center justify-center animate-pulse-scale" style={{ animationDelay: "0.2s" }}>
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-background"></div>
              </div>
            </div>
            {/* Mouth */}
            <div className="w-12 h-6 md:w-16 md:h-8 rounded-b-full border-4 border-accent border-t-0"></div>
            {/* Antenna */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className="w-2 h-8 bg-muted rounded-full"></div>
              <div className="w-4 h-4 rounded-full bg-accent absolute -top-2 left-1/2 -translate-x-1/2 animate-pulse-scale"></div>
            </div>
          </div>
          {/* Magnifying Glass */}
          <div className="absolute -right-4 -bottom-2 animate-magnify">
            <Search size={48} className="text-accent drop-shadow-lg" strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-4 animate-slide-up">
        <span className="text-gradient">AI Detective</span>{" "}
        <span className="text-accent">Academy</span>
      </h1>

      {/* Tagline */}
      <p className="text-xl md:text-2xl text-muted-foreground text-center mb-8 max-w-2xl animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <Sparkles className="inline-block text-accent mr-2" size={24} />
        Learn to think like an AI... then outsmart it!
        <Sparkles className="inline-block text-accent ml-2" size={24} />
      </p>

      {/* Start Button */}
      <Button
        onClick={onStart}
        size="lg"
        className="btn-detective text-xl md:text-2xl px-10 py-8 rounded-full bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] hover:bg-right transition-all duration-500 animate-slide-up glow-primary"
        style={{ animationDelay: "0.4s" }}
      >
        <Search className="mr-3" size={28} />
        Start Your Training
      </Button>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 animate-float">
        <ArrowDown size={32} className="text-muted-foreground" />
      </div>
    </section>
  );
};

export default WelcomeSplash;
