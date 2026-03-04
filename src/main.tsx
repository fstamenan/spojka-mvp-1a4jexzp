import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { FeedPage } from '@/pages/FeedPage'
import { MascotPage } from '@/pages/MascotPage'
import { LeaderboardPage } from '@/pages/LeaderboardPage'
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/feed",
    element: <FeedPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/mascot",
    element: <MascotPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/leaderboard",
    element: <LeaderboardPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  }
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)