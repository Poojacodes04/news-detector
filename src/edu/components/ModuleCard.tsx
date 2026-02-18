import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ModuleMeta, ModuleProgress } from "@/edu/types";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Star } from "lucide-react";

export function ModuleCard({
  meta,
  progress,
}: {
  meta: ModuleMeta;
  progress: ModuleProgress;
}) {
  const completed = progress.completed;
  const best = progress.bestPoints;
  const attempts = progress.attempts;

  return (
    <div className={cn("card-case-file p-6 text-left transition-all", completed && "border-success/50")}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl md:text-2xl font-black">{meta.title}</h3>
            {completed ? (
              <Badge className="bg-success text-success-foreground">Completed</Badge>
            ) : (
              <Badge variant="secondary">Not yet</Badge>
            )}
            <Badge variant="outline" className="border-border/60">
              {meta.difficulty}
            </Badge>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">{meta.shortDescription}</p>

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock size={14} className="text-accent" /> ~{meta.estimatedMinutes} min
            </span>
            <span className="inline-flex items-center gap-1">
              <Star size={14} className="text-accent" /> {best}/{meta.maxPoints} best
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 size={14} className="text-accent" /> {attempts} attempts
            </span>
          </div>
        </div>

        <Button asChild className="btn-detective rounded-full bg-gradient-to-r from-primary to-secondary shrink-0">
          <NavLink to={`/learn/${meta.id}`}>{completed ? "Replay" : "Start"}</NavLink>
        </Button>
      </div>
    </div>
  );
}


