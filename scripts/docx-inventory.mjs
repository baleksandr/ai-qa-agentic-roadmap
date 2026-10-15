import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import AdmZip from 'adm-zip';
import { XMLParser } from 'fast-xml-parser';
import {
  countPdfMedia,
  DOCX_NAME,
  extractPartIiConcept,
  loadSourcePlainText,
  paragraphsFromText,
  resolveSourcePath,
  root,
} from './pdf-text.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function extractParagraphTexts(documentXml) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    removeNSPrefix: true,
  });
  const doc = parser.parse(documentXml);
  const body = doc?.document?.body;
  if (!body) return [];

  const paragraphs = [];
  const pList = body.p ?? [];
  const items = Array.isArray(pList) ? pList : [pList];

  for (const p of items) {
    const runs = p.r ?? [];
    const runList = Array.isArray(runs) ? runs : runs ? [runs] : [];
    let text = '';
    for (const r of runList) {
      if (r.t) {
        const t = r.t;
        text += typeof t === 'string' ? t : t['#text'] ?? '';
      }
    }
    const trimmed = text.replace(/\s+/g, ' ').trim();
    if (trimmed) paragraphs.push(trimmed);
  }
  return paragraphs;
}

function countDocxTables(xml) {
  return (xml.match(/<w:tbl[\s>]/g) ?? []).length;
}

function inventoryFromParagraphs(paragraphs, meta) {
  const conceptRe = /concept\s*(\d{1,2})\b/i;
  const labRe = /\bLAB\s*(\d)\b/i;
  const partRe = /part\s*(i{1,3}|iv|v|\d+)/i;

  const sections = [];
  let current = { title: 'Preamble', lines: [] };

  for (const line of paragraphs) {
    const isHeading =
      partRe.test(line) ||
      /^START HERE/i.test(line) ||
      /^PART\s/i.test(line) ||
      /^Concept\s*\d{1,2}/i.test(line) ||
      /^LAB\s*\d\b/i.test(line) ||
      /^Lab\s*\d\b/i.test(line) ||
      /^Fundamentals/i.test(line) ||
      /^Reference Library/i.test(line) ||
      /20 Agentic AI Concepts/i.test(line) ||
      /^1\. AI \/ LLM Fundamentals/i.test(line);

    if (isHeading && current.lines.length > 0) {
      sections.push(current);
      current = { title: line, lines: [] };
    } else if (isHeading) {
      current.title = line;
    } else {
      current.lines.push(line);
    }
  }
  if (current.lines.length > 0 || current.title) sections.push(current);

  const concepts = paragraphs.filter(
    (p) => /^Concept \d{1,2}\./i.test(p) && /—/.test(p),
  );
  const labs = paragraphs.filter((p) => /^LAB \d\./i.test(p));

  const out = [];
  out.push('# DOCX / PDF Inventory');
  out.push('');
  out.push(`Generated: ${new Date().toISOString()}`);
  out.push(`Source file: \`${meta.fileName}\` (${meta.kind})`);
  out.push(`Paragraphs / lines (non-empty): ${paragraphs.length}`);
  if (meta.pages != null) out.push(`PDF pages: ${meta.pages}`);
  if (meta.images != null) out.push(`Embedded images (PDF parse): ${meta.images}`);
  if (meta.tables != null) out.push(`Detected tables (PDF parse): ${meta.tables}`);
  if (meta.docxImages != null) out.push(`Embedded images (word/media): ${meta.docxImages}`);
  if (meta.docxTables != null) out.push(`Tables (w:tbl in document.xml): ${meta.docxTables}`);
  out.push('');
  out.push('## Fundamentals (повний розділ)');
  out.push('');
  const fundSubs = paragraphs.filter((p) => /^1\.\d+(\.\d+)?\s/.test(p));
  for (const s of fundSubs) out.push(`- ${s}`);
  out.push('');
  out.push('## PART II — Concept 01–20 (повні уроки, заголовки)');
  out.push('');
  for (let n = 1; n <= 20; n += 1) {
    const block = extractPartIiConcept(meta.fullText ?? '', n);
    const first = block?.split('\n')[0] ?? `Concept ${n} — не знайдено`;
    const lines = block ? block.split('\n').filter(Boolean).length : 0;
    out.push(`- **Concept ${String(n).padStart(2, '0')}** — ${first} (${lines} рядків у витягу)`);
  }
  out.push('');
  out.push('## Lab 0–9');
  out.push('');
  for (const l of labs) out.push(`- ${l}`);
  out.push('');
  out.push('## Ймовірні Concept-рядки (усі збіги в тексті)');
  out.push('');
  for (const c of concepts) out.push(`- ${c}`);
  out.push('');
  out.push('## Секції (евристика заголовків)');
  out.push('');
  for (const s of sections) {
    out.push(`### ${s.title}`);
    out.push(`- Рядків у блоці: ${s.lines.length}`);
    if (s.lines[0]) out.push(`- Перший рядок: ${s.lines[0].slice(0, 120)}…`);
    out.push('');
  }

  return out.join('\n');
}

async function main() {
  const src = resolveSourcePath();
  if (!src) {
    console.error(`Source not found. Expected DOCX or PDF in source/:`);
    console.error(`  ${DOCX_NAME}`);
    process.exit(1);
  }

  let paragraphs = [];
  let meta = { fileName: src.name, kind: src.kind, fullText: '' };

  if (src.kind === 'docx') {
    const zip = new AdmZip(src.path);
    const entry = zip.getEntry('word/document.xml');
    if (!entry) {
      console.error('Invalid DOCX: missing word/document.xml');
      process.exit(1);
    }
    const xml = entry.getData().toString('utf8');
    paragraphs = extractParagraphTexts(xml);
    meta.docxImages = zip.getEntries().filter((e) => e.entryName.startsWith('word/media/')).length;
    meta.docxTables = countDocxTables(xml);
    meta.fullText = paragraphs.join('\n');
  } else {
    const fullText = await loadSourcePlainText();
    meta.fullText = fullText;
    paragraphs = paragraphsFromText(fullText);
    const media = await countPdfMedia();
    meta.pages = media.pages;
    meta.images = media.images;
    meta.tables = media.tables;
  }

  const docsDir = path.join(root, 'docs');
  fs.mkdirSync(docsDir, { recursive: true });
  const outPath = path.join(docsDir, 'DOCX_INVENTORY.md');
  fs.writeFileSync(outPath, inventoryFromParagraphs(paragraphs, meta), 'utf8');
  console.log(`Wrote ${outPath}`);
}

main();
