import SiteLayout from "@/components/SiteLayout";
import { Badge } from "@/components/ui/badge";

export default function Dataset() {
  return (
    <SiteLayout title="Dataset" subtitle="What the model was trained on (and why that matters).">
      <div className="card-case-file p-6 text-left space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-secondary text-secondary-foreground">Hands-on</Badge>
          <Badge variant="outline" className="border-border/60">
            Connects to the labeling module
          </Badge>
        </div>

        <p className="text-muted-foreground">
          The training file lives in <code className="px-1 py-0.5 rounded bg-muted">model/news_data.csv</code>.
        </p>

        <div className="bg-muted/30 rounded-xl p-4 border border-border">
          <p className="text-sm font-bold mb-2">Columns (simple version)</p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>
              <span className="text-accent font-bold">headline</span>: the text the model reads
            </li>
            <li>
              <span className="text-accent font-bold">label</span>: the answer (1 = Fake, 0 = Real in the training code)
            </li>
          </ul>
        </div>

        <p className="text-sm text-muted-foreground">
          Important idea: the model can only learn patterns that exist in the dataset. If the dataset is tiny, uneven, or
          mislabeled, the model may “learn” the wrong rules.
        </p>

        <div className="bg-accent/20 rounded-xl p-4 border-2 border-accent">
          <p className="text-sm">
            Try it: open the Data Labeling Simulator module and notice which headlines feel ambiguous. Real datasets
            often have disagreements — that’s normal, and it’s something we design around.
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}


