import fs from 'node:fs';
import path from 'node:path';
import { PDFParse } from 'pdf-parse';
import {
  convertDocxToMarkdown,
  extractDocxBlocks,
  extractPartIiConcept,
  extractReferenceLibrary,
  extractLab,
  hasDocx,
  hasPdf,
  loadPlainText,
  parseDocxXml,
  root,
} from './docx-core.mjs';
import { PDF_NAME, DOCX_NAME, paragraphsFromText } from './pdf-text.mjs';

async function pdfStats() {
  if (!hasPdf()) return null;
  const data = fs.readFileSync(path.join(root, 'source', PDF_NAME));
  const parser = new PDFParse({ data });
  const text = await parser.getText();
  let images = 0;
  try {
    const img = await parser.getImage();
    for (const page of img.pages ?? []) images += page.images?.length ?? 0;
  } catch {
    images = null;
  }
  let tables = 0;
  try {
    const tbl = await parser.getTable();
    for (const page of tbl.pages ?? []) tables += page.tables?.length ?? 0;
  } catch {
    tables = null;
  }
  await parser.destroy();
  const paragraphs = paragraphsFromText(text.text);
  return {
    paragraphs: paragraphs.length,
    pages: text.total,
    images,
    tables,
    codeLike: paragraphs.filter((p) => /^(import |const |function |\{|\}|```)/.test(p)).length,
  };
}

function docxStatsSync() {
  if (!hasDocx()) return null;
  const blocks = extractDocxBlocks();
  const { media, tables } = parseDocxXml();
  return {
    paragraphs: blocks.paragraphs.length,
    tables,
    images: media.length,
    codeSamples: blocks.codeSamples.length,
    codePreview: blocks.codeSamples.slice(0, 15),
    paragraphList: blocks.paragraphs,
  };
}

async function main() {
  const out = [];
  out.push('# DOCX inventory (primary)');
  out.push('');
  out.push(`Generated: ${new Date().toISOString()}`);
  out.push('');

  if (!hasDocx()) {
    out.push('> **DOCX не знайдено** у `source/`. Покладіть файл і перезапустіть `npm run docx:inventory`.');
    out.push('');
  } else {
    const d = docxStatsSync();
    out.push(`File: \`${DOCX_NAME}\``);
    out.push(`- Абзаців (текст): **${d.paragraphs}**`);
    out.push(`- Таблиць (\`w:tbl\`): **${d.tables}**`);
    out.push(`- Файлів у \`word/media/\`: **${d.images}**`);
    out.push(`- Фрагментів коду (стилі/heuristic): **${d.codeSamples}**`);
    out.push('');
    out.push('### Приклади коду (перші рядки)');
    out.push('');
    for (const c of d.codePreview) out.push(`- \`${c.slice(0, 100)}${c.length > 100 ? '…' : ''}\``);
    out.push('');

    const mammoth = await convertDocxToMarkdown();
    if (mammoth) {
      fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
      fs.writeFileSync(path.join(root, 'docs', '_docx-full.md'), mammoth.markdown, 'utf8');
      out.push(
        `- Mammoth markdown: **${mammoth.markdown.length}** символів, **${mammoth.imageCount}** зображень у \`public/course-assets/\``,
      );
      out.push('');
    }

    const { text } = await loadPlainText();
    out.push('## Fundamentals — підрозділи');
    out.push('');
    for (const p of d.paragraphList.filter((x) => /^1\.\d+(\.\d+)?\s/.test(x))) out.push(`- ${p}`);
    out.push('');
    out.push('## PART II — Concept 01–20 (довжина витягу)');
    out.push('');
    for (let n = 1; n <= 20; n += 1) {
      const block = extractPartIiConcept(text, n);
      const lines = block ? block.split('\n').filter(Boolean).length : 0;
      out.push(`- Concept ${String(n).padStart(2, '0')}: **${lines}** рядків`);
    }
    out.push('');
    out.push('## Lab 0–9');
    out.push('');
    for (let n = 0; n <= 9; n += 1) {
      const block = extractLab(text, n);
      const lines = block ? block.split('\n').filter(Boolean).length : 0;
      out.push(`- Lab ${n}: **${lines}** рядків — ${block?.split('\n')[0]?.slice(0, 80) ?? 'не знайдено'}`);
    }
    out.push('');
    const ref = extractReferenceLibrary(text);
    out.push(`## Reference Library: **${ref ? ref.split('\n').filter(Boolean).length : 0}** рядків`);
    out.push('');
  }

  const pdf = await pdfStats();
  const compare = [];
  compare.push('# DOCX vs PDF — звірка');
  compare.push('');
  compare.push(`Generated: ${new Date().toISOString()}`);
  compare.push('');
  if (!pdf) {
    compare.push('PDF відсутній для порівняння.');
  } else if (!hasDocx()) {
    compare.push('| Метрика | PDF | DOCX |');
    compare.push('|--------|-----|------|');
    compare.push(`| Абзаці | ${pdf.paragraphs} | — |`);
    compare.push(`| Сторінок | ${pdf.pages ?? '—'} | — |`);
    compare.push(`| Зображення (парсер) | ${pdf.images ?? '—'} | — |`);
    compare.push(`| Таблиці (парсер) | ${pdf.tables ?? '—'} | — |`);
  } else {
    const d = docxStatsSync();
    compare.push('| Метрика | PDF | DOCX |');
    compare.push('|--------|-----|------|');
    compare.push(`| Абзаці / рядки | ${pdf.paragraphs} | ${d.paragraphs} |`);
    compare.push(`| Сторінок (лише PDF) | ${pdf.pages ?? '—'} | — |`);
    compare.push(`| Зображення | ${pdf.images ?? '—'} (PDF parse) | ${d.images} (media/) |`);
    compare.push(`| Таблиці | ${pdf.tables ?? '—'} (PDF parse) | ${d.tables} (w:tbl) |`);
    compare.push(`| Фрагменти коду | ${pdf.codeLike} (heuristic) | ${d.codeSamples} (стилі) |`);
    compare.push('');
    compare.push(
      '**Висновок:** PDF не зберігає таблиці й зображення надійно; **джерело правди для `migrationStatus` — DOCX**.',
    );
  }

  const docsDir = path.join(root, 'docs');
  fs.mkdirSync(docsDir, { recursive: true });
  fs.writeFileSync(path.join(docsDir, 'DOCX_INVENTORY.md'), out.join('\n'), 'utf8');
  fs.writeFileSync(path.join(docsDir, 'DOCX_VS_PDF.md'), compare.join('\n'), 'utf8');
  console.log('Wrote docs/DOCX_INVENTORY.md and docs/DOCX_VS_PDF.md');
}

main();
