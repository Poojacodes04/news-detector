import SiteLayout from "@/components/SiteLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function HowAIWorks() {
  return (
    <SiteLayout title="How AI Works" subtitle="A friendly walkthrough of what your model does (and what it doesn’t).">
      <div className="card-case-file p-6 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-secondary text-secondary-foreground">Student-friendly</Badge>
          <Badge variant="outline" className="border-border/60">
            No math required
          </Badge>
        </div>

        <p className="mt-4 text-muted-foreground">
          In this app, the AI is like a super-fast pattern detective. It doesn’t “understand” news like a person — it
          learns from examples.
        </p>

        <Accordion type="single" collapsible defaultValue="data" className="mt-6">
          <AccordionItem value="data">
            <AccordionTrigger>1) Data: examples the AI can learn from</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                Models learn from <span className="text-accent font-bold">training data</span>. In this project, the
                dataset contains headlines labeled as “Fake” or “Real”. If the labels are messy, the model learns messy
                rules.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="features">
            <AccordionTrigger>2) Features: turning words into numbers</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                Computers work with numbers. A common trick is to count words (or word patterns) and build a “number
                fingerprint” for each headline. This app’s model uses a standard technique called TF‑IDF.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="training">
            <AccordionTrigger>3) Training: learning patterns from the data</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                Training means adjusting the model so it’s better at matching inputs to the correct labels. It’s like
                practicing with flashcards: the model guesses, checks, and improves.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="evaluation">
            <AccordionTrigger>4) Evaluation: measuring mistakes (confusion matrix)</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                “Accuracy” is one score, but it can hide important details. A confusion matrix shows how many examples
                were true positives, false positives, true negatives, and false negatives.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="deployment">
            <AccordionTrigger>5) Deployment: using the model on new headlines</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                Once trained, the model makes predictions on new text it has never seen. Predictions can be wrong — that
                is why we test, monitor, and improve the model over time.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </SiteLayout>
  );
}


