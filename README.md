# SPojka - Gamified High School Social Platform

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2Ffstamenan%2FSpojka)

SPojka is a gamified, mobile-first social platform designed specifically for high school students. It functions as a class-based "Reddit" where students engage through posts, comments, and teacher-led quizzes to earn XP. This XP drives the evolution of a personal mascot through three distinct stages: **Egg** (0-100 XP), **Little Cat** (101-500 XP), and **Big Cat** (501+ XP). Classes compete on a school-wide leaderboard, ranked by their normalized average XP (Total Class XP ÷ Student Count).

Built with a "Kid Playful" design aesthetic, SPojka focuses on high-contrast colors, bold typography, and smooth micro-interactions to create an engaging, distraction-free educational environment.

## 🚀 Key Features

- **Gamified Mascot System**: Earn XP to evolve your companion from an Egg to a Big Cat.
- **Class-Based Feed**: Interact with classmates through posts and flat comments.
- **Teacher Tools**: Teachers can create pinned announcements and 5-question quizzes.
- **Interactive Quizzes**: Complete untimed text-based quizzes for significant XP boosts (25 XP each).
- **Normalized Leaderboard**: Fair competition between classes of different sizes based on average student performance.
- **"Kid Playful" UI**: Mobile-first architecture with thick borders, solid shadows, and vibrant colors.

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router 6, Tailwind CSS
- **State Management**: Zustand (Subscription-based, high-performance)
- **Animations**: Framer Motion, Canvas Confetti
- **Backend**: Cloudflare Workers (Hono Framework)
- **Persistence**: Cloudflare Durable Objects (Stateful storage with IndexedEntity pattern)
- **Icons & UI**: Lucide React, Shadcn UI
- **Utilities**: Date-fns, Zod, CLSX

## 📂 Project Structure

- `src/`: React application code, components, and pages.
- `worker/`: Cloudflare Worker source code and Durable Object logic.
- `shared/`: Shared types and mock data used by both frontend and backend.
- `public/`: Static assets.

## 💻 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (Required for package management and scripts)
- Cloudflare Wrangler (For local worker development)

### Installation

1. Clone the repository.
2. Install dependencies using Bun:
   ```bash
   bun install
   ```
3. The project includes a bootstrap script that runs automatically to configure the project name and environment.

### Local Development

To start the development server for both the frontend and the worker:

```bash
# Start the Vite development server
bun run dev
```

The application will be available at `http://localhost:3000`.

## 📡 API Patterns

The backend uses a single `GlobalDurableObject` to manage multiple entities (User, Class, Post, Comment, Quiz). 
- All API endpoints are prefixed with `/api/`.
- Data persistence follows the `IndexedEntity` pattern for efficient listing and retrieval within the Durable Object.

## 🚀 Deployment

### Manual Deployment

Deploy to Cloudflare Pages and Workers using Wrangler:

```bash
bun run deploy
```

### Aurelia Deployment

For a seamless one-click deployment experience to your Cloudflare account, use the button below:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2Ffstamenan%2FSpojka)

## ⚖️ XP Rules (Hardcoded)

- **Post Creation**: +10 XP
- **Commenting**: +5 XP
- **Completing a Quiz**: +25 XP
- **Receiving an Upvote**: +2 XP

## 🎨 Design Tokens

- **Primary Blue**: `#2563EB`
- **Success Green**: `#22C55E`
- **Surface White**: `#FFFFFF`
- **Background**: `#F8FAFC`
- **Border**: 2px thick with subtle shadows for the "Kid Playful" aesthetic.