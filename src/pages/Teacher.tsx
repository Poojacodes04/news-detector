import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MODULES } from "@/edu/modules/registry";
import { useEdu } from "@/edu/EduContext";
import { downloadTextFile, toCsv } from "@/lib/csv";
import { FileDown } from "lucide-react";

export default function Teacher() {
  const { store } = useEdu();

  const students = Object.values(store.students).sort((a, b) => b.totalPoints - a.totalPoints);

  const exportCsv = () => {
    const rows = students.map((s) => {
      const completed = Object.values(s.moduleProgress).filter((m) => m.completed).length;
      const base: Record<string, unknown> = {
        studentId: s.profile.id,
        displayName: s.profile.displayName,
        totalPoints: s.totalPoints,
        completedModules: completed,
        badges: s.badges.join(" | "),
        createdAt: s.profile.createdAt,
        lastActiveAt: s.profile.lastActiveAt,
      };
      for (const m of MODULES) {
        base[`best_${m.id}`] = s.moduleProgress[m.id]?.bestPoints ?? 0;
      }
      return base;
    });

    const csv = toCsv(rows);
    downloadTextFile(`ai-detective-class-results.csv`, csv, "text/csv");
  };

  return (
    <SiteLayout title="Teacher Mode" subtitle="View class results on this device and export scores.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-case-file p-6 text-left lg:col-span-1 h-fit">
          <h2 className="text-xl font-black">Classroom summary</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Results are stored locally on this device. For shared classroom computers, have students pick their name in
            the Learning dashboard.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge className="bg-secondary text-secondary-foreground">{students.length} students</Badge>
            <Badge variant="outline" className="border-border/60">
              {MODULES.length} modules
            </Badge>
          </div>

          <Button
            onClick={exportCsv}
            className="mt-5 w-full rounded-full btn-detective bg-gradient-to-r from-accent via-orange to-accent text-accent-foreground"
          >
            <FileDown className="mr-2" size={18} />
            Export scores (CSV)
          </Button>

          <div className="mt-6">
            <h3 className="text-sm font-bold mb-2">Activity explanations</h3>
            <Accordion type="single" collapsible>
              {MODULES.map((m) => (
                <AccordionItem key={m.id} value={m.id}>
                  <AccordionTrigger>{m.title}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">{m.teacherNotes}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="lg:col-span-2 card-case-file p-6 text-left">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black">Student results</h2>
            <Badge variant="outline" className="border-border/60">
              Sorted by points
            </Badge>
          </div>

          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead className="text-right">Completed</TableHead>
                  <TableHead>Badges</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => {
                  const completed = Object.values(s.moduleProgress).filter((m) => m.completed).length;
                  return (
                    <TableRow key={s.profile.id}>
                      <TableCell className="font-bold">{s.profile.displayName}</TableCell>
                      <TableCell className="text-right font-mono">{s.totalPoints}</TableCell>
                      <TableCell className="text-right font-mono">
                        {completed}/{MODULES.length}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {s.badges.length ? s.badges.join(", ") : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Tip: For deeper grading, you can also export and analyze the CSV in a spreadsheet.
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}


