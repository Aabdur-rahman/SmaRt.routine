import { useQuery } from "@tanstack/react-query";
import { Trophy, Flame, Zap, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function levelFromXp(xp: number): { level: number; nextLevelXp: number; currentLevelXp: number } {
  // Each level requires level * 100 additional XP
  let level = 1;
  let remaining = xp;
  while (remaining >= level * 100) {
    remaining -= level * 100;
    level++;
  }
  return { level, currentLevelXp: remaining, nextLevelXp: level * 100 };
}

export function StatsWidget() {
  const { data } = useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase.from("user_stats").select("*").eq("user_id", user.id).maybeSingle();
      return data ?? { xp: 0, level: 1, current_streak: 0, longest_streak: 0, tasks_completed: 0 };
    },
  });

  const xp = data?.xp ?? 0;
  const lvl = levelFromXp(xp);
  const pct = Math.round((lvl.currentLevelXp / lvl.nextLevelXp) * 100);

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <StatCard
        icon={<Zap className="h-5 w-5" />}
        label="Total XP"
        value={xp.toLocaleString()}
        sub={`Level ${lvl.level}`}
        highlight
      />
      <StatCard
        icon={<Flame className="h-5 w-5" />}
        label="Streak"
        value={`${data?.current_streak ?? 0} days`}
        sub={`Best: ${data?.longest_streak ?? 0}`}
      />
      <StatCard
        icon={<Trophy className="h-5 w-5" />}
        label="Completed"
        value={String(data?.tasks_completed ?? 0)}
        sub="all-time"
      />
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Target className="h-3.5 w-3.5" />
          Next level
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="font-display text-2xl font-bold">{lvl.currentLevelXp}</span>
          <span className="text-xs text-muted-foreground">/ {lvl.nextLevelXp}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full gradient-brand transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon, label, value, sub, highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div className={`glass rounded-2xl p-4 ${highlight ? "shadow-glow" : ""}`}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className={highlight ? "text-gradient" : ""}>{icon}</span>
        {label}
      </div>
      <div className={`mt-2 font-display text-2xl font-bold ${highlight ? "text-gradient" : ""}`}>
        {value}
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}
