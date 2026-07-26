import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Flame, Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

function isoToday() { return new Date().toISOString().slice(0, 10); }

export function HabitsWidget() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const today = isoToday();

  const { data: habits = [] } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase.from("habits").select("*").eq("user_id", user.id).eq("active", true).order("created_at");
      return data ?? [];
    },
  });

  const { data: todayLogs = [] } = useQuery({
    queryKey: ["habit-logs", today],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase.from("habit_logs").select("*").eq("user_id", user.id).eq("log_date", today);
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const n = name.trim();
      if (!n) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase.from("habits").insert({ user_id: user.id, name: n });
      if (error) throw error;
    },
    onSuccess: () => {
      setName("");
      qc.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  const toggleLog = useMutation({
    mutationFn: async (habitId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const existing = todayLogs.find((l: any) => l.habit_id === habitId);
      if (existing) {
        await supabase.from("habit_logs").delete().eq("id", existing.id);
      } else {
        await supabase.from("habit_logs").insert({ user_id: user.id, habit_id: habitId, log_date: today });
        // Small XP reward for habit completion
        const { data: stats } = await supabase.from("user_stats").select("xp").eq("user_id", user.id).maybeSingle();
        await supabase.from("user_stats").upsert(
          { user_id: user.id, xp: (stats?.xp ?? 0) + 5 },
          { onConflict: "user_id" }
        );
        toast.success("+5 XP", { duration: 1200 });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["habit-logs"] });
      qc.invalidateQueries({ queryKey: ["user-stats"] });
    },
  });

  return (
    <div className="glass rounded-3xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-400" />
          Habits
        </h3>
        <span className="text-xs text-muted-foreground">
          {todayLogs.length}/{habits.length} today
        </span>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); create.mutate(); }}
        className="mb-4 flex gap-2"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New habit (e.g. Drink water)"
          className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={create.isPending || !name.trim()}
          className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-primary-foreground shadow-glow disabled:opacity-50"
          aria-label="Add habit"
        >
          {create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </button>
      </form>

      <div className="grid gap-2 sm:grid-cols-2">
        {habits.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Add your first habit above.
          </div>
        )}
        {habits.map((h: any) => {
          const done = todayLogs.some((l: any) => l.habit_id === h.id);
          return (
            <button
              key={h.id}
              onClick={() => toggleLog.mutate(h.id)}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                done ? "border-primary bg-primary/10" : "border-border hover:bg-accent"
              }`}
            >
              <div className={`grid h-8 w-8 place-items-center rounded-lg ${
                done ? "gradient-brand shadow-glow" : "border border-border"
              }`}>
                {done ? <Check className="h-4 w-4 text-primary-foreground" /> : <Flame className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{h.name}</div>
                <div className="text-xs text-muted-foreground">
                  {done ? "Completed today · +5 XP" : "Tap to complete"}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
