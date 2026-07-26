import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CheckCircle2, Circle, Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DIFFICULTY_XP = { easy: 10, medium: 20, hard: 50 } as const;

export function TasksWidget({ compact = false }: { compact?: boolean }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", { compact }],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      let q = supabase.from("tasks").select("*").eq("user_id", user.id).order("completed").order("created_at", { ascending: false });
      if (compact) q = q.limit(6);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const t = title.trim();
      if (!t) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase.from("tasks").insert({
        user_id: user.id,
        title: t,
        difficulty,
        xp_reward: DIFFICULTY_XP[difficulty],
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setTitle("");
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, completed, xp_reward }: { id: string; completed: boolean; xp_reward: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");

      const { error } = await supabase.from("tasks")
        .update({ completed: !completed, completed_at: !completed ? new Date().toISOString() : null })
        .eq("id", id);
      if (error) throw error;

      // Update XP + tasks_completed
      const delta = !completed ? xp_reward : -xp_reward;
      const taskDelta = !completed ? 1 : -1;
      const { data: stats } = await supabase.from("user_stats").select("xp,tasks_completed,current_streak,longest_streak,last_active_date").eq("user_id", user.id).maybeSingle();
      const newXp = Math.max(0, (stats?.xp ?? 0) + delta);
      const newTasks = Math.max(0, (stats?.tasks_completed ?? 0) + taskDelta);
      const today = new Date().toISOString().slice(0, 10);
      let newStreak = stats?.current_streak ?? 0;
      let newLongest = stats?.longest_streak ?? 0;
      if (!completed) {
        // Completing
        if (stats?.last_active_date !== today) {
          const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
          const yStr = yesterday.toISOString().slice(0, 10);
          newStreak = stats?.last_active_date === yStr ? newStreak + 1 : 1;
          newLongest = Math.max(newLongest, newStreak);
        }
      }
      await supabase.from("user_stats").upsert({
        user_id: user.id, xp: newXp, tasks_completed: newTasks,
        current_streak: newStreak, longest_streak: newLongest,
        last_active_date: !completed ? today : stats?.last_active_date,
      }, { onConflict: "user_id" });

      if (!completed) toast.success(`+${xp_reward} XP`, { duration: 1500 });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["user-stats"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  return (
    <div className="glass rounded-3xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Today's tasks</h3>
        <span className="text-xs text-muted-foreground">
          {tasks.filter((t: any) => t.completed).length}/{tasks.length} done
        </span>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); create.mutate(); }}
        className="mb-4 flex gap-2"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as any)}
          className="rounded-xl border border-border bg-card px-2 py-2 text-xs"
        >
          <option value="easy">Easy · 10 XP</option>
          <option value="medium">Medium · 20 XP</option>
          <option value="hard">Hard · 50 XP</option>
        </select>
        <button
          type="submit"
          disabled={create.isPending || !title.trim()}
          className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-primary-foreground shadow-glow disabled:opacity-50"
          aria-label="Add task"
        >
          {create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </button>
      </form>

      <div className="space-y-2">
        {isLoading && (
          <div className="text-sm text-muted-foreground">Loading tasks…</div>
        )}
        {!isLoading && tasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No tasks yet. Add your first above.
          </div>
        )}
        {tasks.map((t: any) => (
          <div
            key={t.id}
            className={`group flex items-center gap-3 rounded-xl border border-border p-3 transition ${
              t.completed ? "opacity-60" : "hover:bg-accent"
            }`}
          >
            <button
              onClick={() => toggle.mutate({ id: t.id, completed: t.completed, xp_reward: t.xp_reward })}
              className="shrink-0"
              aria-label={t.completed ? "Mark incomplete" : "Complete task"}
            >
              {t.completed ? (
                <CheckCircle2 className="h-5 w-5 text-gradient" style={{ color: "var(--brand)" }} />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            <div className="min-w-0 flex-1">
              <div className={`text-sm ${t.completed ? "line-through" : "font-medium"}`}>{t.title}</div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="capitalize">{t.difficulty}</span>
                <span>·</span>
                <span>+{t.xp_reward} XP</span>
              </div>
            </div>
            <button
              onClick={() => remove.mutate(t.id)}
              className="opacity-0 transition group-hover:opacity-100"
              aria-label="Delete task"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
