import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import AdmZip from 'adm-zip';
import mammoth from 'mammoth';
import { XMLParser } from 'fast-xml-parser';
import {
  PDF_NAME,
  DOCX_NAME,
  root,
  loadSourcePlainText,
  cleanExtractedText,
} from './pdf-text.mjs';

export { root, DOCX_NAME, PDF_NAME };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const ASSETS_PUBLIC_DIR = path.join(root, 'public', 'course-assets');

export function docxPath() {
  return path.join(root, 'source', DOCX_NAME);
}

export function pdfPath() {
  return path.join(root, 'source', PDF_NAME);
}

export function hasDocx() {
  return fs.existsSync(docxPath());
}

export function hasPdf() {
  return fs.existsSync(pdfPath());
}

function ensureArray(v) {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

export function parseDocxXml() {
  const zip = new AdmZip(docxPath());
  const xml = zip.readAsText('word/document.xml');
  const parser = new XMLParser({
    ignoreAttributes: false,
    removeNSPrefix: true,
    preserveOrder: true,
  });
  const doc = parser.parse(xml);
  const media = zip
    .getEntries()
    .filter((e) => e.entryName.startsWith('word/media/'))
    .map((e) => e.entryName);
  const tables = (xml.match(/<w:tbl[\s>]/g) ?? []).length;
  return { zip, xml, doc, media, tables };
}

function textFromRuns(pNode) {
  const parts = [];
  for (const item of ensureArray(pNode)) {
    if (item['#name'] !== 'p') continue;
    for (const child of ensureArray(item)) {
      if (child['#name'] === 'r') {
        for (const rc of ensureArray(child)) {
          if (rc['#name'] === 't' && rc['#text']) parts.push(rc['#text']);
        }
      }
    }
  }
  return parts.join('').replace(/\s+/g, ' ').trim();
}

function isCodeParagraph(pNode) {
  for (const item of ensureArray(pNode)) {
    if (item['#name'] !== 'p') continue;
    for (const child of ensureArray(item)) {
      if (child['#name'] === 'pPr') {
        for (const pr of ensureArray(child)) {
          if (pr['#name'] === 'pStyle' && pr[':@']?.['@_w:val']) {
            const v = pr[':@']['@_w:val'].toLowerCase();
            if (v.includes('code') || v.includes('preformatted')) return true;
          }
        }
      }
      if (child['#name'] === 'r') {
        for (const rc of ensureArray(child)) {
          if (rc['#name'] === 'rPr') {
            for (const rp of ensureArray(rc)) {
              if (rp['#name'] === 'rStyle' && rp[':@']?.['@_w:val']?.toLowerCase().includes('code')) {
                return true;
              }
            }
          }
        }
      }
    }
  }
  return false;
}

export function extractDocxBlocks() {
  const { doc, xml } = parseDocxXml();
  const body = doc?.['w:document']?.[0]?.['w:body'];
  if (!body) return { paragraphs: [], codeSamples: [], tables: 0 };

  const paragraphs = [];
  const codeSamples = [];
  let tables = 0;

  for (const node of ensureArray(body)) {
    const name = node['#name'];
    if (name === 'p') {
      const t = textFromRuns([node]);
      if (t) {
        paragraphs.push(t);
        if (isCodeParagraph(node) && t.length > 2) codeSamples.push(t);
      }
    } else if (name === 'tbl') {
      tables += 1;
    }
  }

  const tblFromXml = (xml.match(/<w:tbl[\s>]/g) ?? []).length;
  return { paragraphs, codeSamples, tables: Math.max(tables, tblFromXml) };
}

let imageCounter = 0;

export async function convertDocxToMarkdown() {
  if (!hasDocx()) return null;
  fs.mkdirSync(ASSETS_PUBLIC_DIR, { recursive: true });
  imageCounter = 0;

  const result = await mammoth.convertToMarkdown(
    { path: docxPath() },
    {
      convertImage: mammoth.images.imgElement(async (image) => {
        imageCounter += 1;
        const buffer = await image.read();
        const ext =
          image.contentType === 'image/png'
            ? 'png'
            : image.contentType === 'image/jpeg'
              ? 'jpg'
              : 'bin';
        const fileName = `docx-${String(imageCounter).padStart(3, '0')}.${ext}`;
        fs.writeFileSync(path.join(ASSETS_PUBLIC_DIR, fileName), buffer);
        return { src: `/course-assets/${fileName}` };
      }),
    },
  );

  return {
    markdown: result.value,
    messages: result.messages,
    imageCount: imageCounter,
  };
}

export async function loadPlainText() {
  if (hasDocx()) {
    const { paragraphs } = extractDocxBlocks();
    return { kind: 'docx', text: paragraphs.join('\n') };
  }
  if (hasPdf()) {
    const text = await loadSourcePlainText();
    return { kind: 'pdf', text };
  }
  throw new Error('No DOCX or PDF in source/');
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
    for (const marker of ['\nПрактичний курс:', '\nReference Library', '\nLAB 0.']) {
      const i = text.indexOf(marker, start);
      if (i > start) {
        end = i;
        break;
      }
    }
  }
  return cleanExtractedText(text.slice(start, end));
}

export function extractLab(text, num) {
  const startMarker = `\nLAB ${num}.`;
  const start = text.indexOf(startMarker);
  if (start < 0) return null;
  const endMarker = num < 9 ? `\nLAB ${num + 1}.` : '\nПрактичний курс:';
  let end = text.length;
  if (num < 9) {
    const e = text.indexOf(endMarker, start + 1);
    if (e > start) end = e;
  } else {
    for (const marker of ['\nReference Library', '\nPART ', '\n-- ']) {
      const i = text.indexOf(marker, start + 10);
      if (i > start) {
        end = i;
        break;
      }
    }
  }
  return cleanExtractedText(text.slice(start, end));
}

export function extractReferenceLibrary(text) {
  return extractBetween(text, '\nReference Library', '\nПрактичний курс:') ??
    extractBetween(text, 'Reference Library', '\nLAB 0.');
}

export function auditTopicContent({ markdown, docxTableCount, docxImageCountInSection, sourceKind }) {
  const notes = [];
  let status = 'complete';
  const hasImages = /!\[[^\]]*\]\([^)]+\)/.test(markdown);
  const hasTables = /\|.+\|/.test(markdown) && /\|[-:]+\|/.test(markdown);
  const hasCode = /```/.test(markdown) || /^    \S/m.test(markdown);

  if (sourceKind !== 'docx') {
    status = 'partial';
  } else {
    if (docxTableCount > 0 && !hasTables) {
      status = 'partial';
      notes.push(`У DOCX ~${docxTableCount} таблиць у документі; у витягу markdown-таблиць не виявлено.`);
    }
    if (docxImageCountInSection > 0 && !hasImages) {
      status = 'partial';
      notes.push(`Очікується ~${docxImageCountInSection} зображень у розділі; у markdown немає ![]().`);
    }
  }

  return { status, notes, hasImages, hasTables, hasCode };
}
