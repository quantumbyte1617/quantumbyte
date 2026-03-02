import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/reviewer/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: sessionId } = await params;
  const session = getSession(sessionId);

  if (!session) {
    return NextResponse.json(
      { detail: "Session not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    session_id: sessionId,
    status: session.status,
    progress: session.progress,
    current_step: session.current_step,
  });
}
