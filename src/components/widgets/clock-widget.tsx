import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function ClockWidget({ displayName }: { displayName: string }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hour = now.getHours();
  const greeting = hour < 5 ? "Good night" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : hour < 21 ? "Good evening" : "Good night";
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="glass-strong relative overflow-hidden rounded-3xl p-8 shadow-glow">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-30 blur-3xl"
           style={{ background: "radial-gradient(circle, var(--brand), transparent 60%)" }} />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full opacity-20 blur-3xl"
           style={{ background: "radial-gradient(circle, var(--brand-2), transparent 60%)" }} />
      <div className="relative">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {date}
        </div>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
          {greeting}, <span className="text-gradient">{displayName}</span>
        </h1>
        <div className="mt-4 flex items-baseline gap-3">
          <div className="font-display text-6xl font-bold tabular-nums md:text-7xl">{time}</div>
        </div>
        <p className="mt-3 max-w-md text-sm text-muted-foreground italic">
          {QUOTES[now.getDate() % QUOTES.length]}
        </p>
      </div>
    </div>
  );
}

const QUOTES = [
  "The secret of your future is hidden in your daily routine.",
  "Small steps every day lead to big changes.",
  "You don't have to be perfect. You have to be consistent.",
  "Discipline is choosing between what you want now and what you want most.",
  "Focus on being productive instead of busy.",
  "Do what you can, with what you have, where you are.",
  "The way to get started is to quit talking and begin doing.",
  "Motivation gets you going. Habit keeps you growing.",
  "One day or day one. You decide.",
  "Excellence is not an act, but a habit.",
];
