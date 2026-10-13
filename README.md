# ClientFlow – Client Management, Consultation & Portal Platform

ClientFlow is an enterprise-grade client management, consultation scheduling, and client portal web application designed for modern business owners, consultants, and service agencies.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Admin Dashboard

Visit [http://localhost:3000/admin](http://localhost:3000/admin) to manage client inquiries, review projects, and publish thought-leadership articles.

- **Default Password**: `admin2024`
- To customize the admin password, set `ADMIN_PASSWORD` in your environment.

---

## 🚢 Deploying to Vercel (Production)

Deploying the `clientmanage` branch to Vercel as an independent application:

1. **Import Project into Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard) and click **"Add New..."** ➔ **"Project"**.
   - Select the `Shekhar938/ll` repository.

2. **Configure Production Branch**:
   - Change **Production Branch** from `master` to **`clientmanage`**.
   - Set **Project Name** (e.g. `clientflow-portal`).

3. **Add Environment Variables**:
   In the Vercel project configuration, add:
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - `ADMIN_PASSWORD`: Your admin dashboard password (defaults to `admin2024`).
   - `SESSION_SECRET`: A secure random string for encrypted sessions.
   - `POSTGRES_URL` *(Optional)*: Vercel Postgres or external PostgreSQL database connection string. If omitted, the application seamlessly runs on its built-in in-memory database with pre-populated demo accounts.

4. **Click "Deploy"**:
   - Vercel will automatically build the application and assign a live production URL.

---

## 🔧 Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | Optional | Built-in fallback | Powers live strategic triage and Editorial Copilot |
| `POSTGRES_URL` / `DATA_POSTGRES_URL` | Optional | In-memory fallback | PostgreSQL database connection string |
| `ADMIN_PASSWORD` | Optional | `admin2024` | Admin dashboard authentication password |
| `SESSION_SECRET` | Optional | Built-in key | Secret key for signing session tokens |
| `NEXT_PUBLIC_SITE_URL` | Optional | `https://clientflow.app` | Canonical URL for SEO and sitemap generation |

---

## 🌟 Key Features

- **Client Portal** – Secure login for clients to track engagement progress, edit project details, and access assigned consultant notes.
- **5-Step Consultation Engine** – Client contact details, service category selection, scheduling preferences, and encrypted document uploads.
- **Strategic AI Triage** – Automated project categorization, priority scoring, document checklists, and milestone recommendations.
- **Admin Dashboard** – Real-time project overview, search/filtering, status updates, and client dossiers.
- **Articles & Knowledge Base** – Integrated markdown publishing suite with built-in AI Editorial Copilot.
- **Automated Database Auto-Healing** – Auto-creates PostgreSQL schema tables and seeds initial data on first launch.
