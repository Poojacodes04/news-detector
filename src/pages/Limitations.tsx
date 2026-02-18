import SiteLayout from "@/components/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export default function Limitations() {
  return (
    <SiteLayout title="Model Limitations" subtitle="What this AI can’t do (and how to use it responsibly).">
      <div className="card-case-file p-6 text-left space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-destructive text-destructive-foreground">
            <AlertTriangle size={14} className="mr-1" /> Important
          </Badge>
          <Badge variant="outline" className="border-border/60">
            Critical thinking required
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          This project is designed for learning. It shows how a simple text model can spot patterns, but it also shows
          why pattern-matching is not the same as knowing the truth.
        </p>

        <div className="bg-muted/30 rounded-xl p-4 border border-border space-y-2">
          <p className="font-bold">Key limitations</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>
              <span className="text-accent font-bold">No fact-checking</span>: it doesn’t look up sources or verify claims.
            </li>
            <li>
              <span className="text-accent font-bold">Sensitive to wording</span>: changing a few words can change the prediction.
            </li>
            <li>
              <span className="text-accent font-bold">Depends on the dataset</span>: it can be biased if the training data is biased.
            </li>
            <li>
              <span className="text-accent font-bold">Can be confidently wrong</span>: a high confidence score is not a guarantee.
            </li>
          </ul>
        </div>

        <div className="bg-success/10 rounded-xl p-4 border-2 border-success/40">
          <p className="font-bold">How to use predictions safely</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-2">
            <li>Use AI predictions as a clue, not a final answer.</li>
            <li>Check reliable sources and compare multiple reports.</li>
            <li>Ask: What evidence would confirm or disprove this claim?</li>
          </ul>
        </div>
      </div>
    </SiteLayout>
  );
}


