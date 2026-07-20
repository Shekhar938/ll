# NyayaConnect – Legal Consultation Platform

A premium, mobile-first legal consultation web application for Indian advocates.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Panel

Visit [http://localhost:3000/admin](http://localhost:3000/admin)

Default password: `nyaya2024`

To change the admin password, set the environment variable:
```
ADMIN_PASSWORD=your_secure_password
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── consult/          # Consultation CRUD APIs
│   │   └── admin/            # Admin auth APIs
│   ├── admin/                # Admin panel pages
│   ├── consult/              # Consultation form
│   ├── success/              # Thank you page
│   └── page.tsx              # Landing page
├── components/
│   ├── admin/                # Admin UI components
│   ├── consult/              # Multi-step form
│   └── landing/              # Landing page sections
└── lib/
    ├── store.ts              # JSON file-based data store
    ├── types.ts              # TypeScript interfaces
    ├── auth.ts               # Cookie-based session auth
    ├── ai.ts                 # Mock AI case analysis
    └── utils.ts              # Shared constants & helpers
data/
└── consultations.json        # Auto-created on first submission
```

## 🌟 Features

- **Landing Page** – Hero, Practice Areas (12), Why Us, Testimonials carousel, FAQ accordion, Footer
- **5-Step Consultation Form** – Personal Info, Legal Matter, Priority, Document Upload, Review
- **Document Upload** – Drag & drop, PDF/DOCX/images, 20MB limit
- **AI Case Analysis** – Automated summary, risk level, keywords, next steps (no API key needed)
- **Admin Dashboard** – Stats, filterable data table, status management
- **Client Details** – AI summary, case info, document list, internal notes
- **PWA Ready** – Installable on Android

## 🚢 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Set environment variable on Vercel: `ADMIN_PASSWORD=your_password`

> **Note:** Vercel is serverless – the JSON data store will reset on each deployment. For production, switch `src/lib/store.ts` to use a database like Vercel Postgres or Planetscale.

## 🔧 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `ADMIN_PASSWORD` | `nyaya2024` | Admin panel password |
| `SESSION_SECRET` | `nyaya-secret-key-change-in-production` | Cookie signing secret |
