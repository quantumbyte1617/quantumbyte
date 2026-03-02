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
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  return result.text;
}
