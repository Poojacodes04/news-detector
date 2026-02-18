import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Learn from "./pages/Learn";
import ModulePlayer from "./pages/ModulePlayer";
import HowAIWorks from "./pages/HowAIWorks";
import Dataset from "./pages/Dataset";
import Limitations from "./pages/Limitations";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Teacher from "./pages/Teacher";
import { EduProvider } from "@/edu/EduContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <EduProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:moduleId" element={<ModulePlayer />} />
            <Route path="/how-ai-works" element={<HowAIWorks />} />
            <Route path="/dataset" element={<Dataset />} />
            <Route path="/limitations" element={<Limitations />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/about" element={<About />} />
            <Route path="/teacher" element={<Teacher />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </EduProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
