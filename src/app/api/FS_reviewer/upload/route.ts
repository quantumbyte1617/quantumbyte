import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { extractText } from "@/lib/reviewer/extract";
import { setSession } from "@/lib/reviewer/store";

const ALLOWED_EXTENSIONS = new Set(["pdf", "docx"]);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const arabicFile = formData.get("arabic_file") as File | null;
    const englishFile = formData.get("english_file") as File | null;

    if (!arabicFile || !englishFile) {
      return NextResponse.json(
        { detail: "Both arabic_file and english_file are required" },
        { status: 400 }
      );
    }

    // Validate extensions
    for (const [label, file] of [
      ["Arabic", arabicFile],
      ["English", englishFile],
    ] as const) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          { detail: `${label} file must be .pdf or .docx (got .${ext})` },
          { status: 400 }
        );
      }
    }

    // Extract text from both files
    const [arabicBuffer, englishBuffer] = await Promise.all([
      arabicFile.arrayBuffer().then((ab) => Buffer.from(ab)),
      englishFile.arrayBuffer().then((ab) => Buffer.from(ab)),
    ]);

    const [arabicText, englishText] = await Promise.all([
      extractText(arabicBuffer, arabicFile.name),
      extractText(englishBuffer, englishFile.name),
    ]);

    const sessionId = randomUUID();

    setSession(sessionId, {
      status: "pending",
      progress: 0,
      current_step: "Files uploaded. Ready to start review.",
      created_at: new Date().toISOString(),
      arabic_filename: arabicFile.name,
      english_filename: englishFile.name,
      arabic_text: arabicText,
      english_text: englishText,
    });

    return NextResponse.json({
      session_id: sessionId,
      message: "Files uploaded successfully",
      arabic_file: arabicFile.name,
      english_file: englishFile.name,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
