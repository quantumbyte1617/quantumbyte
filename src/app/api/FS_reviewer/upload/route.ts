import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { extractText } from "@/lib/reviewer/extract";
import { setSession } from "@/lib/reviewer/store";

export const maxDuration = 60;

const ALLOWED_EXTENSIONS = new Set(["pdf", "docx"]);
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

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
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { detail: `${label} file is too large (max 20 MB)` },
          { status: 400 }
        );
      }
    }

    // Extract text from both files
    const [arabicBuffer, englishBuffer] = await Promise.all([
      arabicFile.arrayBuffer().then((ab) => Buffer.from(ab)),
      englishFile.arrayBuffer().then((ab) => Buffer.from(ab)),
    ]);

    let arabicText: string;
    let englishText: string;

    try {
      arabicText = await extractText(arabicBuffer, arabicFile.name);
    } catch (err) {
      console.error("[FS_reviewer] Arabic extraction failed:", err);
      return NextResponse.json(
        { detail: `Failed to extract text from Arabic file: ${err instanceof Error ? err.message : "Unknown error"}` },
        { status: 422 }
      );
    }

    try {
      englishText = await extractText(englishBuffer, englishFile.name);
    } catch (err) {
      console.error("[FS_reviewer] English extraction failed:", err);
      return NextResponse.json(
        { detail: `Failed to extract text from English file: ${err instanceof Error ? err.message : "Unknown error"}` },
        { status: 422 }
      );
    }

    if (!arabicText.trim()) {
      return NextResponse.json(
        { detail: "Could not extract any text from the Arabic file. It may be scanned/image-based." },
        { status: 422 }
      );
    }

    if (!englishText.trim()) {
      return NextResponse.json(
        { detail: "Could not extract any text from the English file. It may be scanned/image-based." },
        { status: 422 }
      );
    }

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
    console.error("[FS_reviewer] Upload route error:", error);
    const message =
      error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
