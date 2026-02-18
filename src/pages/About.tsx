import SiteLayout from "@/components/SiteLayout";
import { Badge } from "@/components/ui/badge";

export default function About() {
  return (
    <SiteLayout title="About" subtitle="A hands-on app for teaching how AI models are trained.">
      <div className="card-case-file p-6 text-left space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-secondary text-secondary-foreground">Education-first</Badge>
          <Badge variant="outline" className="border-border/60">
            Safe, student-friendly content
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          AI Detective Academy is a learning playground. Students try activities that mirror real ML steps: collecting
          data, labeling, training, testing, and deciding what to improve next.
        </p>

        <div className="bg-muted/30 rounded-xl p-4 border border-border">
          <p className="font-bold mb-2">What this app teaches</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>AI learns from examples, not understanding.</li>
            <li>Labels and datasets shape model behavior (including bias).</li>
            <li>Metrics reveal different kinds of mistakes.</li>
            <li>Models can overfit and fail on new data.</li>
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">
          Tip for educators: use Teacher Mode to see results on a shared device and export scores as CSV.
        </p>
      </div>
    </SiteLayout>
  );
}


