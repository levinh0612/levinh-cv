# Bilingual CV Web App

A personal CV built as a real product instead of a static PDF — content lives in a data file editable through an in-app dashboard, the page renders in English or Vietnamese, and printing produces a clean single-column PDF instead of whatever the browser feels like doing.

**Live:** https://cv-levinh.vercel.app

## Features

- **Bilingual** — every section (about, experience, education, achievements) switches between EN/VI at runtime
- **Dashboard editor** — update CV content (experience bullets, skills, achievements) through a UI backed by a typed data model, no manual JSON editing needed for day-to-day changes
- **Dark mode**
- **Print-perfect PDF export** — a dedicated `@media print` stylesheet drives `window.print()` so the downloaded PDF matches the on-screen layout exactly, single-column, no orphaned pages
- **Responsive** — same content, laid out for screen and print independently

## Tech Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router v7

## Run locally

```bash
npm install
npm run dev
```
