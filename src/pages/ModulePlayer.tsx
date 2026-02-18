import { useParams } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { getModuleMeta } from "@/edu/modules/registry";
import HeadlineQuiz from "@/edu/modules/HeadlineQuiz";
import DataLabelingSimulator from "@/edu/modules/DataLabelingSimulator";
import BiasDetectionActivity from "@/edu/modules/BiasDetectionActivity";
import ConfusionMatrixExplorer from "@/edu/modules/ConfusionMatrixExplorer";
import MetricsPlayground from "@/edu/modules/MetricsPlayground";
import OverfittingDemo from "@/edu/modules/OverfittingDemo";
import FeatureImportanceVisualizer from "@/edu/modules/FeatureImportanceVisualizer";
import TrainingSimulator from "@/edu/modules/TrainingSimulator";

export default function ModulePlayer() {
  const { moduleId } = useParams();
  const meta = getModuleMeta(moduleId);

  if (!meta) {
    return (
      <SiteLayout title="Module not found" subtitle="This case file doesn’t exist (yet).">
        <div className="card-case-file p-6 text-left">
          <p className="text-muted-foreground">Try picking a module from the learning dashboard.</p>
          <div className="mt-4">
            <Button asChild className="rounded-full bg-gradient-to-r from-primary to-secondary btn-detective">
              <NavLink to="/learn">Go to Learning Dashboard</NavLink>
            </Button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  switch (meta.id) {
    case "headline-quiz":
      return <HeadlineQuiz />;
    case "data-labeling":
      return <DataLabelingSimulator />;
    case "bias-detection":
      return <BiasDetectionActivity />;
    case "confusion-matrix":
      return <ConfusionMatrixExplorer />;
    case "metrics-playground":
      return <MetricsPlayground />;
    case "overfitting-demo":
      return <OverfittingDemo />;
    case "feature-importance":
      return <FeatureImportanceVisualizer />;
    case "training-simulator":
      return <TrainingSimulator />;
    default:
      return (
        <SiteLayout title={meta.title} subtitle="Module is under construction.">
          <div className="card-case-file p-6 text-left">
            <p className="text-muted-foreground">This module will be added shortly.</p>
          </div>
        </SiteLayout>
      );
  }
}


