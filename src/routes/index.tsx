import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles, CheckCircle2, Flame, CloudSun, MoonStar, LineChart,
  Palette, ArrowRight, Zap, Github, StickyNote,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Lumen — Your intelligent life dashboard" },
      { name: "description", content: "The premium personal dashboard for tasks, habits, weather, prayer, notes, and XP streaks. Beautifully themed." },
      { property: "og:title", content: "Lumen — Your intelligent life dashboard" },
      { property: "og:description", content: "The premium personal dashboard for tasks, habits, weather, prayer, notes, and XP streaks. Beautifully themed." },
    ],
  }),
});

const FEATURES = [
  { icon: CheckCircle2, title: "Smart Tasks", desc: "Priorities, difficulty, XP rewards. Get things done, level up." },
  { icon: Flame, title: "Habits & Streaks", desc: "Track daily rituals, watch your streak grow, keep momentum alive." },
  { icon: CloudSun, title: "Live Weather", desc: "Location-aware forecasts with hourly and 7-day outlook." },
  { icon: MoonStar, title: "Prayer Times", desc: "Accurate prayer schedule with countdown to next prayer." },
  { icon: StickyNote, title: "Notes & Journal", desc: "Capture thoughts, tag them, pin the important ones." },
  { icon: LineChart, title: "Analytics", desc: "Beautiful charts of XP, streaks, habits, and productivity." },
  { icon: Palette, title: "11 Themes", desc: "Aurora, Cyberpunk, Apple, AMOLED — the whole UI transforms." },
  { icon: Zap, title: "Gamified", desc: "XP, levels, and achievements make daily life feel like a game." },
];

function Landing() {
  return (
    <div className="min-h-dvh overflow-hidden">
      <Nav />
      <Hero />
      <Features />
      <Showcase />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="glass flex items-center justify-between rounded-full px-4 py-2.5 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg gradient-brand shadow-glow">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-semibold">Lumen</span>
          </Link>
          <nav className="hidden gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">Features</a>
            <a href="#showcase" className="text-sm text-muted-foreground hover:text-foreground transition">Showcase</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth" className="hidden text-sm text-muted-foreground hover:text-foreground transition md:inline">Sign in</Link>
            <Link
              to="/auth"
              className="rounded-full gradient-brand px-4 py-1.5 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-90"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-40 pb-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-20 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-40 blur-3xl animate-float"
             style={{ background: "radial-gradient(circle, var(--brand), transparent 60%)" }} />
        <div className="absolute right-1/4 top-40 h-[400px] w-[400px] rounded-full opacity-30 blur-3xl"
             style={{ background: "radial-gradient(circle, var(--brand-2), transparent 60%)" }} />
      </div>
      <div className="mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
          <span className="text-muted-foreground">New — 11 dynamic themes</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
        >
          Your entire life,
          <br />
          <span className="text-gradient">beautifully organized.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
        >
          Tasks. Habits. Weather. Prayer. Notes. XP. Streaks. Themes.
          One calm, gamified dashboard for the life you actually want to live.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow transition hover:scale-[1.02]"
          >
            Start free <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#features"
            className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition hover:bg-accent/50"
          >
            See features
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mx-auto mt-16 max-w-5xl px-4"
      >
        <div className="glass-strong overflow-hidden rounded-3xl p-2 shadow-glow">
          <div className="grid gap-3 rounded-2xl p-4 md:grid-cols-3">
            <MiniCard title="Today's XP" value="+420" sub="Level 12" accent />
            <MiniCard title="Streak" value="47 days" sub="Longest: 62" />
            <MiniCard title="Focus" value="4h 12m" sub="Above average" />
            <div className="glass rounded-2xl p-5 md:col-span-2">
              <div className="text-xs text-muted-foreground">Today's tasks</div>
              <div className="mt-3 space-y-2">
                {["Ship dashboard v2", "Deep work — 2 hours", "Evening run — 5km"].map((t, i) => (
                  <div key={t} className="flex items-center gap-3 rounded-xl bg-secondary/50 p-2.5 text-sm">
                    <div className={`grid h-5 w-5 place-items-center rounded-md ${i === 0 ? "gradient-brand" : "border border-border"}`}>
                      {i === 0 && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <span className={i === 0 ? "line-through text-muted-foreground" : ""}>{t}</span>
                    <span className="ml-auto text-xs text-muted-foreground">+{[20, 50, 30][i]} XP</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl p-5">
              <div className="text-xs text-muted-foreground">Weather</div>
              <div className="mt-2 flex items-center gap-3">
                <CloudSun className="h-10 w-10 text-accent" />
                <div>
                  <div className="text-2xl font-semibold">24°</div>
                  <div className="text-xs text-muted-foreground">Partly cloudy</div>
                </div>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                Next prayer <span className="text-foreground">Maghrib · 18:42</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function MiniCard({ title, value, sub, accent }: { title: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className={`glass rounded-2xl p-5 ${accent ? "ring-glow" : ""}`}>
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className={`mt-1 text-3xl font-semibold ${accent ? "text-gradient" : ""}`}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-14 max-w-2xl">
          <div className="text-sm font-medium text-gradient">Everything you need</div>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
            One dashboard. Your whole day.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No more twelve open tabs. Lumen replaces your task app, habit tracker, weather widget, and journal — all in one calm surface.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass group relative overflow-hidden rounded-2xl p-6 transition hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl gradient-brand shadow-glow">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  return (
    <section id="showcase" className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <div className="text-sm font-medium text-gradient">Themes</div>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Match your mood.<br />Change the whole app.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              11 hand-crafted themes. Pick Aurora at night, Apple in the morning, Cyberpunk when you're in the zone. The whole interface transforms instantly.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["#8b5cf6", "#22d3ee"], ["#3b82f6", "#8b5cf6"], ["#0ea5e9", "#14b8a6"],
              ["#f97316", "#ec4899"], ["#10b981", "#84cc16"], ["#ec4899", "#22d3ee"],
              ["#facc15", "#f472b6"], ["#a855f7", "#d946ef"], ["#3b82f6", "#d946ef"],
            ].map(([a, b], i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, rotate: 1 }}
                className="aspect-square rounded-2xl shadow-glow"
                style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-4">
        <div className="glass-strong relative overflow-hidden rounded-3xl p-10 text-center shadow-glow md:p-16">
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-40"
               style={{ background: "radial-gradient(ellipse at center, var(--brand), transparent 60%)" }} />
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Ready to make today count?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Start free. No credit card. Import in seconds. Feel the difference in a week.
          </p>
          <Link
            to="/auth"
            className="mt-8 inline-flex items-center gap-2 rounded-full gradient-brand px-8 py-3 text-sm font-medium text-primary-foreground shadow-glow transition hover:scale-[1.02]"
          >
            Get Lumen free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-md gradient-brand">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold">Lumen</span>
          <span className="text-xs text-muted-foreground">© {new Date().getFullYear()}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Built with care · Themes for every mood
        </div>
      </div>
    </footer>
  );
}
