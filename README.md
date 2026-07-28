# Lumen — Personal Smart Life Dashboard

A premium, gamified personal dashboard that brings tasks, habits, weather, prayer times, notes, and journaling into one calm, beautifully themed surface.

![Lumen Dashboard](https://aura-life-dash.lovable.app/og-image.png)

## ✨ What is SmaRt.routine?

Lumen is your intelligent life dashboard — a single place to organize your day, build habits, track progress, and stay mindful. It replaces scattered productivity apps with a unified, visually stunning experience that adapts to your mood through 11+ dynamic themes.

## 🚀 Features

- **Smart Tasks** — Priorities, difficulty levels, and XP rewards. Complete tasks to level up.
- **Habit Tracker** — Daily rituals with streaks and a 90-day heatmap.
- **Gamification** — XP, levels, and achievements calculated from your productivity.
- **Live Weather** — Location-aware forecasts with hourly and 7-day outlook.
- **Prayer Times** — Accurate prayer schedule with countdown to the next prayer.
- **Notes & Journal** — Rich notes with pinning, tagging, and daily journal entries.
- **11 Dynamic Themes** — Aurora, Cyberpunk, Apple, AMOLED, and more. The entire UI transforms instantly.
- **Authentication** — Secure email/password and Google OAuth via Lovable Cloud.
- **Cloud Sync** — All data persists securely in the cloud with Row Level Security.

## 🛠 Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (React 19 + SSR/SSG)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 with custom CSS variables and glassmorphism
- **Backend & Auth:** Lovable Cloud (Supabase)
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Charts:** Recharts
- **State & Data:** TanStack Query + server functions

## 📦 Getting Started

### Prerequisites

- Node.js 20+
- Bun or npm
- A Lovable Cloud / Supabase project

### Installation

```bash
git clone <repository-url>
cd lumen
bun install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### Run Locally

```bash
bun run dev
```

Open https://lumina-life-333s.vercel.app/ in your browser.

## 🧱 Build for Production

```bash
bun run build
```

The static output is generated in `dist/`.

## 🌐 Deployment
https://lumina-life-333s.vercel.app/

### Deploy with Lovable

The easiest way to publish Lumen is directly from the Lovable editor:

1. Click **Publish** in the Lovable interface.
2. Lovable automatically deploys with the correct TanStack Start preset.

### Manual Deployment (Vercel / Cloudflare / etc.)

Use these settings:

| Field | Value |
|---|---|
| **Framework Preset** | `TanStack Start` |
| **Root Directory** | `./` |
| **Build Command** | `vite build` |
| **Output Directory** | `dist` |
| **Install Command** | `bun install` or `npm install` |

Add the environment variables listed above in your hosting dashboard.

## 📁 Project Structure

```text
src/
├── components/          # UI components and widgets
│   ├── widgets/         # Dashboard widgets (clock, weather, tasks, etc.)
│   └── app-shell.tsx    # Main layout shell
├── lib/                 # Utilities, themes, and context
├── routes/              # TanStack file-based routes
│   ├── _authenticated/  # Protected dashboard routes
│   ├── auth.tsx         # Authentication page
│   ├── index.tsx        # Landing page
│   └── __root.tsx       # Root layout
├── integrations/        # Supabase and Lovable auth integration
└── styles.css           # Global styles and theme tokens
```

## 🎨 Themes

Lumen ships with 11 premium themes, each defined as a set of semantic CSS variables:

| Theme | Mood |
|---|---|
| Aurora | Dark |
| Midnight | Dark |
| AMOLED | Dark |
| Sunset | Dark |
| Ocean | Dark |
| Forest | Dark |
| Cyberpunk | Dark |
| Galaxy | Dark |
| Autumn | Dark |
| Minimal | Light |
| Apple | Light |

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

MIT — feel free to use, modify, and distribute.

---

Built with care using [Lovable](https://lovable.dev).
