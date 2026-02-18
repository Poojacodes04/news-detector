import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { ModuleMeta } from "@/edu/types";
import { useEdu } from "@/edu/EduContext";
import { ArrowLeft, GraduationCap, Trophy } from "lucide-react";
import { NavLink } from "@/components/NavLink";

export default function ModuleShell({
  meta,
  children,
  instructions,
}: {
  meta: ModuleMeta;
  instructions: React.ReactNode;
  children: React.ReactNode;
}) {
  const { activeStudent } = useEdu();
  const mp = activeStudent.moduleProgress[meta.id];
  const percent = Math.round((mp.bestPoints / meta.maxPoints) * 100);

  return (
    <SiteLayout title={meta.title} subtitle={meta.shortDescription}>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Button asChild variant="outline" className="rounded-full w-fit">
          <NavLink to="/learn">
            <ArrowLeft size={18} className="mr-2" />
            Back to modules
          </NavLink>
        </Button>

        <div className="flex flex-wrap items-center gap-2 justify-center md:justify-end">
          <Badge variant="outline" className="border-border/60">
            <GraduationCap size={14} className="mr-1" /> {meta.difficulty}
          </Badge>
          <Badge className="bg-secondary text-secondary-foreground">
            <Trophy size={14} className="mr-1" /> Best: {mp.bestPoints}/{meta.maxPoints}
          </Badge>
          {mp.completed && <Badge className="bg-success text-success-foreground">Completed</Badge>}
        </div>
      </div>

      <div className="card-case-file p-6 text-left">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-bold">Your best score</p>
          <p className="text-xs text-muted-foreground">{percent}%</p>
        </div>
        <Progress value={percent} className="mt-2 h-3" />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card-case-file p-6 text-left">
            <h2 className="text-xl font-black mb-2">Instructions</h2>
            <Accordion type="single" collapsible defaultValue="instructions">
              <AccordionItem value="instructions">
                <AccordionTrigger>What to do</AccordionTrigger>
                <AccordionContent>{instructions}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="teacher">
                <AccordionTrigger>Teacher notes (optional)</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">{meta.teacherNotes}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="lg:col-span-2">{children}</div>
      </div>
    </SiteLayout>
  );
}


