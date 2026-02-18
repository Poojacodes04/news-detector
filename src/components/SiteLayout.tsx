import FloatingElements from "@/components/FloatingElements";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GraduationCap, Home, Info, BookOpen, Database, ShieldAlert, HelpCircle, ClipboardList } from "lucide-react";

type Props = {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
};

const navItems = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/learn", label: "Learn", Icon: GraduationCap },
  { to: "/how-ai-works", label: "How AI Works", Icon: BookOpen },
  { to: "/dataset", label: "Dataset", Icon: Database },
  { to: "/limitations", label: "Limitations", Icon: ShieldAlert },
  { to: "/faq", label: "FAQ", Icon: HelpCircle },
  { to: "/teacher", label: "Teacher", Icon: ClipboardList },
  { to: "/about", label: "About", Icon: Info },
] as const;

export default function SiteLayout({ children, className, title, subtitle }: Props) {
  return (
    <div className="min-h-screen bg-detective relative overflow-x-hidden">
      <FloatingElements />

      <header className="relative z-10 px-4 pt-6">
        <div className="mx-auto w-full max-w-6xl card-case-file px-4 py-3 md:px-6 md:py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-left">
              <div className="text-lg md:text-xl font-black">
                <span className="text-gradient">AI Detective</span>{" "}
                <span className="text-accent">Academy</span>
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {subtitle || "Learn how models are trained — and how to think critically about predictions."}
              </div>
            </div>

            <nav className="flex flex-wrap gap-2">
              {navItems.map(({ to, label, Icon }) => (
                <Button key={to} asChild variant="ghost" className="h-9 rounded-full px-3">
                  <NavLink
                    to={to}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    activeClassName="text-foreground"
                  >
                    <Icon size={16} className="text-accent" />
                    <span className="text-sm font-bold">{label}</span>
                  </NavLink>
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className={cn("relative z-10 px-4 pb-10 pt-6", className)}>
        <div className="mx-auto w-full max-w-6xl">
          {title && (
            <div className="mb-6 text-center">
              <h1 className="text-3xl md:text-5xl font-bold">
                <span className="text-gradient">{title}</span>
              </h1>
              {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </main>

      <footer className="relative z-10 text-center py-8 text-muted-foreground text-sm px-4">
        <p>🤖🔍 AI Detective Academy — Teaching kids how AI thinks!</p>
        <p className="mt-2 text-xs">Remember: AI is a tool, not a truth machine! Always think critically. 🧠✨</p>
      </footer>
    </div>
  );
}


