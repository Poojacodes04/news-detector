import { Search, HelpCircle, Sparkles, Star } from "lucide-react";

const FloatingElements = () => {
  const elements = [
    { Icon: Search, className: "top-[10%] left-[5%] text-primary/30", delay: "0s", size: 40 },
    { Icon: HelpCircle, className: "top-[20%] right-[10%] text-secondary/25", delay: "1s", size: 35 },
    { Icon: Sparkles, className: "top-[40%] left-[8%] text-accent/20", delay: "0.5s", size: 30 },
    { Icon: Search, className: "top-[60%] right-[5%] text-primary/20", delay: "1.5s", size: 45 },
    { Icon: Star, className: "top-[75%] left-[12%] text-orange/25", delay: "2s", size: 28 },
    { Icon: HelpCircle, className: "top-[85%] right-[15%] text-lime/20", delay: "0.8s", size: 32 },
    { Icon: Sparkles, className: "top-[30%] left-[90%] text-secondary/20", delay: "1.2s", size: 36 },
    { Icon: Star, className: "top-[50%] left-[3%] text-accent/15", delay: "2.5s", size: 24 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el, index) => (
        <el.Icon
          key={index}
          size={el.size}
          className={`absolute animate-float-slow ${el.className}`}
          style={{ animationDelay: el.delay }}
        />
      ))}
    </div>
  );
};

export default FloatingElements;
