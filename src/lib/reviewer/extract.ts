import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

export async function extractText(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const ext = filename.split(".").pop()?.toLowerCase();

  if (ext === "docx") {
    return extractDocx(buffer);
  } else if (ext === "pdf") {
    return extractPdf(buffer);
  }

  throw new Error(`Unsupported file format: .${ext}. Use .docx or .pdf files.`);
}

async function extractDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

async function extractPdf(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getText();
    if (!result.text || result.text.trim().length === 0) {
      throw new Error(
        "Could not extract text from the PDF. The file may be scanned/image-based."
      );
    }
    return result.text;
  } finally {
    await parser.destroy().catch(() => {});
  }
}
