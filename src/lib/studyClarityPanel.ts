import { studyPanelMarkdown } from './studyPanelContent';

export type ClarityProcessPanel = {
  problem: string;
  simpleIdea: string;
  input: string;
  who: string;
  action: string;
  output: string;
  nextRecipient: string;
  why: string;
  teachingExample: string;
  risks: string;
  qa: string;
  deeper?: string;
};

/** Крок, який виконує код або людина (не пасивні дані). */
export function clarityProcessPanel(p: ClarityProcessPanel): string {
  const sections = [
    { label: 'Проблема', body: p.problem },
    { label: 'Проста ідея', body: p.simpleIdea },
    { label: 'Вхід (навчальний приклад)', body: p.input },
    { label: 'Хто виконує', body: p.who },
    { label: 'Що відбувається', body: p.action },
    { label: 'Вихід', body: p.output },
    { label: 'Кому передається', body: p.nextRecipient },
    { label: 'Навіщо цей крок', body: p.why },
    { label: 'Той самий приклад далі', body: p.teachingExample },
    { label: 'Що може піти не так', body: p.risks },
    { label: 'Як перевіряє QA', body: p.qa },
  ];
  if (p.deeper?.trim()) {
    sections.push({ label: 'Глибше', body: p.deeper });
  }
  return studyPanelMarkdown(sections);
}

export type ClarityDataPanel = {
  problem: string;
  simpleIdea: string;
  whatItIs: string;
  whoPrepared: string;
  contains: string;
  whoUsesNext: string;
  teachingExample: string;
  risks: string;
  qa: string;
  deeper?: string;
};

/** Вузол «дані» (Chunks, Index як сховище) — без шаблону «хто створює?». */
export function clarityDataPanel(p: ClarityDataPanel): string {
  const sections = [
    { label: 'Проблема', body: p.problem },
    { label: 'Проста ідея', body: p.simpleIdea },
    { label: 'Що це за дані', body: p.whatItIs },
    { label: 'Хто підготував', body: p.whoPrepared },
    { label: 'Що містить', body: p.contains },
    { label: 'Хто використовує далі', body: p.whoUsesNext },
    { label: 'Той самий приклад далі', body: p.teachingExample },
    { label: 'Що може піти не так', body: p.risks },
    { label: 'Як перевіряє QA', body: p.qa },
  ];
  if (p.deeper?.trim()) {
    sections.push({ label: 'Глибше', body: p.deeper });
  }
  return studyPanelMarkdown(sections);
}
