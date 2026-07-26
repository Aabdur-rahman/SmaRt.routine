import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { MoonStar } from "lucide-react";

const PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

function useCoords() {
  return useQuery({
    queryKey: ["geo-coords"],
    queryFn: async (): Promise<{ lat: number; lon: number }> => {
      if (typeof navigator !== "undefined" && navigator.geolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 6000 });
          });
          return { lat: pos.coords.latitude, lon: pos.coords.longitude };
        } catch {}
      }
      try {
        const r = await fetch("https://ipapi.co/json/");
        const j = await r.json();
        return { lat: j.latitude, lon: j.longitude };
      } catch {
        return { lat: 25.276987, lon: 55.296249 };
      }
    },
    staleTime: 30 * 60_000,
  });
}

export function PrayerWidget() {
  const { data: coords } = useCoords();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["prayer", coords?.lat, coords?.lon, now.toDateString()],
    enabled: !!coords,
    staleTime: 60 * 60_000,
    queryFn: async () => {
      const url = `https://api.aladhan.com/v1/timings/${Math.floor(now.getTime() / 1000)}?latitude=${coords!.lat}&longitude=${coords!.lon}&method=2`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("prayer fetch failed");
      const json = await res.json();
      return json.data.timings as Record<string, string>;
    },
  });

  if (isLoading || !data) {
    return (
      <div className="glass h-full rounded-3xl p-6">
        <div className="h-4 w-24 rounded bg-muted animate-pulse" />
        <div className="mt-4 h-16 w-40 rounded bg-muted animate-pulse" />
      </div>
    );
  }

  const times = PRAYERS.map((p) => {
    const [h, m] = data[p].split(":").map(Number);
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    return { name: p, at: d, timeStr: data[p] };
  });

  const next = times.find((t) => t.at.getTime() > now.getTime()) ?? { name: "Fajr", at: (() => { const d = new Date(times[0].at); d.setDate(d.getDate() + 1); return d; })(), timeStr: data.Fajr };
  const msLeft = next.at.getTime() - now.getTime();
  const hLeft = Math.floor(msLeft / 3_600_000);
  const mLeft = Math.floor((msLeft % 3_600_000) / 60_000);

  return (
    <div className="glass relative h-full overflow-hidden rounded-3xl p-6">
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-2xl"
           style={{ background: "radial-gradient(circle, var(--brand), transparent 60%)" }} />
      <div className="relative">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MoonStar className="h-3 w-3" />
          Next prayer
        </div>
        <div className="mt-2">
          <div className="font-display text-3xl font-bold">{next.name}</div>
          <div className="text-sm text-muted-foreground">at {next.timeStr}</div>
          <div className="mt-1 text-xs">
            in <span className="font-semibold text-gradient">{hLeft}h {mLeft}m</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-1.5 text-xs">
          {times.map((t) => {
            const active = t.name === next.name;
            return (
              <div
                key={t.name}
                className={`rounded-xl border p-2 ${
                  active ? "border-primary bg-primary/10" : "border-border bg-card/40"
                }`}
              >
                <div className="text-muted-foreground">{t.name}</div>
                <div className="font-semibold tabular-nums">{t.timeStr}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
