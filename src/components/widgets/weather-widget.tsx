import { useQuery } from "@tanstack/react-query";
import { CloudSun, Cloud, CloudRain, CloudSnow, Sun, MapPin, Wind, Droplets, Zap } from "lucide-react";

interface Coords { lat: number; lon: number; name?: string }

function useCoords() {
  return useQuery<Coords>({
    queryKey: ["geo-coords"],
    queryFn: async () => {
      // Default to Islamabad, Pakistan
      return { lat: 33.6844, lon: 73.0479, name: "Islamabad, Pakistan" };
    },
    staleTime: 30 * 60_000,
  });
}

const WEATHER_CODES: Record<number, { label: string; Icon: typeof Sun }> = {
  0: { label: "Clear sky", Icon: Sun },
  1: { label: "Mostly clear", Icon: Sun },
  2: { label: "Partly cloudy", Icon: CloudSun },
  3: { label: "Overcast", Icon: Cloud },
  45: { label: "Fog", Icon: Cloud },
  48: { label: "Fog", Icon: Cloud },
  51: { label: "Light drizzle", Icon: CloudRain },
  53: { label: "Drizzle", Icon: CloudRain },
  55: { label: "Heavy drizzle", Icon: CloudRain },
  61: { label: "Light rain", Icon: CloudRain },
  63: { label: "Rain", Icon: CloudRain },
  65: { label: "Heavy rain", Icon: CloudRain },
  71: { label: "Light snow", Icon: CloudSnow },
  73: { label: "Snow", Icon: CloudSnow },
  75: { label: "Heavy snow", Icon: CloudSnow },
  95: { label: "Thunderstorm", Icon: Zap },
};

export function WeatherWidget() {
  const { data: coords } = useCoords();
  const { data, isLoading } = useQuery({
    queryKey: ["weather", coords?.lat, coords?.lon],
    enabled: !!coords,
    staleTime: 15 * 60_000,
    queryFn: async () => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords!.lat}&longitude=${coords!.lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=7`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("weather fetch failed");
      return res.json();
    },
  });

  if (isLoading || !data) {
    return (
      <div className="glass h-full rounded-3xl p-6">
        <div className="h-4 w-20 rounded bg-muted animate-pulse" />
        <div className="mt-4 h-16 w-32 rounded bg-muted animate-pulse" />
      </div>
    );
  }

  const c = data.current;
  const info = WEATHER_CODES[c.weather_code] ?? { label: "—", Icon: Cloud };
  const Icon = info.Icon;

  return (
    <div className="glass relative h-full overflow-hidden rounded-3xl p-6">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-2xl"
           style={{ background: "radial-gradient(circle, var(--brand-2), transparent 60%)" }} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {coords?.name ?? "Your location"}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <Icon className="h-16 w-16 text-accent" strokeWidth={1.5} />
          <div>
            <div className="font-display text-5xl font-bold tabular-nums">{Math.round(c.temperature_2m)}°</div>
            <div className="text-sm text-muted-foreground">{info.label}</div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
          <Stat icon={<Droplets className="h-3.5 w-3.5" />} label="Humidity" value={`${c.relative_humidity_2m}%`} />
          <Stat icon={<Wind className="h-3.5 w-3.5" />} label="Wind" value={`${Math.round(c.wind_speed_10m)} km/h`} />
          <Stat icon={<Sun className="h-3.5 w-3.5" />} label="Feels" value={`${Math.round(c.apparent_temperature)}°`} />
        </div>

        <div className="mt-5">
          <div className="text-xs text-muted-foreground mb-2">Next 7 days</div>
          <div className="flex gap-1.5 overflow-x-auto">
            {data.daily?.time?.slice(0, 7).map((d: string, i: number) => {
              const day = new Date(d).toLocaleDateString([], { weekday: "short" });
              const wcode = data.daily.weather_code[i];
              const DIcon = (WEATHER_CODES[wcode] ?? info).Icon;
              return (
                <div key={d} className="flex min-w-[52px] flex-1 flex-col items-center gap-1 rounded-xl border border-border bg-card/40 p-2 text-xs">
                  <span className="text-muted-foreground">{day}</span>
                  <DIcon className="h-4 w-4 text-accent" strokeWidth={1.5} />
                  <span className="font-medium tabular-nums">{Math.round(data.daily.temperature_2m_max[i])}°</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-2.5">
      <div className="flex items-center gap-1 text-muted-foreground">{icon}<span>{label}</span></div>
      <div className="mt-0.5 text-sm font-semibold">{value}</div>
    </div>
  );
}
