# Fisiohome Dashboard – Vibe Code Instructions

You are an expert frontend engineer.

Your task is to build an internal dashboard application for Fisiohome based strictly on a provided UI mockup.

---

## Tech Stack
- Runtime: Bun
- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- UI Components: shadcn/ui
- API Source: https://api-staging.fisiohome.id/swagger

---

## Project Setup Commands

```bash
bun create next-app fisiohome-dashboard
cd fisiohome-dashboard

bun add tailwindcss postcss autoprefixer
bun add class-variance-authority clsx tailwind-merge lucide-react

bunx tailwindcss init -p
bunx shadcn@latest init

bun dev
```

shadcn/ui configuration:
- Framework: Next.js
- App Router: Yes
- Style: Default
- Base color: Slate
- CSS variables: Yes

---

## UI & Design Rules
- UI must strictly follow the provided mockup
- Layout:
  - Sidebar navigation
  - Top bar
  - Main content area
- Clean, minimal, professional
- Fully responsive
- No inline styles

---

## API Rules
- Base URL: https://api-staging.fisiohome.id
- Do NOT hardcode data
- Always consume data from API
- Handle loading and error states
- Use Server Components by default

Example API helper:

```ts
// lib/api.ts
const API_BASE_URL = "https://api-staging.fisiohome.id";

export async function apiFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("API request failed");
  return res.json();
}
```

---

## Dashboard Requirements
- Login page (if required by API)
- Dashboard overview with summary cards (KPIs)
- Data tables with pagination and search
- Detail pages

---

## Development Rules
- TypeScript strict mode
- Reusable components
- No console.log in production
- Secure token handling (no client exposure)
- Use environment variables

```env
NEXT_PUBLIC_API_BASE_URL=https://api-staging.fisiohome.id
```

---

## Output Expectations
- Production-ready code
- Clean, scalable architecture
- Folder structure:
  - app/
  - components/
  - lib/
  - types/
