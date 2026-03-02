import { ReviewSession } from "./types";

// In-memory store for review sessions
const sessions = new Map<string, ReviewSession>();

export function getSession(id: string): ReviewSession | undefined {
  return sessions.get(id);
}

export function setSession(id: string, session: ReviewSession): void {
  sessions.set(id, session);
}

export function updateSession(
  id: string,
  updates: Partial<ReviewSession>
): void {
  const session = sessions.get(id);
  if (session) {
    Object.assign(session, updates);
  }
}
