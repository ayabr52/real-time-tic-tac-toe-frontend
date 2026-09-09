# 🎮 Real-Time Tic-Tac-Toe Client (Next.js 14)

A modern, responsive, multiplayer **Tic-Tac-Toe** web frontend built with **Next.js App Router**, **Tailwind CSS** (featuring a Glassmorphism UI), and **Laravel Echo / Pusher JS** for real-time WebSocket synchronization.

---

## ⚡ Features

- **Real-Time Synchronization:** Instant turn updates and board syncing via WebSockets without page refreshes.
- **Optimistic UI:** Instant local state updates for zero click latency with automatic error rollback.
- **Glassmorphism UI:** Aesthetic frosted-glass dark theme with glowing gradients and fluid transitions.
- **Victory Visuals:** Dynamic DOM confetti animations triggered upon game completion.
- **Room Lifecycle Management:** In-game capabilities for instant match resetting or complete room destruction.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Real-Time Client:** Laravel Echo & Pusher JS (`pusher-js`)

---

## ⚙️ Local Development Setup

### 1. Install Dependencies
```bash
npm install

2. Environment Configuration
Create a .env.local file in the project root:
NEXT_PUBLIC_REVERB_APP_KEY=local
NEXT_PUBLIC_REVERB_HOST=127.0.0.1
NEXT_PUBLIC_REVERB_PORT=8080
NEXT_PUBLIC_REVERB_SCHEME=http
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api

3. Run Development Server
```bash
npm run dev

Open http://localhost:3000 in your browser to view the application.

---

Created with ❤️ by IT. Aya
