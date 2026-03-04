import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Application refactored to local data only per client request.
  // Worker routes kept for health checks and future scalability but ignored by frontend.
  app.get('/api/ping', (c) => ok(c, { message: 'pong' }));
}