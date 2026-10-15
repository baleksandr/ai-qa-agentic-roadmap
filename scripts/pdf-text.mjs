import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFParse } from 'pdf-parse';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const root = path.join(__dirname, '..');
export const SOURCE_BASENAME =
  '10_Lab_2_AI_for_QA_Agentic_Engineering_From_Zero_Under_the_Hood_v10_Lab_Updated';
export const DOCX_NAME = `${SOURCE_BASENAME}.docx`;
export const PDF_NAME = `${SOURCE_BASENAME}.pdf`;

export function resolveSourcePath() {
  const sourceDir = path.join(root, 'source');
  const docxPath = path.join(sourceDir, DOCX_NAME);
  if (fs.existsSync(docxPath)) return { kind: 'docx', path: docxPath, name: DOCX_NAME };
  const pdfPath = path.join(sourceDir, PDF_NAME);
  if (fs.existsSync(pdfPath)) return { kind: 'pdf', path: pdfPath, name: PDF_NAME };
  return null;
}

let cachedText = null;

export async function loadSourcePlainText() {
  if (cachedText) return cachedText;
  const cacheFile = path.join(root, 'docs', '_pdf-extract.txt');
  if (fs.existsSync(cacheFile)) {
    cachedText = fs.readFileSync(cacheFile, 'utf8');
    return cachedText;
  }
  const src = resolveSourcePath();
  if (!src || src.kind !== 'pdf') {
    throw new Error('PDF extract cache missing and no PDF in source/');
  }
  const data = fs.readFileSync(src.path);
  const parser = new PDFParse({ data });
  const result = await parser.getText();
  await parser.destroy();
  cachedText = result.text;
  fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
  fs.writeFileSync(cacheFile, cachedText, 'utf8');
  return cachedText;
}

export function cleanExtractedText(raw) {
  return raw
    .split('\n')
    .filter((line) => !/^--\s*\d+\s+of\s+\d+\s*--\s*$/.test(line.trim()))
    .filter((line) => !/Deep Study Guide v10/i.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function paragraphsFromText(text) {
  return cleanExtractedText(text)
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
}

export function extractBetween(text, startMarker, endMarker) {
  const start = text.indexOf(startMarker);
  if (start < 0) return null;
  const from = start;
  const end = endMarker ? text.indexOf(endMarker, from + startMarker.length) : text.length;
  if (end < 0) return null;
  return cleanExtractedText(text.slice(from, end));
}

export function extractPartIiConcept(text, num) {
  const partStart = text.indexOf('PART II.');
  if (partStart < 0) return null;
  const slice = text.slice(partStart);
  const headerRe = new RegExp(`\\nConcept ${num}\\. [^\\n]+`, 'i');
  const m = slice.match(headerRe);
  if (!m || m.index == null) return null;
  const start = partStart + m.index + 1;
  let end = text.length;
  if (num < 20) {
    const nextRe = new RegExp(`\\nConcept ${num + 1}\\. [^\\n]+`, 'i');
    const next = text.slice(start + 1).match(nextRe);
    if (next?.index != null) end = start + 1 + next.index;
  } else {
    for (const marker of ['\nПрактичний курс:', '\nLAB 0.']) {
      const i = text.indexOf(marker, start);
      if (i > start) {
        end = i;
        break;
      }
    }
  }
  return cleanExtractedText(text.slice(start, end));
}

export async function countPdfMedia() {
  const src = resolveSourcePath();
  if (!src || src.kind !== 'pdf') return { images: null, tables: null, pages: null };
  const data = fs.readFileSync(src.path);
  const parser = new PDFParse({ data });
  const info = await parser.getInfo();
  const pages = info.total ?? info.numPages ?? null;
  let images = 0;
  try {
    const img = await parser.getImage();
    for (const page of img.pages ?? []) {
      images += page.images?.length ?? 0;
    }
  } catch {
    images = null;
  }
  let tables = 0;
  try {
    const tbl = await parser.getTable();
    for (const page of tbl.pages ?? []) {
      tables += page.tables?.length ?? 0;
    }
  } catch {
    tables = null;
  }
  await parser.destroy();
  return { images, tables, pages };
}
