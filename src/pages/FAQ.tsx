import SiteLayout from "@/components/SiteLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <SiteLayout title="FAQ" subtitle="Quick answers for students and teachers.">
      <div className="card-case-file p-6 text-left">
        <Accordion type="single" collapsible defaultValue="q1">
          <AccordionItem value="q1">
            <AccordionTrigger>Does the AI know what is true?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                No. This model learns patterns from training examples. It does not check sources or verify facts. Treat
                it like a clue, not a final answer.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q2">
            <AccordionTrigger>Why does changing a few words change the result?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                Because the model is sensitive to the words it sees. If certain words were common in “Fake” training
                examples, the model may learn to associate those words with “Fake.”
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q3">
            <AccordionTrigger>What does “confidence” mean?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                It’s the model’s internal certainty based on patterns — not a promise. A high confidence score can still
                be wrong.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q4">
            <AccordionTrigger>Is progress saved online?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                No. Scores are stored in your browser on this device (localStorage). Teacher Mode can export the results
                as a CSV file.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q5">
            <AccordionTrigger>Can we customize the activities?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">
                Yes. Most activities use small, editable datasets inside the code. Look for the module files under{" "}
                <code className="px-1 py-0.5 rounded bg-muted">src/edu/modules</code>.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </SiteLayout>
  );
}


