import { createFileRoute } from "@tanstack/react-router";
import { HabitsWidget } from "@/components/widgets/habits-widget";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/habits")({
  component: HabitsPage,
  head: () => ({ meta: [{ title: "Habits — Lumen" }] }),
});

function HabitsPage() {
  const { data: heatmap = [] } = useQuery({
    queryKey: ["habit-heatmap"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const from = new Date();
      from.setDate(from.getDate() - 90);
      const { data } = await supabase
        .from("habit_logs")
        .select("log_date")
        .eq("user_id", user.id)
        .gte("log_date", from.toISOString().slice(0, 10));
      const counts = new Map<string, number>();
      (data ?? []).forEach((r: any) => counts.set(r.log_date, (counts.get(r.log_date) ?? 0) + 1));
      const days: { date: string; count: number }[] = [];
      for (let i = 89; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        days.push({ date: key, count: counts.get(key) ?? 0 });
      }
      return days;
    },
  });

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight">Habits</h1>
        <p className="mt-1 text-sm text-muted-foreground">Build streaks. Grow consistently.</p>
      </div>

      <div className="glass mb-6 rounded-3xl p-6">
        <h3 className="font-display text-lg font-semibold">Last 90 days</h3>
        <div className="mt-4 grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1 sm:grid-cols-[repeat(30,minmax(0,1fr))]">
          {heatmap.map((d) => (
            <div
              key={d.date}
              title={`${d.date} · ${d.count} completed`}
              className="aspect-square rounded-[3px]"
              style={{
                background:
                  d.count === 0 ? "color-mix(in oklab, var(--foreground) 8%, transparent)" :
                  d.count === 1 ? "color-mix(in oklab, var(--brand) 35%, transparent)" :
                  d.count === 2 ? "color-mix(in oklab, var(--brand) 60%, transparent)" :
                                 "var(--brand)",
              }}
            />
          ))}
        </div>
      </div>

      <HabitsWidget />
    </div>
  );
}
