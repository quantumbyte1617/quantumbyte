import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_SIZE = 50 * 1024 * 1024; // 50 MB
const BACKEND_URL = process.env.PDF_UNLOCKER_BACKEND_URL;

export async function POST(req: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { error: "PDF Unlocker backend is not configured." },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const file = formData.get("file");
  const password = formData.get("password");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!password || typeof password !== "string" || password.trim() === "") {
    return NextResponse.json({ error: "No password provided." }, { status: 400 });
  }
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File is too large (max 50 MB)." }, { status: 413 });
  }

  // Proxy to Railway Python backend
  const upstream = new FormData();
  upstream.append("file", file, file.name);
  upstream.append("password", password.trim());

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_URL}/unlock`, {
      method: "POST",
      body: upstream,
      signal: AbortSignal.timeout(25_000),
    });
  } catch (err) {
    console.error("Backend unreachable:", err);
    return NextResponse.json(
      { error: "Could not reach the PDF processing backend. Please try again." },
      { status: 502 }
    );
  }

  if (!backendRes.ok) {
    let msg = `Backend error (${backendRes.status})`;
    try {
      const data = await backendRes.json();
      if (data.detail) msg = data.detail;
    } catch { /* ignore */ }

    const status =
      backendRes.status === 401 ? 401
      : backendRes.status === 400 ? 422
      : 422;

    return NextResponse.json({ error: msg }, { status });
  }

  const pdfBytes = await backendRes.arrayBuffer();
  const baseName = file.name.replace(/\.pdf$/i, "");
  const filename = `${baseName}_unlocked.pdf`;

  return new Response(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
