import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { THEMES } from "@/lib/themes";
import { useTheme } from "@/lib/theme-context";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Settings — Lumen" }] }),
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      return { ...data, email: user.email };
    },
  });

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Make Lumen feel like yours.</p>
      </div>

      <div className="glass mb-6 rounded-3xl p-6">
        <h3 className="font-display text-lg font-semibold">Profile</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Row label="Name" value={profile?.display_name ?? "—"} />
          <Row label="Email" value={profile?.email ?? "—"} />
        </div>
      </div>

      <div className="glass rounded-3xl p-6">
        <h3 className="font-display text-lg font-semibold">Theme</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The whole app transforms instantly. Your choice syncs across every device.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {THEMES.map((t) => {
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition ${
                  active ? "border-primary shadow-glow" : "border-border hover:border-primary/50"
                }`}
              >
                <div
                  className="mb-3 h-16 w-full rounded-xl"
                  style={{ background: `linear-gradient(135deg, ${t.swatch[0]}, ${t.swatch[1]})` }}
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t.name}</span>
                  {active && (
                    <span className="grid h-5 w-5 place-items-center rounded-full gradient-brand">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground capitalize">{t.mood}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}
