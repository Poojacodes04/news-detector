import { useState } from "react";
import { Search, Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface InvestigationLabProps {
  onInvestigate: (headline: string) => void;
  isLoading: boolean;
  error: string | null;
}

const sampleHeadlines = [
  "Scientists discover new species of deep-sea fish near ocean vents",
  "SHOCKING: This one weird trick will make you a millionaire overnight!!!",
  "Local school receives grant for new computer lab equipment",
  "You won't BELIEVE what this celebrity did! Doctors HATE him!",
];

const InvestigationLab = ({
  onInvestigate,
  isLoading,
  error,
}: InvestigationLabProps) => {
  const [headline, setHeadline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headline.trim()) {
      onInvestigate(headline.trim());
    }
  };

  const handleSampleClick = (sample: string) => {
    setHeadline(sample);
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-2">
        <span className="text-gradient">Investigation Lab</span>
      </h2>
      <p className="text-xl text-muted-foreground text-center mb-8">
        🔬 Test Your Headlines!
      </p>

      {/* Detective desk styled card */}
      <div className="w-full max-w-3xl card-case-file p-6 md:p-8 relative">
        {/* Tape decoration */}
        <div className="absolute -top-3 left-8 tape px-4 py-1 rounded-sm text-xs font-bold text-accent-foreground">
          CASE FILE #001
        </div>
        <div className="absolute -top-3 right-8 tape px-4 py-1 rounded-sm text-xs font-bold text-accent-foreground transform rotate-3">
          TOP SECRET
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Notepad styled input */}
          <div className="relative">
            <div className=" rounded-xl p-1">
              <Textarea
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Type or paste a news headline here..."
                className="min-h-[120px] text-lg !bg-transparent border-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isLoading}
              />
            </div>
            <Search
              className="absolute top-4 right-4 text-muted-foreground/30"
              size={32}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            size="lg"
            className="w-full btn-detective text-xl py-8 rounded-xl bg-gradient-to-r from-accent via-orange to-accent bg-[length:200%_100%] hover:bg-right transition-all duration-500 text-accent-foreground font-bold"
            disabled={!headline.trim() || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8">
                  <Search className="animate-magnify" size={32} />
                </div>
                <span>Investigating...</span>
              </div>
            ) : (
              <>
                <Search className="mr-2" size={28} />
                Investigate!
                <Send className="ml-2" size={24} />
              </>
            )}
          </Button>
        </form>

        {/* Sample headlines */}
        <div className="mt-8">
          <p className="text-sm text-muted-foreground mb-3 text-center">
            💡 Try these sample headlines:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sampleHeadlines.map((sample, i) => (
              <button
                key={i}
                onClick={() => handleSampleClick(sample)}
                className="text-left p-3 rounded-lg bg-muted/50 hover:bg-muted border border-border hover:border-accent transition-all text-sm line-clamp-2"
                disabled={isLoading}
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading animation overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Search className="w-32 h-32 text-accent animate-magnify" />
              <div className="absolute inset-0 border-4 border-accent/30 rounded-full animate-ping" />
            </div>
            <p className="text-2xl font-bold text-gradient animate-pulse">
              Analyzing patterns...
            </p>
            <p className="text-muted-foreground mt-2">
              The AI is scanning for clues! 🔍
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default InvestigationLab;
