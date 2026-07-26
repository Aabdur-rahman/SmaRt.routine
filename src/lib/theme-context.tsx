import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { applyThemeToDocument, DEFAULT_THEME, type ThemeId } from "./themes";

interface ThemeCtx {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}

const Ctx = createContext<ThemeCtx>({ theme: DEFAULT_THEME, setTheme: () => {} });

const LS_KEY = "lumen.theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    if (typeof window === "undefined") return DEFAULT_THEME;
    return (localStorage.getItem(LS_KEY) as ThemeId) || DEFAULT_THEME;
  });

  useEffect(() => {
    applyThemeToDocument(theme);
    try { localStorage.setItem(LS_KEY, theme); } catch {}
  }, [theme]);

  // Hydrate from DB when user is authenticated
  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      const { data } = await supabase
        .from("user_settings")
        .select("theme")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (data?.theme) setThemeState(data.theme as ThemeId);
    };
    hydrate();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "USER_UPDATED") hydrate();
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const setTheme = (t: ThemeId) => {
    setThemeState(t);
    // fire-and-forget DB persist
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      supabase
        .from("user_settings")
        .upsert({ user_id: data.user.id, theme: t }, { onConflict: "user_id" })
        .then(() => {});
    });
  };

  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
