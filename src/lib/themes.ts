export type ThemeId =
  | "aurora"
  | "midnight"
  | "amoled"
  | "sunset"
  | "ocean"
  | "forest"
  | "cyberpunk"
  | "galaxy"
  | "autumn"
  | "minimal"
  | "apple";

export interface ThemeDef {
  id: ThemeId;
  name: string;
  swatch: [string, string];
  mood: "dark" | "light";
}

export const THEMES: ThemeDef[] = [
  { id: "aurora", name: "Aurora", swatch: ["#8b5cf6", "#22d3ee"], mood: "dark" },
  { id: "midnight", name: "Midnight", swatch: ["#3b82f6", "#8b5cf6"], mood: "dark" },
  { id: "amoled", name: "AMOLED", swatch: ["#facc15", "#f472b6"], mood: "dark" },
  { id: "sunset", name: "Sunset", swatch: ["#f97316", "#ec4899"], mood: "dark" },
  { id: "ocean", name: "Ocean", swatch: ["#0ea5e9", "#14b8a6"], mood: "dark" },
  { id: "forest", name: "Forest", swatch: ["#10b981", "#84cc16"], mood: "dark" },
  { id: "cyberpunk", name: "Cyberpunk", swatch: ["#ec4899", "#22d3ee"], mood: "dark" },
  { id: "galaxy", name: "Galaxy", swatch: ["#a855f7", "#d946ef"], mood: "dark" },
  { id: "autumn", name: "Autumn", swatch: ["#eab308", "#f97316"], mood: "dark" },
  { id: "minimal", name: "Minimal", swatch: ["#111827", "#6366f1"], mood: "light" },
  { id: "apple", name: "Apple", swatch: ["#3b82f6", "#d946ef"], mood: "light" },
];

export const DEFAULT_THEME: ThemeId = "aurora";

export function applyThemeToDocument(theme: ThemeId) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  const def = THEMES.find((t) => t.id === theme);
  document.documentElement.classList.toggle("dark", def?.mood !== "light");
}
