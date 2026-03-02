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

  if (session.status === "failed") {
    return NextResponse.json(
      { detail: `Review failed: ${session.current_step}` },
      { status: 500 }
    );
  }

  if (session.status !== "completed" || !session.results) {
    return NextResponse.json(
      { detail: "Review still in progress." },
      { status: 202 }
    );
  }

  return NextResponse.json(session.results);
}
