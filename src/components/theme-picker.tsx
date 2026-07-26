import { useState } from "react";
import { Palette, Check } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { THEMES } from "@/lib/themes";

export function ThemePicker() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const active = THEMES.find((t) => t.id === theme);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
      >
        <Palette className="h-4 w-4" />
        <span>Theme</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span
            className="h-4 w-4 rounded-full border border-border"
            style={{ background: `linear-gradient(135deg, ${active?.swatch[0]}, ${active?.swatch[1]})` }}
          />
          <span className="text-xs">{active?.name}</span>
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 z-50 mb-2 w-72 rounded-2xl border border-glass-border bg-card p-3 shadow-glow animate-scale-in">
            <div className="mb-2 px-1 text-xs font-medium text-muted-foreground">Choose theme</div>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((t) => {
                const isActive = t.id === theme;
                return (
                  <button
                    key={t.id}
                    onClick={() => { setTheme(t.id); setOpen(false); }}
                    className={`group flex items-center gap-2 rounded-xl border p-2 text-left text-xs transition hover:bg-accent ${
                      isActive ? "border-primary" : "border-border"
                    }`}
                  >
                    <span
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border"
                      style={{ background: `linear-gradient(135deg, ${t.swatch[0]}, ${t.swatch[1]})` }}
                    >
                      {isActive && <Check className="h-4 w-4 text-white drop-shadow" />}
                    </span>
                    <span className="font-medium">{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
